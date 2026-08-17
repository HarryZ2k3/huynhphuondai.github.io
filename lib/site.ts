export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? "");
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://harryz2k3.github.io/Personal-Porfolio",
);

export function assetPath(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

function normalizeBasePath(value: string): string {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function normalizeSiteUrl(value: string): string {
  return value.replace(/\/+$/g, "");
}
