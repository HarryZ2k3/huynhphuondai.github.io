import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import { getProfile } from "@/lib/content";
import { assetPath } from "@/lib/site";

export function SiteFooter() {
  const profile = getProfile();
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div><Link className="footer-name" href="/">{profile.name}</Link><p>Engineering, writing, and life in between.</p></div>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact <ArrowUpRight size={14} aria-hidden="true" /></Link>
          {profile.socials.filter((social) => !social.href.startsWith("mailto:")).map((social) => (
            <a key={social.href} href={social.href} target="_blank" rel="noreferrer">{social.label} <ArrowUpRight size={14} aria-hidden="true" /></a>
          ))}
          <a href={assetPath("/rss.xml")}><Rss size={14} aria-hidden="true" /> RSS</a>
        </nav>
      </div>
    </footer>
  );
}
