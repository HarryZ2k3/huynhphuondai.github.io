"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Album } from "@/lib/content";
import { assetPath } from "@/lib/site";

export function PhotoGallery({ photos }: { photos: Album["photos"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const previousOverflow = useRef<string | null>(null);
  const [active, setActive] = useState(0);
  useEffect(() => () => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
  }, []);
  const photo = photos[active];
  const close = () => dialog.current?.close();
  const move = (direction: number) => setActive((index) => (index + direction + photos.length) % photos.length);
  if (!photos.length) return <p className="empty-state">No photographs in this collection yet.</p>;
  return (
    <>
      <div className="photo-wall">
        {photos.map((item, index) => (
          <figure className="photo-tile" key={item.src}>
            <button type="button" className="photo-open" aria-label={`Enlarge ${item.caption || item.alt}`} onClick={(event) => {
              opener.current = event.currentTarget;
              setActive(index);
              previousOverflow.current = document.body.style.overflow;
              document.body.style.overflow = "hidden";
              dialog.current?.showModal();
            }}>
              <img src={assetPath(item.src)} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
              <span className="photo-zoom" aria-hidden="true"><Maximize2 size={18} /></span>
            </button>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
      <dialog ref={dialog} className="photo-dialog" aria-label="Photo viewer" onClose={() => {
        if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
        previousOverflow.current = null;
        opener.current?.focus({ preventScroll: true });
      }} onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}>
        <div className="viewer-toolbar">
          <span>{active + 1} / {photos.length}</span>
          <button type="button" className="icon-button" onClick={close} aria-label="Close photo" title="Close photo"><X size={22} /></button>
        </div>
        <div className="viewer-image"><img src={assetPath(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} /></div>
        <div className="viewer-footer">
          <p aria-live="polite">{photo.caption}</p>
          <div className="viewer-controls">
            <button type="button" className="icon-button" disabled={photos.length < 2} onClick={() => move(-1)} aria-label="Previous photo" title="Previous photo"><ChevronLeft size={22} /></button>
            <button type="button" className="icon-button" disabled={photos.length < 2} onClick={() => move(1)} aria-label="Next photo" title="Next photo"><ChevronRight size={22} /></button>
          </div>
        </div>
      </dialog>
    </>
  );
}
