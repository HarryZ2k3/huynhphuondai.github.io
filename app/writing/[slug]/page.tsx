import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { getPost, getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: absoluteUrl(`/writing/${post.slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(`/writing/${post.slug}`),
      publishedTime: post.date,
      modifiedTime: post.updated,
    },
  };
}

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="article-hero section-shell reveal">
        <Link className="breadcrumb" href="/writing">
          Writing
        </Link>
        <p className="section-kicker">
          {post.category} · {formatDate(post.date)} · {post.readingTime} min read
        </p>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <ul className="tag-list" aria-label="Post tags">
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </section>

      <section className="section-shell article-shell reveal">
        <MarkdownArticle markdown={post.content} />
      </section>
    </>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
