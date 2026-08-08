"use client";

import { useEffect } from "react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".site-nav a"));
    const sections = ["about", "work", "gallery", "blog", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const setActive = (id: string) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.dataset.active = isActive ? "true" : "false";
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.18, 0.42, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));

    const clickHandlers = links.map((link) => {
      const handler = (event: MouseEvent) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = href === "#top" ? document.getElementById("top") : document.querySelector<HTMLElement>(href);
        if (!target) return;

        event.preventDefault();

        const travel = () => {
          target.scrollIntoView({
            behavior: reducedMotion.matches ? "auto" : "smooth",
            block: "start",
          });
          history.pushState(null, "", href);
        };

        const transitionDocument = document as ViewTransitionDocument;
        if (!reducedMotion.matches && transitionDocument.startViewTransition) {
          transitionDocument.startViewTransition(travel);
        } else {
          travel();
        }
      };

      link.addEventListener("click", handler);
      return () => link.removeEventListener("click", handler);
    });

    return () => {
      observer.disconnect();
      clickHandlers.forEach((cleanup) => cleanup());
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
