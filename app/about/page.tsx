import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/content";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Harry Huynh, an Information Technology Engineer.",
};

export default function AboutPage() {
  const profile = getProfile();

  return (
    <>
      <section className="about-hero section-shell reveal">
        <div>
          <p className="section-kicker">About</p>
          <h1>{profile.name}</h1>
          <p>{profile.hero.summary}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={`mailto:${profile.email}`}>
              Email Me
            </a>
            <Link className="button button-secondary" href="/photos">
              View Photos
            </Link>
          </div>
        </div>
        <img className="portrait-frame" src={assetPath(profile.portraitImage)} alt="" />
      </section>

      <section className="intro-band">
        <div className="section-shell intro-grid reveal">
          <div>
            <p className="section-kicker">Profile</p>
            <h2>IT engineering with a bias for calm, dependable systems.</h2>
          </div>
          <div className="body-stack">
            {profile.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-block split-section">
        <div className="section-heading reveal">
          <p className="section-kicker">Tools</p>
          <h2>Systems I Like Keeping Legible</h2>
        </div>
        <div className="skill-cloud reveal">
          {profile.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </section>

      <section className="section-shell section-block experience-section">
        <div className="section-heading reveal">
          <p className="section-kicker">Experience</p>
          <h2>Current Work Areas</h2>
        </div>
        <div className="timeline">
          {profile.experience.map((item) => (
            <article className="timeline-item reveal" key={`${item.role}-${item.dates}`}>
              <span>{item.dates}</span>
              <h3>{item.role}</h3>
              <p className="timeline-meta">
                {item.company} · {item.location}
              </p>
              <p>{item.summary}</p>
              <ul>
                {item.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
