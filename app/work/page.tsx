import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Research, software development, and academic projects by Harry Huynh.",
  alternates: { canonical: absoluteUrl("/work/") },
};

export default function WorkPage() {
  const projects = getProjects();
  const experience = projects.filter((project) => project.kind !== "Concept study");
  const concepts = projects.filter((project) => project.kind === "Concept study");
  return (
    <>
      <section className="page-hero section-shell">
        <p className="section-kicker">Work</p>
        <h1>Research into practice.</h1>
        <p>Full-stack development, logic-based AI, and database work. A closer look at my contributions, from an R&amp;D internship to university team projects.</p>
      </section>
      <section className="section-shell section-block ruled-section" aria-label="Experience and academic projects">
        <div className="index-heading"><h2>Experience &amp; academic projects</h2><span>{experience.length} entries</span></div>
        <div className="project-grid">{experience.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
      </section>
      {concepts.length ? <section className="section-shell section-block ruled-section" aria-label="Concept studies">
        <div className="index-heading"><h2>Concept studies</h2><span>{concepts.length} entries</span></div>
        <p className="collection-note">Exploratory ideas in IT operations, separate from completed work.</p>
        <div className="project-grid">{concepts.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
      </section> : null}
    </>
  );
}
