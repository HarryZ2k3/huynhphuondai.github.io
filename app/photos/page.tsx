import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAlbums, getSiteSettings } from "@/lib/content";
import { absoluteUrl, assetPath } from "@/lib/site";
import { formatDate } from "@/lib/format";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: settings.navigation.photos,
  description: settings.photos.description,
  alternates: { canonical: absoluteUrl("/photos/") },
};
export default function PhotosPage() {
  const albums = getAlbums();
  return (
    <>
      <section className="page-hero section-shell">
        <p className="section-kicker">{settings.navigation.photos}</p><h1>{settings.photos.heading}</h1>
        <p>{settings.photos.description}</p>
      </section>
      <section className="section-shell section-block ruled-section" aria-label="Photo albums">
        {albums.length > 0 && albums.every((album) => album.sample) ? <p className="collection-note">{settings.photos.previewNote}</p> : null}
        <div className="album-grid">
          {albums.map((album) => (
            <article className="album-card reveal" key={album.slug}>
              <Link className="album-image" href={`/photos/${album.slug}`} tabIndex={-1} aria-hidden="true"><img src={assetPath(album.coverImage)} alt="" width={1600} height={1100} loading="lazy" /></Link>
              <p className="entry-meta">{album.sample ? "Preview collection" : album.location} / {formatDate(album.date)}</p>
              <h2><Link href={`/photos/${album.slug}`}>{album.title}<ArrowUpRight size={20} aria-hidden="true" /></Link></h2>
              <p>{album.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
