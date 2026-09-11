import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import matter from "gray-matter";
import sharp from "sharp";

export const hash = (value) => createHash("sha256").update(value).digest("hex");
export function safeTarget(id) {
  if (!/^(content\/(blog|projects)\/[a-z0-9][a-z0-9-]*\.md|content\/albums\/[a-z0-9][a-z0-9-]*\.json|content\/(profile|appearance)\.json)$/.test(id)) throw new Error("Invalid content path.");
  return id;
}
export function safeFile(root, relative) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(path.resolve(root) + path.sep)) throw new Error("Path is outside the workspace.");
  let current = target;
  while (current !== path.resolve(root)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error("Symbolic links are not allowed in content.");
    current = path.dirname(current);
  }
  return target;
}
const parse = (id, source) => id.endsWith(".md")
  ? (() => { const { data, content } = matter(source); return { coverImage: "", ...data, slug: String(data.slug ?? path.basename(id, ".md")), body: content.trim() }; })()
  : JSON.parse(source);
export const serialize = (id, value) => {
  if (!id.endsWith(".md")) return JSON.stringify(value, null, 2) + "\n";
  const { body = "", ...data } = value;
  return matter.stringify(body, data);
};
export function validate(id, value, publishing = false) {
  safeTarget(id);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Content must be an object.");
  if (JSON.stringify(value).length > 1000000) throw new Error("This entry exceeds the 1 MB text limit.");
  const collection = id.split("/")[1];
  if (["blog", "projects", "albums"].includes(collection)) {
    if (typeof value.title !== "string" || !value.title.trim()) throw new Error("A title is required.");
    const slug = path.basename(id).replace(/\.(md|json)$/, "");
    if (value.slug !== slug) throw new Error("The URL must match the filename; existing URLs cannot be renamed here.");
    if (typeof value.description !== "string") throw new Error("A description is required.");
  }
  if (["blog", "albums"].includes(collection) && (!/^\d{4}-\d{2}-\d{2}$/.test(value.date) || !Number.isFinite(Date.parse(value.date)) || new Date(value.date).toISOString().slice(0, 10) !== value.date)) throw new Error("Choose a valid publication date.");
  if (collection === "blog") {
    if (!["Technical", "Essays", "Journal"].includes(value.section)) throw new Error("Choose a writing section.");
    if (!Array.isArray(value.tags) || typeof value.body !== "string") throw new Error("Invalid article content.");
    if (publishing && value.draft) throw new Error("Mark the article ready for publication first.");
  }
  if (collection === "projects") {
    for (const key of ["technologies", "screenshots"]) if (!Array.isArray(value[key])) throw new Error(key + " must be a list.");
    for (const key of ["year", "role", "challenge", "approach", "outcome", "lessons"]) if (typeof value[key] !== "string") throw new Error(key + " must be text.");
  }
  if (collection === "albums") {
    if (!Array.isArray(value.photos)) throw new Error("An album must contain a photo list.");
    if (publishing && !value.photos.length) throw new Error("Add a photograph before publishing the album.");
    for (const photo of value.photos) {
      if (!photo.src || typeof photo.alt !== "string" || (publishing && !photo.alt.trim()) || !(photo.width > 0 && photo.height > 0)) throw new Error("Every photograph needs a source, dimensions and descriptive alt text.");
    }
  }
  if (id === "content/profile.json") {
    for (const key of ["name", "title", "location", "email", "currentFocus", "portraitImage"]) if (typeof value[key] !== "string") throw new Error("Invalid profile field: " + key);
    if (!value.hero || typeof value.hero.headline !== "string" || typeof value.hero.summary !== "string") throw new Error("Complete the homepage headline and summary.");
    for (const key of ["biography", "interests", "tools", "principles", "experience", "socials"]) if (!Array.isArray(value[key])) throw new Error("Invalid profile list: " + key);
  }
  if (id === "content/appearance.json" && !["green", "rose", "blue"].includes(value.accent)) throw new Error("Choose a supported accent.");
  function checkLinks(object) {
    if (!object || typeof object !== "object") return;
    for (const [key, val] of Object.entries(object)) {
      if (["href", "repository", "demo"].includes(key) && val && !/^https:\/\//i.test(val) && !(key === "href" && /^mailto:[^\s@]+@[^\s@]+$/i.test(val))) throw new Error("Use an https:// link or a valid mailto: email link.");
      if (["src", "coverImage", "portraitImage", "resumeFile"].includes(key) && val && (!/^\/(images|files)\/[a-zA-Z0-9_./-]+$/.test(val) || val.split("/").includes(".."))) throw new Error("Use an uploaded image or a local public file.");
      if (typeof val === "object") checkLinks(val);
    }
  }
  checkLinks(value);
}

export class ContentStore {
  constructor(repo, dataDir) {
    this.repo = fs.realpathSync(repo);
    this.root = dataDir ?? path.join(os.homedir(), ".local", "share", "portfolio-studio", hash(this.repo).slice(0, 12));
    this.root = path.resolve(this.root);
    if (this.root === this.repo || this.root.startsWith(this.repo + path.sep)) throw new Error("Private studio data must stay outside the Git repository.");
    fs.mkdirSync(this.root, { recursive: true, mode: 0o700 });
    this.root = fs.realpathSync(this.root);
    if (this.root === this.repo || this.root.startsWith(this.repo + path.sep)) throw new Error("Private studio data must stay outside the Git repository.");
    fs.mkdirSync(path.join(this.root, "media"), { recursive: true, mode: 0o700 });
    this.file = path.join(this.root, "drafts.json");
    this.state = fs.existsSync(this.file) ? JSON.parse(fs.readFileSync(this.file, "utf8")) : { version: 1, revision: 0, drafts: {}, media: [] };
  }
  persist() {
    this.state.revision++;
    const temporary = this.file + ".tmp";
    fs.writeFileSync(temporary, JSON.stringify(this.state, null, 2), { mode: 0o600 });
    if (fs.existsSync(this.file)) fs.copyFileSync(this.file, this.file + ".previous");
    fs.renameSync(temporary, this.file);
  }
  source(id) {
    const file = safeFile(this.repo, safeTarget(id));
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  }
  list() {
    const ids = ["content/profile.json", "content/appearance.json"];
    for (const [dir, ext] of [["blog", ".md"], ["projects", ".md"], ["albums", ".json"]]) {
      const folder = safeFile(this.repo, "content/" + dir);
      if (fs.existsSync(folder)) for (const file of fs.readdirSync(folder)) if (file.endsWith(ext)) ids.push("content/" + dir + "/" + file);
    }
    return [...new Set([...ids, ...Object.keys(this.state.drafts)])].flatMap(id => {
      const source = this.source(id);
      const draft = this.state.drafts[id];
      if (!source && !draft) return [];
      return [{ id, value: draft?.value ?? parse(id, source), base: source === null ? null : hash(source), draft: !!draft, published: source !== null, operation: draft?.operation ?? "save", conflict: !!draft && draft.base !== (source === null ? null : hash(source)), updated: draft?.updated }];
    });
  }
  save({ id, value, base, revision, operation = "save" }) {
    if (revision !== this.state.revision) throw new Error("Another editor window changed your drafts. Reload before saving.");
    validate(id, value);
    if (!["save", "unpublish"].includes(operation)) throw new Error("Invalid operation.");
    if (operation === "unpublish" && !/content\/(blog|projects|albums)\//.test(id)) throw new Error("This item cannot be unpublished.");
    const source = this.source(id);
    const actualBase = source === null ? null : hash(source);
    if (actualBase !== base) throw new Error("The source file changed outside Studio. Reload and reconcile the changes first.");
    const previous = this.state.drafts[id];
    if (previous && previous.base !== base) throw new Error("This draft conflicts with the repository. Export a backup before discarding it.");
    this.state.drafts[id] = { value, base, operation, updated: new Date().toISOString() };
    this.persist();
    return this.state.revision;
  }
  discard(id, revision) {
    safeTarget(id);
    if (revision !== this.state.revision) throw new Error("Drafts changed. Reload first.");
    delete this.state.drafts[id];
    this.persist();
  }
  async upload(name, bytes) {
    if (bytes.length > 20 * 1024 * 1024) throw new Error("Upload files up to 20 MB.");
    const uuid = randomUUID();
    let data, filename, width, height;
    if (/\.pdf$/i.test(name)) {
      if (bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error("This is not a PDF.");
      data = bytes; filename = uuid + ".pdf";
    } else {
      const result = await sharp(bytes, { limitInputPixels: 40000000, animated: false }).rotate().resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer({ resolveWithObject: true });
      data = result.data; width = result.info.width; height = result.info.height; filename = uuid + ".webp";
    }
    fs.writeFileSync(safeFile(this.root, "media/" + filename), data, { mode: 0o600 });
    const item = { filename, name: path.basename(name).slice(0, 160), src: (filename.endsWith(".pdf") ? "/files/studio/" : "/images/studio/") + filename, width, height, size: data.length };
    this.state.media.push(item);
    this.persist();
    return item;
  }
  review(ids, preview = false) {
    if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length) throw new Error("Select at least one saved draft.");
    const drafts = ids.map(id => {
      safeTarget(id);
      const draft = this.state.drafts[id];
      if (!draft) throw new Error("The selected draft no longer exists.");
      const source = this.source(id);
      if (draft.base !== (source === null ? null : hash(source))) throw new Error("Source conflict: " + id);
      if (draft.operation !== "unpublish") validate(id, draft.value, !preview);
      return { id, ...draft, value: preview && id.startsWith("content/blog/") ? { ...draft.value, draft: false } : draft.value };
    });
    const text = JSON.stringify(drafts.filter(d => d.operation !== "unpublish").map(d => d.value));
    const media = this.state.media.filter(m => text.includes(m.src));
    const files = [...drafts.map(d => ({ path: d.id, action: d.operation === "unpublish" ? "Remove from site" : d.base === null ? "Add" : "Update" })), ...media.map(m => ({ path: "public" + m.src, action: "Publish upload" }))];
    return { revision: this.state.revision, ids, drafts, media, files, token: hash(JSON.stringify({ drafts, media, revision: this.state.revision })) };
  }
  overlay(destination, review) {
    for (const draft of review.drafts) {
      const file = safeFile(destination, draft.id);
      if (draft.operation === "unpublish") { if (fs.existsSync(file)) fs.unlinkSync(file); }
      else {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, serialize(draft.id, draft.value));
      }
    }
    for (const media of review.media) {
      const file = safeFile(destination, "public" + media.src);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.copyFileSync(safeFile(this.root, "media/" + media.filename), file);
    }
  }
  backup() {
    return { ...this.state, exported: new Date().toISOString(), uploads: this.state.media.map(m => ({ filename: m.filename, base64: fs.readFileSync(safeFile(this.root, "media/" + m.filename)).toString("base64") })) };
  }
}
