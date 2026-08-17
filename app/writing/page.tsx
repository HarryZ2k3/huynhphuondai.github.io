import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Practical notes, field reflections, and blog posts from Harry Huynh.",
};

export default function WritingPage() {
  const posts = getPosts();

  return (
    <>
      <section className="page-hero section-shell reveal">
        <p className="section-kicker">Writing</p>
        <h1>Blog posts for things worth remembering after the ticket is closed.</h1>
        <p>
          Use this tab for troubleshooting notes, lessons learned, field reflections, and personal essays. Every post is
          a Markdown file in the repository.
        </p>
      </section>

      <section className="section-shell section-block">
        <div className="writing-index">
          {posts.map((post) => (
            <Link className="writing-entry reveal" href={`/writing/${post.slug}`} key={post.slug}>
              <div>
                <span>
                  {post.category} · {formatDate(post.date)} · {post.readingTime} min read
                </span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </div>
              <ul className="tag-list" aria-label={`${post.title} tags`}>
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
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
