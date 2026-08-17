import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const missing = [];

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

function parseFrontmatter(source) {
  if (!source.startsWith("---")) return { data: {} };
  const closing = source.indexOf("\n---", 3);
  if (closing === -1) return { data: {} };
  const raw = source.slice(3, closing).trim();
  const data = {};

  for (const line of raw.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
  }

  return { data };
}

function parseArray(value) {
  if (!value) return [];
  if (!value.startsWith("[") || !value.endsWith("]")) return [value];
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}
