import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlbum, getAlbums } from "@/lib/content";
import { absoluteUrl, assetPath } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAlbums().map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) return {};

  return {
    title: album.title,
    description: album.description,
    alternates: {
      canonical: absoluteUrl(`/photos/${album.slug}`),
    },
    openGraph: {
      title: album.title,
      description: album.description,
      type: "article",
      url: absoluteUrl(`/photos/${album.slug}`),
      images: [assetPath(album.coverImage)],
    },
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params;
  const album = getAlbum(slug);

  if (!album) {
    notFound();
  }

  return (
    <>
      <section className="album-hero section-shell reveal">
        <Link className="breadcrumb" href="/photos">
          Photos
        </Link>
        <p className="section-kicker">
          {album.location} · {formatDate(album.date)}
        </p>
        <h1>{album.title}</h1>
        <p>{album.story}</p>
        {album.camera ? <span className="camera-note">{album.camera}</span> : null}
      </section>

      <section className="section-shell photo-wall">
        {album.photos.map((photo, index) => (
          <figure className="photo-tile reveal" key={photo.src}>
            <a href={`#photo-${index + 1}`} aria-label={`Open ${photo.caption}`}>
              <img src={assetPath(photo.src)} alt={photo.alt} loading="lazy" />
            </a>
            <figcaption>{photo.caption}</figcaption>
            <div className="lightbox" id={`photo-${index + 1}`}>
              <a className="lightbox-close" href="#top" aria-label="Close photo">
                Close
              </a>
              <img src={assetPath(photo.src)} alt={photo.alt} />
              <p>{photo.caption}</p>
            </div>
          </figure>
        ))}
      </section>
    </>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
