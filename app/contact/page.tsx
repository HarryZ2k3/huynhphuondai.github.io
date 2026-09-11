import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { getProfile } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Harry Huynh.",
  alternates: { canonical: absoluteUrl("/contact/") },
};

export default function ContactPage() {
  const profile = getProfile();
  return (
    <section className="page-hero section-shell contact-page">
      <p className="section-kicker">Contact</p>
      <h1>Let&apos;s talk.</h1>
      <p>Have an opportunity, a project, or a thought about something I wrote? I would be glad to hear from you.</p>
      <a className="contact-email" href={`mailto:${profile.email}`}><Mail size={24} aria-hidden="true" /><span>{profile.email}</span><ArrowUpRight size={24} aria-hidden="true" /></a>
      <div className="contact-links">
        {profile.socials.filter((social) => !social.href.startsWith("mailto:")).map((social) => <a className="text-link" href={social.href} key={social.href} rel="noreferrer" target="_blank">{social.label}<ArrowUpRight size={17} aria-hidden="true" /></a>)}
      </div>
      <p className="location-note">{profile.location}</p>
    </section>
  );
}
