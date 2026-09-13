import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export function readSiteContent(root = process.cwd()) {
  const directory = path.join(root, "content");
  const json = file => JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
  const collection = (name, extension) => {
    const folder = path.join(directory, name);
    if (!fs.existsSync(folder)) return [];
    return fs.readdirSync(folder).filter(file => file.endsWith(extension)).map(file => {
      if (extension === ".json") return json(path.join(name, file));
      const { data } = matter(fs.readFileSync(path.join(folder, file), "utf8"));
      return { ...data, slug: String(data.slug ?? file.slice(0, -extension.length)) };
    });
  };
  const articles = collection("blog", ".md");
  return {
    profile: json("profile.json"),
    appearance: {
      showWork: true, showWriting: true, showPersonal: true,
      ...(fs.existsSync(path.join(directory, "appearance.json")) ? json("appearance.json") : {}),
    },
    projects: collection("projects", ".md"),
    posts: articles.filter(post => !post.draft),
    drafts: articles.filter(post => post.draft),
    albums: collection("albums", ".json"),
  };
}

export const site = readSiteContent();
