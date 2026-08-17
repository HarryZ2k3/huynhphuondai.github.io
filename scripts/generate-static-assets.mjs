import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "https://harryz2k3.github.io/Personal-Porfolio");

fs.mkdirSync(publicDir, { recursive: true });

const projects = readMarkdownCollection("content/projects");
const posts = readMarkdownCollection("content/blog")
  .filter((post) => post.data.draft !== "true")
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
const albums = readJsonCollection("content/albums");

const routes = [
  "/",
  "/work/",
  "/writing/",
  "/photos/",
  "/about/",
  "/contact/",
  ...projects.map((project) => `/work/${project.slug}/`),
  ...posts.map((post) => `/writing/${post.slug}/`),
  ...albums.map((album) => `/photos/${album.slug}/`),
];

write("sitemap.xml", buildSitemap(routes));
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`);
write("rss.xml", buildRss(posts.slice(0, 20)));
write(".nojekyll", "");

console.log(`Generated sitemap, robots, RSS, and .nojekyll for ${routes.length} routes.`);

function buildSitemap(urls) {
  const entries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(absoluteUrl(url))}</loc>
    <changefreq>${url === "/" ? "weekly" : "monthly"}</changefreq>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function buildRss(items) {
  const entries = items
    .map((post) => {
      const link = absoluteUrl(`/writing/${post.slug}/`);
      return `  <item>
    <title>${escapeXml(post.data.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid>${escapeXml(link)}</guid>
    <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.data.description ?? summarize(post.content))}</description>
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Harry Huynh Writing</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>Practical notes, field reflections, and personal writing.</description>
${entries}
</channel>
</rss>
`;
}

function readMarkdownCollection(directory) {
  const directoryPath = path.join(root, directory);
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = fs.readFileSync(path.join(directoryPath, file), "utf8");
      const { data, content } = parseFrontmatter(source);
      return {
        slug: data.slug ?? file.replace(/\.md$/, ""),
        data,
        content,
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
  if (!source.startsWith("---")) return { data: {}, content: source.trim() };

  const closing = source.indexOf("\n---", 3);
  if (closing === -1) return { data: {}, content: source.trim() };

  const raw = source.slice(3, closing).trim();
  const content = source.slice(closing + 4).trim();
  const data = {};

  for (const line of raw.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
  }

  return { data, content };
}

function summarize(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function write(file, content) {
  fs.writeFileSync(path.join(publicDir, file), content);
}

function absoluteUrl(route) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  return `${siteUrl}${normalized}`;
}

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/g, "");
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
