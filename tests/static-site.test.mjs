import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const out = path.join(root, "out");

test("exports the main static pages", () => {
  [
    "index.html",
    "work/index.html",
    "writing/index.html",
    "photos/index.html",
    "about/index.html",
    "contact/index.html",
    "work/reliable-office-network/index.html",
    "writing/practical-troubleshooting-checklist/index.html",
    "photos/saigon-field-notes/index.html",
  ].forEach((file) => {
    assert.ok(fs.existsSync(path.join(out, file)), `${file} should exist`);
  });
});

test("site is public and has no login gate", () => {
  const home = readOut("index.html").toLowerCase();
  assert.equal(home.includes("chatgpt-auth"), false);
  assert.equal(home.includes("sign in with chatgpt"), false);
  assert.equal(home.includes("log in"), false);
});

test("navigation and personal sections are present", () => {
  const home = readOut("index.html");
  assert.match(home, /Home/);
  assert.match(home, /Work/);
  assert.match(home, /Writing/);
  assert.match(home, /Photos/);
  assert.match(home, /About/);
  assert.match(home, /Harry Huynh/);
});

test("generated feed and search assets exist", () => {
  assert.ok(fs.existsSync(path.join(out, "sitemap.xml")));
  assert.ok(fs.existsSync(path.join(out, "robots.txt")));
  assert.ok(fs.existsSync(path.join(out, "rss.xml")));
  assert.match(readOut("sitemap.xml"), /\/writing\/practical-troubleshooting-checklist\//);
});

test("repo-backed content files are available", () => {
  [
    "content/profile.json",
    "content/projects/reliable-office-network.md",
    "content/blog/practical-troubleshooting-checklist.md",
    "content/albums/saigon-field-notes.json",
  ].forEach((file) => {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  });
});

test("removed external hosting/admin scaffolding", () => {
  assert.equal(fs.existsSync(path.join(root, ".openai", "hosting.json")), false);
  assert.equal(fs.existsSync(path.join(root, "app", "chatgpt-auth.ts")), false);
  assert.equal(fs.existsSync(path.join(root, "worker", "index.ts")), false);

  const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(Boolean(manifest.devDependencies?.vinext), false);
  assert.equal(Boolean(manifest.devDependencies?.wrangler), false);
  assert.equal(Boolean(manifest.devDependencies?.["@cloudflare/vite-plugin"]), false);
});

function readOut(file) {
  return fs.readFileSync(path.join(out, file), "utf8");
}
