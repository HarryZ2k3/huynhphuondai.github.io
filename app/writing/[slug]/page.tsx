import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { getPost, getPosts } from "@/lib/content";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProfile } from "@/lib/content";
import { absoluteUrl, assetPath } from "@/lib/site";

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
      canonical: absoluteUrl(`/writing/${post.slug}/`),
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

  const profile = getProfile();
  const related = getPosts().filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <section className="article-hero reading-shell">
        <Link className="breadcrumb" href="/writing">
          <ArrowLeft size={15} aria-hidden="true" /> All writing
        </Link>
        <p className="section-kicker">
          {post.section ?? post.category}
        </p>
        <h1>{post.title}</h1>
        <p className="article-deck">{post.description}</p>
        <div className="article-byline"><span>{profile.name}</span><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingTime} min read</span></div>
        <ul className="tag-list" aria-label="Post tags">
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </section>

      <section className="reading-shell article-shell">
        {post.coverImage && <img className="article-cover" src={assetPath(post.coverImage)} alt="" />}
        <MarkdownArticle markdown={post.content} />
      </section>
      <section className="reading-shell article-end">
        <p>Thanks for reading.</p><Link className="text-link" href="/contact">Continue the conversation <ArrowRight size={16} aria-hidden="true" /></Link>
        {related.length ? <div className="related-posts"><h2>Keep reading</h2>{related.map((item) => <Link key={item.slug} href={`/writing/${item.slug}`}>{item.title}<ArrowRight size={17} aria-hidden="true" /></Link>)}</div> : null}
      </section>
    </>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
