import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAlbums } from "@/lib/content";
import { absoluteUrl, assetPath } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Photos",
  description: "A photo journal of places, details, and everyday life.",
  alternates: { canonical: absoluteUrl("/photos/") },
};
export default function PhotosPage() {
  const albums = getAlbums();
  return (
    <>
      <section className="page-hero section-shell">
        <p className="section-kicker">Photos</p><h1>Looking a little closer.</h1>
        <p>Places, passing moments, and the details I want to keep.</p>
      </section>
      <section className="section-shell section-block ruled-section" aria-label="Photo albums">
        {albums.every((album) => album.sample) ? <p className="collection-note">The first photographs are still to come. These preview collections contain illustrations.</p> : null}
        <div className="album-grid">
          {albums.map((album) => (
            <article className="album-card" key={album.slug}>
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
