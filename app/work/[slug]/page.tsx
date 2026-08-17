import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { getProject, getProjects } from "@/lib/content";
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
      canonical: absoluteUrl(`/work/${project.slug}`),
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: absoluteUrl(`/work/${project.slug}`),
      images: [assetPath(project.coverImage)],
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
      <section className="detail-hero section-shell reveal">
        <Link className="breadcrumb" href="/work">
          Work
        </Link>
        <p className="section-kicker">
          {project.year} · {project.role}
        </p>
        <h1>{project.title}</h1>
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
              <dt>Outcome</dt>
              <dd>{project.outcome}</dd>
            </div>
          </dl>
          <ul className="tag-list" aria-label="Technologies used">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </aside>

        <div className="detail-main reveal">
          <img className="detail-cover" src={assetPath(project.coverImage)} alt="" />
          <MarkdownArticle markdown={project.content} />
          <section className="lesson-note">
            <p className="section-kicker">Lesson</p>
            <p>{project.lessons}</p>
          </section>
          {project.screenshots.length > 0 ? (
            <div className="screenshot-grid">
              {project.screenshots.map((screenshot) => (
                <img src={assetPath(screenshot)} alt="" key={screenshot} loading="lazy" />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
