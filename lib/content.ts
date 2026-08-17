import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");

export type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  portraitImage: string;
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

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inCode = false;
  let codeLanguage = "";
  let codeLines: string[] = [];

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        html.push(
          `<pre class="code-block"><code data-language="${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`,
        );
        inCode = false;
        codeLanguage = "";
        codeLines = [];
      } else {
        closeParagraph();
        closeList();
        inCode = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      closeParagraph();
      closeList();
      html.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      closeParagraph();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      closeParagraph();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  closeParagraph();
  closeList();

  return html.join("\n");
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

function parseFrontmatter(source: string): { data: Record<string, unknown>; content: string } {
  if (!source.startsWith("---")) return { data: {}, content: source.trim() };

  const closing = source.indexOf("\n---", 3);
  if (closing === -1) return { data: {}, content: source.trim() };

  const raw = source.slice(3, closing).trim();
  const content = source.slice(closing + 4).trim();
  const data: Record<string, unknown> = {};

  raw.split("\n").forEach((line) => {
    const index = line.indexOf(":");
    if (index === -1) return;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    data[key] = parseValue(value);
  });

  return { data, content };
}

function parseValue(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return value.replace(/^["']|["']$/g, "");
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function estimateReadingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
