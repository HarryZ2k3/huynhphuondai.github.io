import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error("Usage: pnpm new-album \"Album title\"");
  process.exit(1);
}

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const filePath = path.join(process.cwd(), "content", "albums", `${slug}.json`);

if (fs.existsSync(filePath)) {
  console.error(`Album already exists: ${filePath}`);
  process.exit(1);
}

const album = {
  title,
  slug,
  description: "One clear sentence about this album.",
  date,
  location: "Location",
  coverImage: "/images/albums/saigon-01.svg",
  story: "Write the album note here.",
  photos: [
    {
      src: "/images/albums/saigon-01.svg",
      alt: "Describe the photo for accessibility",
      caption: "Photo caption",
      width: 1600,
      height: 1100,
    },
  ],
};

fs.writeFileSync(filePath, `${JSON.stringify(album, null, 2)}\n`);
console.log(`Created ${filePath}`);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
