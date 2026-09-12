"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionController() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.getElementById("main-content");
    if (!root || !("IntersectionObserver" in window)) return;
    const elements = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;

    const reveal = (element: HTMLElement, delay = 0) => {
      element.style.setProperty("--reveal-delay", `${delay}ms`);
      element.classList.remove("reveal-pending");
      observer?.unobserve(element);
    };
    const reset = () => {
      observer?.disconnect();
      mutations?.disconnect();
      elements.forEach(element => {
        element.classList.remove("reveal-pending");
        element.style.removeProperty("--reveal-delay");
      });
      elements.clear();
    };
    const start = () => {
      reset();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        const groups = new Map<Element | null, number>();
        entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach(({ target }) => {
            const element = target as HTMLElement;
            const index = groups.get(element.parentElement) ?? 0;
            reveal(element, Math.min(index, 3) * 80);
            groups.set(element.parentElement, index + 1);
          });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

      const register = (container: HTMLElement) => {
        const candidates = [...(container.matches(".reveal") ? [container] : []), ...container.querySelectorAll<HTMLElement>(".reveal")];
        candidates.forEach(element => {
          if (elements.has(element) || element.closest(".prose")) return;
          elements.add(element);
          // Never hide content already on screen, restored by history, or focused.
          if (element.getBoundingClientRect().top >= window.innerHeight && !element.contains(document.activeElement)) {
            element.classList.add("reveal-pending");
            observer?.observe(element);
          }
        });
      };
      register(root);
      // Filtered lists and streamed route content can arrive after the effect runs.
      mutations = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) register(node);
        }));
        elements.forEach(element => {
          if (!root.contains(element)) {
            observer?.unobserve(element);
            element.classList.remove("reveal-pending");
            element.style.removeProperty("--reveal-delay");
            elements.delete(element);
          }
        });
      });
      mutations.observe(root, { childList: true, subtree: true });
    };
    const onFocus = (event: FocusEvent) => {
      const element = event.target instanceof Element ? event.target.closest<HTMLElement>(".reveal") : null;
      if (element) reveal(element);
    };
    start();
    root.addEventListener("focusin", onFocus);
    preference.addEventListener("change", start);
    return () => {
      root.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", start);
      reset();
    };
  }, [pathname]);
  return null;
}
