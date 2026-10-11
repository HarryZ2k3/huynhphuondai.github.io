import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { getPosts, getSiteSettings } from "@/lib/content";
import { WritingIndex } from "@/components/WritingIndex";
import { absoluteUrl, assetPath } from "@/lib/site";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: settings.navigation.writing,
  description: settings.writing.description,
  alternates: { canonical: absoluteUrl("/writing/") },
};

export default function WritingPage() {
  const posts = getPosts().map(({ slug, title, date, description, readingTime, category, section }) => ({ slug, title, date, description, readingTime, category, section }));
  return (
    <>
      <section className="page-hero section-shell writing-hero">
        <p className="section-kicker">{settings.navigation.writing}</p>
        <h1>{settings.writing.heading}</h1>
        <p>{settings.writing.description}</p>
        <a className="text-link" href={assetPath("/rss.xml")}><Rss size={16} aria-hidden="true" /> Follow via RSS</a>
      </section>
      <section className="section-shell writing-index" aria-labelledby="writing-archive"><h2 className="sr-only" id="writing-archive">Writing archive</h2><WritingIndex posts={posts} /></section>
    </>
  );
}
