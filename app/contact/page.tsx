import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { getProfile, getSiteSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: settings.navigation.contact,
  description: settings.contact.description,
  alternates: { canonical: absoluteUrl("/contact/") },
};

export default function ContactPage() {
  const profile = getProfile();
  return (
    <section className="page-hero section-shell contact-page">
      <p className="section-kicker">{settings.navigation.contact}</p>
      <h1>{settings.contact.heading}</h1>
      <p>{settings.contact.description}</p>
      <a className="contact-email" href={`mailto:${profile.email}`}><Mail size={24} aria-hidden="true" /><span>{profile.email}</span><ArrowUpRight size={24} aria-hidden="true" /></a>
      <div className="contact-links">
        {profile.socials.filter((social) => !social.href.startsWith("mailto:")).map((social) => <a className="text-link" href={social.href} key={social.href} rel="noreferrer" target="_blank">{social.label}<ArrowUpRight size={17} aria-hidden="true" /></a>)}
      </div>
      <p className="location-note">{profile.location}</p>
    </section>
  );
}
