import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { getProfile } from "@/lib/content";
import { absoluteUrl, assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The person behind the work and writing.",
  alternates: { canonical: absoluteUrl("/about/") },
};

export default function AboutPage() {
  const profile = getProfile();
  const hasPortrait = profile.portraitImage && !profile.portraitImage.includes("placeholder");
  return (
    <>
      <section className={`page-hero section-shell about-hero ${hasPortrait ? "with-portrait" : ""}`}>
        <div>
          <p className="section-kicker">About{profile.fullName ? ` / ${profile.fullName}` : ""}</p><h1>Hi, I&apos;m {profile.name.split(" ")[0]}.</h1>
          <p>{profile.hero.summary}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/contact">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></Link>
            {profile.resumeFile ? <a className="button button-secondary" href={assetPath(profile.resumeFile)} download>Download résumé <Download size={17} aria-hidden="true" /></a> : null}
          </div>
        </div>
        {hasPortrait ? <img className="portrait" src={assetPath(profile.portraitImage)} alt={`Portrait of ${profile.name}`} width={605} height={807} /> : null}
      </section>
      <section className="section-shell section-block about-section ruled-section">
        <div className="reveal"><p className="section-kicker">Background</p><h2>The way I work</h2></div>
        <div className="body-stack reveal">{profile.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section className="section-shell section-block about-section ruled-section">
        <div className="reveal"><p className="section-kicker">Toolkit</p><h2>Tools I work with</h2></div>
        <ul className="skill-list reveal">{profile.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
      </section>
      <section className="section-shell section-block about-section ruled-section">
        <div className="reveal"><p className="section-kicker">Experience</p><h2>Work, research &amp; teaching</h2></div>
        <div className="timeline">{profile.experience.map((item) => (
          <article className="timeline-item reveal" key={`${item.role}-${item.dates}`}>
            <p className="entry-meta">{item.dates}</p><h3>{item.role}</h3><p className="timeline-meta">{item.company} / {item.location}</p>
            <p>{item.summary}</p><ul>{item.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
          </article>
        ))}</div>
      </section>
      {profile.education?.length ? <section className="section-shell section-block about-section ruled-section">
        <div className="reveal"><p className="section-kicker">Education</p><h2>What I&apos;m studying</h2></div>
        <div className="timeline">{profile.education.map((item) => (
          <article className="timeline-item reveal" key={item.institution}><p className="entry-meta">{item.dates}</p><h3>{item.qualification}</h3><p className="timeline-meta">{item.institution}</p><p>{item.detail}</p></article>
        ))}</div>
      </section> : null}
      {profile.languages?.length ? <section className="section-shell section-block about-section ruled-section">
        <div className="reveal"><p className="section-kicker">Communication</p><h2>Languages</h2></div>
        <div><ul className="skill-list reveal">{profile.languages.map((language) => <li key={language}>{language}</li>)}</ul><p className="qualification-note">{profile.qualifications?.join(" / ")}</p></div>
      </section> : null}
      <section className="writing-band">
        <div className="section-shell section-block about-section">
          <div className="reveal"><p className="section-kicker">Off the clock</p><h2>Other interests</h2></div>
          <div className="reveal"><ul className="interest-list">{profile.interests.map((interest) => <li key={interest}>{interest}</li>)}</ul><div className="inline-links"><Link className="text-link" href="/writing">Writing <ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="text-link" href="/photos">Photos <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
        </div>
      </section>
    </>
  );
}
