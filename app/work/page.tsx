import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import { absoluteUrl } from "@/lib/site";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: settings.navigation.work,
  description: settings.work.description,
  alternates: { canonical: absoluteUrl("/work/") },
};

export default function WorkPage() {
  const projects = getProjects();
  const experience = projects.filter((project) => project.kind !== "Concept study");
  const concepts = projects.filter((project) => project.kind === "Concept study");
  return (
    <>
      <section className="page-hero section-shell">
        <p className="section-kicker">{settings.navigation.work}</p>
        <h1>{settings.work.heading}</h1>
        <p>{settings.work.description}</p>
      </section>
      <section className="section-shell section-block ruled-section" aria-label="Experience and academic projects">
        <div className="index-heading"><h2>{settings.work.experienceHeading}</h2><span>{experience.length} entries</span></div>
        <div className="project-grid">{experience.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
      </section>
      {concepts.length ? <section className="section-shell section-block ruled-section" aria-label="Concept studies">
        <div className="index-heading"><h2>{settings.work.conceptHeading}</h2><span>{concepts.length} entries</span></div>
        <p className="collection-note">{settings.work.conceptDescription}</p>
        <div className="project-grid">{concepts.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
      </section> : null}
    </>
  );
}
