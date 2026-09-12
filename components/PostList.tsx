import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

export type PostSummary = Pick<Post, "slug" | "title" | "date" | "description" | "readingTime" | "category" | "section">;

export function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-entry reveal" key={post.slug}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <div>
            <p className="entry-meta">{post.section ?? "Technical"}<span aria-hidden="true"> / </span>{post.readingTime} min read</p>
            <h3><Link href={`/writing/${post.slug}`}>{post.title}<ArrowUpRight size={19} aria-hidden="true" /></Link></h3>
            <p className="post-description">{post.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
