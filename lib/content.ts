import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { assetPath } from "./site";

const contentRoot = path.join(process.cwd(), "content");

export type Profile = {
  name: string;
  fullName?: string;
  personalNote?: string;
  education?: Array<{ institution: string; qualification: string; dates: string; detail: string }>;
  languages?: string[];
  qualifications?: string[];
  title: string;
  location: string;
  email: string;
  portraitImage: string;
  resumeFile?: string;
  currentFocus: string;
  hero: {
    headline: string;
    summary: string;
  };
  biography: string[];
  interests: string[];
  tools: string[];
  principles: string[];
  experience: Experience[];
  socials: Array<{ label: string; href: string }>;
};

export type Experience = {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string;
  achievements: string[];
  technologies: string[];
};

export type Project = {
  kind?: string;
  organization?: string;
  period?: string;
  title: string;
  slug: string;
  year: string;
  role: string;
  description: string;
  technologies: string[];
  repository?: string;
  demo?: string;
  coverImage: string;
  screenshots: string[];
  featured: boolean;
  challenge: string;
  approach: string;
  outcome: string;
  lessons: string;
  content: string;
};

export type Post = {
  section?: "Technical" | "Essays" | "Journal";
  title: string;
  slug: string;
  description: string;
  date: string;
  updated?: string;
  coverImage?: string;
  tags: string[];
  category: string;
  draft: boolean;
  featured: boolean;
  readingTime: number;
  content: string;
};

export type Album = {
  sample?: boolean;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  coverImage: string;
  story: string;
  camera?: string;
  photos: Array<{
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    camera?: string;
  }>;
};

export function getProfile(): Profile {
  return readJson<Profile>("profile.json");
}

export function getProjects(): Project[] {
  return readCollection<Project>("projects").sort((a, b) => Number(b.year) - Number(a.year));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getPosts(): Post[] {
  return readCollection<Post>("blog")
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getAlbums(): Album[] {
  return readJsonCollection<Album>("albums").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getAlbum(slug: string): Album | undefined {
  return getAlbums().find((album) => album.slug === slug);
}

export function getAppearance() {
  const defaults = { accent: "green", showWork: true, showWriting: true, showPersonal: true };
  const file = path.join(contentRoot, "appearance.json");
  return fs.existsSync(file) ? { ...defaults, ...JSON.parse(fs.readFileSync(file, "utf8")) } as typeof defaults : defaults;
}

export function markdownToHtml(markdown: string): string {
  return sanitizeHtml(marked.parse(markdown, { async: false }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "del"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "title", "loading"], code: ["class"] },
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      img: (_tag, attributes) => ({ tagName: "img", attribs: { ...attributes, src: attributes.src?.startsWith("/") && !attributes.src.startsWith("//") ? assetPath(attributes.src) : attributes.src, loading: "lazy" } }),
      a: (_tag, attributes) => ({ tagName: "a", attribs: { ...attributes, href: attributes.href?.startsWith("/") && !attributes.href.startsWith("//") ? assetPath(attributes.href) : attributes.href } }),
    },
  });
}

function readCollection<T extends { slug: string; content: string }>(directory: string): T[] {
  const directoryPath = path.join(contentRoot, directory);
  if (!fs.existsSync(directoryPath)) return [];
  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = fs.readFileSync(path.join(directoryPath, file), "utf8");
      const { data, content } = parseFrontmatter(source);
      const slug = String(data.slug ?? file.replace(/\.md$/, ""));
      return {
        ...data,
        slug,
        content,
        readingTime: estimateReadingTime(content),
      } as unknown as T;
    });
}

function readJsonCollection<T>(directory: string): T[] {
  const directoryPath = path.join(contentRoot, directory);
  if (!fs.existsSync(directoryPath)) return [];
  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson<T>(path.join(directory, file)));
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(contentRoot, relativePath), "utf8")) as T;
}

function parseFrontmatter(source: string) {
  return matter(source);
}

function estimateReadingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
