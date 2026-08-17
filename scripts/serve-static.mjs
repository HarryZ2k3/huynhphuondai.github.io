import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 5173);
const host = process.argv[4] ?? "0.0.0.0";

if (!fs.existsSync(root)) {
  console.error(`Static directory not found: ${root}`);
  process.exit(1);
}

const server = http.createServer((request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const filePath = resolveRequestPath(requestUrl.pathname);

    if (!filePath) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentType(filePath),
      "Cache-Control": cacheHeader(filePath),
    });
    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500);
    response.end(error instanceof Error ? error.message : "Server error");
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
});

function resolveRequestPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidates = [];
  const directPath = safeJoin(root, decoded);

  if (directPath) candidates.push(directPath);
  if (directPath && !path.extname(directPath)) candidates.push(path.join(directPath, "index.html"));
  if (directPath && !path.extname(directPath)) candidates.push(`${directPath}.html`);

  for (const candidate of candidates) {
    if (!candidate.startsWith(root)) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      const indexPath = path.join(candidate, "index.html");
      if (fs.existsSync(indexPath)) return indexPath;
    }
  }

  return null;
}

function safeJoin(rootDir, pathname) {
  const normalized = pathname.replace(/^\/+/, "");
  const target = path.resolve(rootDir, normalized || "index.html");
  return target.startsWith(rootDir) ? target : null;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return (
    {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".xml": "application/xml; charset=utf-8",
      ".txt": "text/plain; charset=utf-8",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    }[extension] ?? "application/octet-stream"
  );
}

function cacheHeader(filePath) {
  return filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`)
    ? "public, max-age=31536000, immutable"
    : "no-cache";
}
