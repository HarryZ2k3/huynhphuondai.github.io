import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/content";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected IT engineering projects and case studies from Harry Huynh.",
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <>
      <section className="page-hero section-shell reveal">
        <p className="section-kicker">Work</p>
        <h1>Projects with practical infrastructure, clear notes, and maintainable handoffs.</h1>
        <p>
          A file-backed collection of IT engineering case studies. Replace these starters with your real project
          stories as your portfolio grows.
        </p>
      </section>

      <section className="section-shell section-block">
        <div className="project-index">
          {projects.map((project) => (
            <Link className="project-card reveal" href={`/work/${project.slug}`} key={project.slug}>
              <img src={assetPath(project.coverImage)} alt="" loading="lazy" />
              <div>
                <span>
                  {project.year} · {project.role}
                </span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <ul className="tag-list" aria-label={`${project.title} technologies`}>
                  {project.technologies.slice(0, 5).map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
