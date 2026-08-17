import Link from "next/link";
import { getProfile } from "@/lib/content";

export function SiteFooter() {
  const profile = getProfile();

  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div>
          <strong>Harry Huynh</strong>
          <p>Personal site, portfolio, writing, and photography. Maintained through Git.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/work">Work</Link>
          <Link href="/writing">Writing</Link>
          <Link href="/photos">Photos</Link>
          <Link href="/about">About</Link>
          <a href={`mailto:${profile.email}`}>Email</a>
        </nav>
      </div>
    </footer>
  );
}
