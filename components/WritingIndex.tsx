"use client";

import { useState } from "react";
import { PostList, type PostSummary } from "@/components/PostList";

const sections = ["All", "Technical", "Essays", "Journal"] as const;
export function WritingIndex({ posts }: { posts: PostSummary[] }) {
  const [section, setSection] = useState<string>("All");
  const filtered = section === "All" ? posts : posts.filter((post) => (post.section ?? "Technical") === section);
  return (
    <>
      <div className="writing-filters" role="group" aria-label="Filter writing by topic">
        {sections.map((item) => <button key={item} type="button" aria-pressed={section === item} onClick={() => setSection(item)}>{item}<span>{item === "All" ? posts.length : posts.filter((post) => (post.section ?? "Technical") === item).length}</span></button>)}
      </div>
      <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "post" : "posts"} in {section === "All" ? "all topics" : section}</p>
      {filtered.length ? <PostList posts={filtered} /> : <div className="empty-state"><h2>No entries here yet.</h2><p>The first entry is still to come.</p><button type="button" className="text-link" onClick={() => setSection("All")}>View all writing</button></div>}
    </>
  );
}
