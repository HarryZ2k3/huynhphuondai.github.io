import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { formatDate } from "@/lib/format";
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
      canonical: absoluteUrl(`/photos/${album.slug}/`),
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
  if (!album) notFound();
  return (
    <>
      <section className="album-hero page-hero section-shell">
        <Link className="breadcrumb" href="/photos"><ArrowLeft size={15} aria-hidden="true" /> All collections</Link>
        <p className="section-kicker">{album.sample ? "Preview collection" : album.location} / {formatDate(album.date)}</p>
        <h1>{album.title}</h1><p>{album.story}</p>
        {album.camera ? <span className="camera-note">{album.camera}</span> : null}
      </section>
      <section className="section-shell gallery-section" aria-label={album.title}><PhotoGallery key={album.slug} photos={album.photos} /></section>
    </>
  );
}
