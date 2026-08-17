import type { Metadata } from "next";
import Link from "next/link";
import { getAlbums } from "@/lib/content";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photos",
  description: "Personal photo albums and visual notes from Harry Huynh.",
};

export default function PhotosPage() {
  const albums = getAlbums();

  return (
    <>
      <section className="page-hero section-shell reveal">
        <p className="section-kicker">Photos</p>
        <h1>A gallery for real photographs, organized by simple album files.</h1>
        <p>
          Add photos under <code>public/images/albums</code>, then describe the album in <code>content/albums</code>.
          The site turns those files into a public gallery.
        </p>
      </section>

      <section className="section-shell section-block">
        <div className="album-index">
          {albums.map((album) => (
            <Link className="album-feature reveal" href={`/photos/${album.slug}`} key={album.slug}>
              <img src={assetPath(album.coverImage)} alt="" loading="lazy" />
              <div>
                <span>
                  {album.location} · {formatDate(album.date)} · {album.photos.length} photos
                </span>
                <h2>{album.title}</h2>
                <p>{album.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
