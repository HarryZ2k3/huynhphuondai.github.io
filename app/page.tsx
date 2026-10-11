import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import { getAppearance, getPosts, getProfile, getProjects, getSiteSettings } from "@/lib/content";
import { assetPath } from "@/lib/site";
import { ProjectCard } from "@/components/ProjectCard";
import { PostList } from "@/components/PostList";

export default function HomePage() {
  const profile = getProfile();
  const settings = getSiteSettings();
  const appearance = getAppearance();
  const projects = getProjects().filter((project) => project.featured).slice(0, 2);
  const posts = getPosts().slice(0, 3);
  return (
    <>
      <section className="hero section-shell">
        <p className="eyebrow">{profile.title}<span aria-hidden="true"> / </span>{profile.location}</p>
        <h1>{profile.name}<span className="name-period">.</span></h1>
        <p className="hero-statement">{profile.hero.headline}</p>
        <p className="hero-lede">{profile.hero.summary}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/work">{settings.home.workButton} <ArrowUpRight size={17} aria-hidden="true" /></Link>
          {profile.resumeFile && profile.showResume !== false ? <a className="button button-secondary" href={assetPath(profile.resumeFile)} download>{profile.resumeLabel || "Download CV"} <Download size={17} aria-hidden="true" /></a> : <Link className="button button-secondary" href="/contact">{settings.navigation.contact} <Mail size={17} aria-hidden="true" /></Link>}
          <Link className="text-link" href="/writing">{settings.home.writingButton} <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="hero-footnote"><span>{settings.home.focusLabel}</span><p>{profile.currentFocus}</p></div>
      </section>

      {appearance.showWork && <section className="section-shell section-block ruled-section" aria-labelledby="selected-work">
        <div className="section-heading reveal">
          <div><p className="section-kicker">01 / Work</p><h2 id="selected-work">{settings.home.workHeading}</h2></div>
          <Link className="text-link" href="/work">All projects <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
      </section>}

      {appearance.showWriting && <section className="writing-band">
        <div className="section-shell section-block home-writing">
          <div className="section-heading reveal">
            <div><p className="section-kicker">02 / Writing</p><h2>{settings.home.writingHeading}</h2><p className="section-description">{settings.home.writingDescription}</p></div>
            <Link className="text-link" href="/writing">All writing <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <PostList posts={posts} />
        </div>
      </section>}

      {appearance.showPersonal && <section className="section-shell section-block personal-section">
        <div className="reveal"><p className="section-kicker">03 / Beyond the work</p><h2>{settings.home.personalHeading}</h2></div>
        <div className="personal-copy reveal">
          <p>{profile.personalNote ?? profile.biography[profile.biography.length - 1]}</p>
          <div className="inline-links"><Link className="text-link" href="/about">About me <ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="text-link" href="/photos">Photo journal <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>}

      <section className="contact-band">
        <div className="section-shell contact-grid reveal">
          <div><p className="section-kicker">Contact</p><h2>{settings.home.contactHeading}</h2><p>{settings.home.contactDescription}</p></div>
          <Link className="button button-primary" href="/contact">{settings.navigation.contact} <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
