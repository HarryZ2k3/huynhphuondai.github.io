import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { getPosts } from "@/lib/content";
import { WritingIndex } from "@/components/WritingIndex";
import { absoluteUrl, assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical notes, essays, and journal entries from Harry Huynh.",
  alternates: { canonical: absoluteUrl("/writing/") },
};

export default function WritingPage() {
  const posts = getPosts().map(({ slug, title, date, description, readingTime, category, section }) => ({ slug, title, date, description, readingTime, category, section }));
  return (
    <>
      <section className="page-hero section-shell writing-hero">
        <p className="section-kicker">Writing</p>
        <h1>A notebook, kept open.</h1>
        <p>What I learn at work, what I notice outside it, and the ideas that stay with me.</p>
        <a className="text-link" href={assetPath("/rss.xml")}><Rss size={16} aria-hidden="true" /> Follow via RSS</a>
      </section>
      <section className="section-shell writing-index" aria-labelledby="writing-archive"><h2 className="sr-only" id="writing-archive">Writing archive</h2><WritingIndex posts={posts} /></section>
    </>
  );
}
