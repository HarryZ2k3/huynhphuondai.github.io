import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import os from "node:os";
import { readSiteContent, site } from "./site-content.mjs";

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
  ].forEach((file) => {
    assert.ok(fs.existsSync(path.join(out, file)), `${file} should exist`);
  });
});

test("exports exactly the current public content, including empty collections", () => {
  for (const [section, items] of [["work", site.projects], ["writing", site.posts], ["photos", site.albums]]) {
    const folder = path.join(out, section);
    const actual = fs.readdirSync(folder, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && fs.existsSync(path.join(folder, entry.name, "index.html")))
      .map(entry => entry.name).sort();
    assert.deepEqual(actual, items.map(item => item.slug).sort(), section);
  }
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
  assert.ok(home.includes(escapeHtml(site.profile.name)), "The current profile name should appear.");
});

test("generated feed and search assets exist", () => {
  assert.ok(fs.existsSync(path.join(out, "sitemap.xml")));
  assert.ok(fs.existsSync(path.join(out, "robots.txt")));
  assert.ok(fs.existsSync(path.join(out, "rss.xml")));
  const sitemap = readOut("sitemap.xml");
  for (const section of ["work", "writing", "photos", "about", "contact"]) {
    assert.ok(sitemap.includes(`/${section}/</loc>`), section);
  }
  for (const [section, items] of [["work", site.projects], ["writing", site.posts], ["photos", site.albums]]) {
    for (const item of items) assert.ok(sitemap.includes(escapeHtml(`/${section}/${item.slug}/`) + "</loc>"), item.slug);
  }
  for (const draft of site.drafts) {
    assert.ok(!sitemap.includes(escapeHtml(`/writing/${draft.slug}/`) + "</loc>"), "Drafts must not enter the sitemap.");
    assert.ok(!readOut("rss.xml").includes(escapeHtml(`/writing/${draft.slug}/`) + "</link>"), "Drafts must not enter RSS.");
  }
});

test("repo-backed content files are available", () => {
  [
    "content/profile.json",
  ].forEach((file) => {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  });
});

test("content expectations allow removing all samples and publishing a new article", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-test-content-"));
  try {
    fs.mkdirSync(path.join(temporary, "content", "blog"), { recursive: true });
    fs.writeFileSync(path.join(temporary, "content", "profile.json"), JSON.stringify({ name: "Test Writer" }));
    const empty = readSiteContent(temporary);
    assert.deepEqual([empty.posts, empty.projects, empty.albums], [[], [], []]);
    fs.writeFileSync(path.join(temporary, "content", "blog", "new-article.md"), "---\ntitle: New article\ndraft: false\n---\nA new article.");
    fs.writeFileSync(path.join(temporary, "content", "blog", "private.md"), "---\ntitle: Private\ndraft: true\n---\nPrivate draft.");
    const edited = readSiteContent(temporary);
    assert.deepEqual(edited.posts.map(post => post.slug), ["new-article"]);
    assert.deepEqual(edited.drafts.map(post => post.slug), ["private"]);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
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

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
