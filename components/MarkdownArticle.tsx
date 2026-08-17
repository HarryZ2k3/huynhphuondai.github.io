import { markdownToHtml } from "@/lib/content";

export function MarkdownArticle({ markdown }: { markdown: string }) {
  return <article className="prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />;
}
