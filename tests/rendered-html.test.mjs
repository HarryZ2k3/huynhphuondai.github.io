import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the local-first personal website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Harry Huynh \| Personal Website<\/title>/i);
  assert.match(html, /Photo Gallery/);
  assert.match(html, /Notes I Want to Build Into Essays/);
  assert.match(html, /Local-first, no sign-in gate/);
  assert.match(html, /phuongdai\.saigon@gmail\.com/);
  assert.doesNotMatch(html, /signin-with-chatgpt|signout-with-chatgpt|Codex/);
});

test("keeps the project local-first and free of external auth wiring", async () => {
  const [css, page, layout, packageJson, viteConfig] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /MotionController/);
  assert.match(page, /galleryItems/);
  assert.match(page, /blogPosts/);
  assert.match(layout, /Harry Huynh \| Personal Website/);
  assert.match(packageJson, /"host": "vinext start --host 0\.0\.0\.0 --port 5173"/);
  assert.match(css, /@view-transition/);
  assert.match(css, /scroll-behavior:\s*smooth/);
  assert.doesNotMatch(page, /generated_images|it-workspace-hero|SkeletonPreview/);
  assert.doesNotMatch(viteConfig, /\.openai|sites-vite-plugin|hosting\.json/);

  await assert.rejects(access(new URL("app/chatgpt-auth.ts", templateRoot)));
  await assert.rejects(access(new URL(".openai/hosting.json", templateRoot)));
  await assert.rejects(access(new URL("build/sites-vite-plugin.ts", templateRoot)));
});
