import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { ContentStore, safeFile } from "./content-store.mjs";

const directory = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(directory, "..");
const port = Number(process.env.STUDIO_PORT || 5174);
const origin = "http://localhost:" + port;
const token = randomBytes(32).toString("hex");
const store = new ContentStore(repo, process.env.STUDIO_DATA_DIR);
const previewRoot = path.join(store.root, "preview");
let job = { status: "idle", message: "" };
let busy = false;
let pendingReview;

await build({ entryPoints: [path.join(directory, "app.jsx")], bundle: true, outdir: path.join(directory, "dist"), platform: "browser", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, minify: true, sourcemap: false });

export function run(command, args, cwd = repo, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: "0", ...extraEnv }, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    const timeout = setTimeout(() => { child.kill("SIGTERM"); }, 600000);
    child.stdout.on("data", chunk => { output = (output + chunk).slice(-16000); });
    child.stderr.on("data", chunk => { output = (output + chunk).slice(-16000); });
    child.on("error", error => { clearTimeout(timeout); reject(error); });
    child.on("close", code => {
      clearTimeout(timeout);
      if (code === 0) resolve(output.trim());
      else reject(new Error(output || command + " failed."));
    });
  });
}
async function git(...args) { return run("git", args); }
async function publicationGuard() {
  if (process.env.STUDIO_DISABLE_PUBLISH === "1") throw new Error("Publishing is disabled in this test workspace.");
  if (await git("status", "--porcelain")) throw new Error("The repository has uncommitted changes. Review and commit the website setup before publishing content from Studio.");
  if (await git("branch", "--show-current") !== "main") throw new Error("Switch the website repository to main before publishing.");
  const remote = await git("remote", "get-url", "origin");
  if (!/^(https:\/\/github\.com\/|git@github\.com:)[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(remote)) throw new Error("Studio publishes only to the existing GitHub origin.");
  const head = await git("rev-parse", "HEAD");
  const remoteHead = (await git("ls-remote", "origin", "refs/heads/main")).split(/\s/)[0];
  if (remoteHead !== head) throw new Error("Local main and GitHub differ. Sync the repository before publishing; Studio will not merge or overwrite changes.");
  return { head, remote };
}
function snapshot(destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const item of ["app", "components", "lib", "content", "public", "scripts", "next.config.ts", "tsconfig.json", "next-env.d.ts", "package.json"]) {
    const from = path.join(repo, item);
    if (fs.existsSync(from)) fs.cpSync(from, path.join(destination, item), { recursive: true });
  }
  if (!fs.existsSync(path.join(destination, "node_modules"))) fs.symlinkSync(path.join(repo, "node_modules"), path.join(destination, "node_modules"), "dir");
}
async function buildSite(destination, basePath) {
  await run(process.execPath, ["scripts/generate-static-assets.mjs"], destination);
  await run(process.execPath, [path.join(repo, "node_modules/next/dist/bin/next"), "build", "--webpack"], destination, { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_TELEMETRY_DISABLED: "1" });
}
function startJob(task) {
  if (busy) throw new Error("Wait for the current operation to finish.");
  busy = true;
  job = { status: "working", message: "Preparing files..." };
  Promise.resolve().then(task).catch(error => { job = { status: "failed", message: error.message }; }).finally(() => { busy = false; });
}
async function preview(ids) {
  const review = store.review(ids, true);
  job.message = "Building a private preview. This can take a minute.";
  // Reuse only the private preview directory, never the checkout or published output.
  for (const folder of ["content", "public", "out", ".next"]) fs.rmSync(path.join(previewRoot, folder), { recursive: true, force: true });
  snapshot(previewRoot);
  store.overlay(previewRoot, review);
  await buildSite(previewRoot, "/preview");
  job = { status: "preview", message: "Private preview ready.", url: "/preview/" };
}
async function publish(request) {
  const review = store.review(request.ids);
  if (!pendingReview || request.token !== pendingReview.token || review.token !== request.token) throw new Error("The reviewed content changed. Review again.");
  if (review.media.some(m => m.filename.endsWith(".pdf")) && request.confirmPdf !== true) throw new Error("Confirm that the PDF is safe to make public.");
  const { head, remote } = await publicationGuard();
  if (head !== pendingReview.head) throw new Error("The repository changed after review.");
  const temporary = fs.mkdtempSync(path.join(store.root, "publish-"));
  let pushed = false;
  try {
    job.message = "Building and checking the selected content...";
    await run("git", ["clone", "--quiet", "--no-hardlinks", repo, temporary]);
    await run("git", ["remote", "set-url", "origin", remote], temporary);
    fs.symlinkSync(path.join(repo, "node_modules"), path.join(temporary, "node_modules"), "dir");
    store.overlay(temporary, review);
    const match = remote.replace(/\.git$/, "").match(/[:/]([^/]+)\/([^/]+)$/);
    await buildSite(temporary, match[2].toLowerCase() === match[1].toLowerCase() + ".github.io" ? "" : "/" + match[2]);
    await run("git", ["add", "--", ...review.files.map(f => f.path)], temporary);
    if (!(await run("git", ["diff", "--cached", "--name-only"], temporary))) throw new Error("No published content has changed.");
    for (const setting of ["user.name", "user.email"]) await run("git", ["config", setting, await git("config", setting)], temporary);
    await run("git", ["commit", "-m", "Publish personal website content"], temporary);
    await publicationGuard();
    job.message = "Pushing the reviewed commit to GitHub...";
    await run("git", ["push", "origin", "HEAD:refs/heads/main"], temporary);
    pushed = true;
    const sha = await run("git", ["rev-parse", "HEAD"], temporary);
    job = { status: "pushed", message: "Commit pushed. GitHub Pages deployment is not yet confirmed; check Actions before sharing.", sha, url: "https://github.com/" + match[1] + "/" + match[2] + "/actions" };
    try {
      if (await git("status", "--porcelain") || await git("rev-parse", "HEAD") !== head) throw new Error("Local files changed during publication.");
      await git("fetch", "origin", "main");
      await git("merge", "--ff-only", sha);
      for (const id of review.ids) delete store.state.drafts[id];
      store.persist();
    } catch {
      job.message += " The local checkout could not be updated. Sync it manually; your drafts have been retained.";
    }
  } finally {
    // Failed attempts remain local for recovery; never retry a possibly successful push automatically.
    if (pushed) fs.rmSync(temporary, { recursive: true, force: true });
  }
}
async function body(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 29 * 1024 * 1024) throw new Error("Request exceeds the 20 MB upload limit.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".ico": "image/x-icon", ".woff2": "font/woff2" };
function sendFile(response, root, relative) {
  let file = safeFile(root, relative || "index.html");
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = safeFile(root, path.relative(root, path.join(file, "index.html")));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
  response.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(response);
}
const server = http.createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
  try {
    const host = request.headers.host;
    if (![ "localhost:" + port, "127.0.0.1:" + port ].includes(host)) throw new Error("Unrecognized local host.");
    if (request.headers["sec-fetch-site"] === "cross-site") throw new Error("Cross-site access is not allowed.");
    const url = new URL(request.url, origin);
    const pathname = decodeURIComponent(url.pathname);
    const json = value => { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify(value)); };
    if (request.method === "POST") {
      if (request.headers.origin !== "http://" + host || request.headers["x-studio-token"] !== token || !request.headers["content-type"]?.startsWith("application/json")) throw new Error("Invalid local editor session. Reload Studio.");
      if (busy) throw new Error("Wait for the current operation to finish.");
      const data = await body(request);
      if (pathname === "/api/save") { store.save(data); pendingReview = undefined; return json({ revision: store.state.revision }); }
      if (pathname === "/api/discard") { store.discard(data.id, data.revision); return json({ revision: store.state.revision }); }
      if (pathname === "/api/upload") { const media = await store.upload(data.name, Buffer.from(data.base64, "base64")); return json({ media, revision: store.state.revision }); }
      if (pathname === "/api/preview") { store.review(data.ids, true); startJob(() => preview(data.ids)); return json({ started: true }); }
      if (pathname === "/api/review") {
        const review = store.review(data.ids);
        let guard, blocked;
        try { guard = await publicationGuard(); } catch (error) { blocked = error.message; }
        pendingReview = { ...review, head: guard?.head };
        return json({ files: review.files, token: review.token, blocked, pdf: review.media.some(m => m.filename.endsWith(".pdf")) });
      }
      if (pathname === "/api/publish") { startJob(() => publish(data)); return json({ started: true }); }
      throw new Error("Unknown operation.");
    }
    if (request.method !== "GET") { response.writeHead(405); return response.end(); }
    if (pathname === "/api/state") return json({ items: store.list(), media: store.state.media, revision: store.state.revision, job, busy, privateDirectory: store.root });
    if (pathname === "/api/job") return json({ ...job, busy });
    if (pathname === "/api/backup") { response.setHeader("Content-Disposition", 'attachment; filename="portfolio-private-backup.json"'); return json(store.backup()); }
    if (pathname.startsWith("/media/")) return sendFile(response, path.join(store.root, "media"), pathname.slice(7));
    if (pathname.startsWith("/images/") || pathname.startsWith("/files/")) {
      const media = store.state.media.find(m => m.src === pathname);
      return media ? sendFile(response, path.join(store.root, "media"), media.filename) : sendFile(response, path.join(repo, "public"), pathname.slice(1));
    }
    if (pathname.startsWith("/assets/")) return sendFile(response, path.join(repo, "public"), pathname.slice(8));
    if (pathname.startsWith("/preview/")) return sendFile(response, path.join(previewRoot, "out"), pathname.slice(9));
    if (pathname.startsWith("/dist/")) return sendFile(response, path.join(directory, "dist"), pathname.slice(6));
    if (pathname !== "/") { response.writeHead(404); return response.end("Not found"); }
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="studio-token" content="' + token + '"><title>Portfolio Studio</title><link rel="stylesheet" href="/dist/app.css"></head><body><div id="root"></div><script type="module" src="/dist/app.js"></script></body></html>');
  } catch (error) {
    response.statusCode = 400;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ error: error.message }));
  }
});
server.listen(port, "127.0.0.1", () => console.log("Portfolio Studio: " + origin + "\nPrivate data: " + store.root));
