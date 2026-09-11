import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import matter from "gray-matter";
import { ContentStore, safeFile, safeTarget, serialize } from "../studio/content-store.mjs";

function fixture(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "studio-test-"));
  const repo = path.join(temp, "repo");
  fs.mkdirSync(path.join(repo, "content/blog"), { recursive: true });
  const store = new ContentStore(repo, path.join(temp, "private"));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  return { temp, repo, store };
}
const id = "content/blog/private-note.md";
const value = { title: "Private note", slug: "private-note", date: "2026-09-11", description: "A personal draft", section: "Journal", category: "Personal", tags: ["one, two"], body: "## Heading\n\n**Bold** and `a_b`.", draft: true };
test("drafts and uploads never touch the repository", async t => {
  const { repo, store } = fixture(t);
  store.save({ id, value, revision: 0, base: null });
  assert.equal(fs.existsSync(path.join(repo, id)), false);
  assert.equal(store.list()[0].draft, true);
  const bytes = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: "#216958" } }).jpeg().toBuffer();
  const media = await store.upload("portrait.jpg", bytes);
  assert.equal(media.width, 2200);
  assert.equal(media.height, 1100);
  const metadata = await sharp(fs.readFileSync(path.join(store.root, "media", media.filename))).metadata();
  assert.equal(metadata.exif, undefined);
  assert.equal(fs.existsSync(path.join(repo, "public")), false);
  assert.equal(store.backup().uploads.length, 1);
  assert.equal(new ContentStore(repo, store.root).list()[0].value.title, value.title);
});
test("rejects path traversal, symlinks and private data inside repository", t => {
  const { temp, repo } = fixture(t);
  assert.throws(() => safeTarget("content/blog/../../secret.md"));
  assert.throws(() => safeTarget("content/blog/Hello.md"));
  assert.throws(() => safeFile(repo, "../repo-other/secret"));
  assert.throws(() => new ContentStore(repo, path.join(repo, "private")));
  fs.symlinkSync(temp, path.join(repo, "linked"), "dir");
  assert.throws(() => safeFile(repo, "linked/secret"));
});
test("rejects stale windows and outside edits without losing draft", t => {
  const { store, repo } = fixture(t);
  store.save({ id, value, revision: 0, base: null });
  assert.throws(() => store.save({ id, value: { ...value, title: "Stale" }, revision: 0, base: null }), /Another editor/);
  fs.writeFileSync(path.join(repo, id), serialize(id, value));
  assert.throws(() => store.review([id]), /conflict/);
  assert.equal(store.list()[0].conflict, true);
  assert.equal(store.list()[0].value.title, "Private note");
});
test("review requires ready posts and publishes only selected referenced media", async t => {
  const { store, temp } = fixture(t);
  store.save({ id, value, revision: 0, base: null });
  assert.throws(() => store.review([id]), /ready/);
  assert.equal(store.review([id], true).drafts[0].value.draft, false);
  assert.equal(store.state.drafts[id].value.draft, true);
  const bytes = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#216958" } }).png().toBuffer();
  const included = await store.upload("included.png", bytes);
  await store.upload("private.png", bytes);
  store.save({ id, value: { ...value, draft: false, coverImage: included.src }, revision: store.state.revision, base: null });
  const review = store.review([id]);
  assert.equal(review.media.length, 1);
  const snapshot = path.join(temp, "snapshot");
  fs.mkdirSync(snapshot);
  store.overlay(snapshot, review);
  assert.equal(fs.existsSync(path.join(snapshot, "public" + included.src)), true);
  assert.equal(matter(fs.readFileSync(path.join(snapshot, id), "utf8")).data.draft, false);
});
test("frontmatter round-trips multiline and punctuation", () => {
  const article = { ...value, description: "First line\nSecond: line", tags: ["one, two", 'a "quote"'], draft: false };
  const decoded = matter(serialize(id, article));
  assert.equal(decoded.data.description, article.description);
  assert.deepEqual(decoded.data.tags, article.tags);
  assert.equal(decoded.content.trim(), article.body);
});
test("unpublish removes only the selected page from a snapshot", t => {
  const { store, repo, temp } = fixture(t);
  fs.writeFileSync(path.join(repo, id), serialize(id, value));
  const item = store.list()[0];
  store.save({ ...item, operation: "unpublish", revision: 0 });
  const snapshot = path.join(temp, "snapshot");
  fs.cpSync(repo, snapshot, { recursive: true });
  store.overlay(snapshot, store.review([id]));
  assert.equal(fs.existsSync(path.join(snapshot, id)), false);
  assert.equal(fs.existsSync(path.join(repo, id)), true);
});
