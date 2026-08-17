import type { Metadata } from "next";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Harry Huynh.",
};

export default function ContactPage() {
  const profile = getProfile();

  return (
    <section className="page-hero section-shell reveal">
      <p className="section-kicker">Contact</p>
      <h1>Reach out directly.</h1>
      <p>
        The site has no login, no hidden admin area, and no database. For now, contact stays simple and durable: direct
        links that work anywhere this static site is hosted.
      </p>
      <div className="contact-links">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        {profile.socials.map((social) => (
          <a href={social.href} key={social.href} rel="noreferrer" target="_blank">
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );
}
