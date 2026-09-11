import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const missing = [];

const profile = JSON.parse(fs.readFileSync(path.join(root, "content/profile.json"), "utf8"));
checkAsset(profile.portraitImage, "Profile");
checkAsset(profile.resumeFile, "Profile");
for (const post of readMarkdownCollection("content/blog")) checkAsset(post.data.coverImage, post.file);

for (const project of readMarkdownCollection("content/projects")) {
  checkAsset(project.data.coverImage, project.file);
  parseArray(project.data.screenshots).forEach((asset) => checkAsset(asset, project.file));
}

for (const album of readJsonCollection("content/albums")) {
  checkAsset(album.coverImage, album.title);
  for (const photo of album.photos ?? []) {
    checkAsset(photo.src, album.title);
  }
}

if (missing.length > 0) {
  console.error("Missing image assets:");
  missing.forEach((entry) => console.error(`- ${entry.asset} referenced by ${entry.owner}`));
  process.exit(1);
}

console.log("All referenced local images exist.");

function checkAsset(asset, owner) {
  if (!asset || /^(https?:)?\/\//.test(asset) || asset.startsWith("data:")) return;
  const normalized = asset.startsWith("/") ? asset.slice(1) : asset;
  const assetPath = path.join(root, "public", normalized.replace(/^public\//, ""));
  if (!fs.existsSync(assetPath)) {
    missing.push({ asset, owner });
  }
}

function readMarkdownCollection(directory) {
  const directoryPath = path.join(root, directory);
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = fs.readFileSync(path.join(directoryPath, file), "utf8");
      return {
        file,
        data: parseFrontmatter(source).data,
      };
    });
}

function readJsonCollection(directory) {
  const directoryPath = path.join(root, directory);
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(directoryPath, file), "utf8")));
}

function parseFrontmatter(source) { return matter(source); }

function parseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (!value.startsWith("[") || !value.endsWith("]")) return [value];
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}
