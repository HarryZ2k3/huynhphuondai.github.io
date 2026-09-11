import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error("Usage: pnpm new-post \"Post title\"");
  process.exit(1);
}

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const filePath = path.join(process.cwd(), "content", "blog", `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Post already exists: ${filePath}`);
  process.exit(1);
}

const source = `---
title: ${JSON.stringify(title)}
description: One clear sentence about this post.
date: "${date}"
updated: "${date}"
tags: [Notes]
category: Field Notes
section: Journal
draft: true
featured: false
---

## Start Here

Write the useful thing plainly.
`;

fs.writeFileSync(filePath, source);
console.log(`Created ${filePath}`);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
