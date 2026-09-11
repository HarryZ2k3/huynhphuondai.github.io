import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { getProject, getProjects } from "@/lib/content";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { absoluteUrl, assetPath } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: absoluteUrl(`/work/${project.slug}/`),
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: absoluteUrl(`/work/${project.slug}`),
      ...(project.coverImage ? { images: [assetPath(project.coverImage)] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className="detail-hero section-shell">
        <Link className="breadcrumb" href="/work">
          <ArrowLeft size={15} aria-hidden="true" /> All work
        </Link>
        <p className="section-kicker">
          {project.kind ?? "Project"} / {project.period ?? project.year} / {project.role}
        </p>
        <h1>{project.title}</h1>
        {project.organization ? <p className="project-organization">{project.organization}</p> : null}
        <p>{project.description}</p>
      </section>

      <section className="section-shell detail-layout">
        <aside className="detail-sidebar reveal" aria-label="Project summary">
          <dl>
            <div>
              <dt>Challenge</dt>
              <dd>{project.challenge}</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>{project.approach}</dd>
            </div>
            <div>
              <dt>{project.kind === "Concept study" ? "Intended outcome" : "Outcome"}</dt>
              <dd>{project.outcome}</dd>
            </div>
          </dl>
          <ul className="tag-list" aria-label="Technologies used">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </aside>

        <div className="detail-main">
          {project.coverImage ? <img className="detail-cover" src={assetPath(project.coverImage)} alt="" /> : null}
          <div className="inline-links">
            {project.repository ? <a className="text-link" href={project.repository} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
            {project.demo ? <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">View project <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
          </div>
          <MarkdownArticle markdown={project.content} />
          <section className="lesson-note">
            <p className="section-kicker">Lesson</p>
            <p>{project.lessons}</p>
          </section>
          {project.screenshots.filter((image) => image !== project.coverImage).length > 0 ? (
            <div className="screenshot-grid">
              {project.screenshots.filter((image) => image !== project.coverImage).map((screenshot) => (
                <img src={assetPath(screenshot)} alt="" key={screenshot} loading="lazy" />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
