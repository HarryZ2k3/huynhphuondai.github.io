import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error("Usage: pnpm new-project \"Project title\"");
  process.exit(1);
}

const slug = slugify(title);
const year = new Date().getFullYear();
const filePath = path.join(process.cwd(), "content", "projects", `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Project already exists: ${filePath}`);
  process.exit(1);
}

const source = `---
title: ${JSON.stringify(title)}
year: "${year}"
kind: Personal project
role: Information Technology Engineer
description: One clear sentence about the project and its result.
technologies: [Documentation]
coverImage: /images/projects/network-notes.svg
screenshots: []
featured: false
challenge: What problem made this project necessary?
approach: What did you do?
outcome: What changed after the work?
lessons: What did this teach you?
---

## Context

Write the project story with enough detail that another technical person can trust it.
`;

fs.writeFileSync(filePath, source);
console.log(`Created ${filePath}`);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
