import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import { getProfile, getSiteSettings } from "@/lib/content";
import { assetPath } from "@/lib/site";

export function SiteFooter() {
  const profile = getProfile();
  const settings = getSiteSettings();
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div><Link className="footer-name" href="/">{profile.name}</Link><p>{settings.footer.tagline}</p></div>
        <nav aria-label="Footer navigation">
          <Link href="/about">{settings.navigation.about}</Link>
          <Link href="/contact">{settings.navigation.contact} <ArrowUpRight size={14} aria-hidden="true" /></Link>
          {settings.footer.showSocials && profile.socials.filter((social) => !social.href.startsWith("mailto:")).map((social) => (
            <a key={social.href} href={social.href} target="_blank" rel="noreferrer">{social.label} <ArrowUpRight size={14} aria-hidden="true" /></a>
          ))}
          {settings.footer.showRss && <a href={assetPath("/rss.xml")}><Rss size={14} aria-hidden="true" /> RSS</a>}
        </nav>
      </div>
    </footer>
  );
}
