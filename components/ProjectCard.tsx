import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { assetPath } from "@/lib/site";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card reveal">
      {project.coverImage ? <Link className="project-image" href={`/work/${project.slug}`} tabIndex={-1} aria-hidden="true">
        <img src={assetPath(project.coverImage)} alt="" width={1600} height={1000} loading="lazy" />
      </Link> : <div className="project-context"><span>{project.organization ?? project.role}</span><span>{project.period ?? project.year}</span></div>}
      <div className="project-copy">
        <p className="entry-meta">{project.kind ?? "Project"}<span aria-hidden="true"> / </span>{project.year}</p>
        <h3><Link href={`/work/${project.slug}`}>{project.title}<ArrowUpRight size={21} aria-hidden="true" /></Link></h3>
        <p>{project.description}</p>
        <ul className="tag-list" aria-label="Technologies">{project.technologies.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}</ul>
      </div>
    </article>
  );
}
