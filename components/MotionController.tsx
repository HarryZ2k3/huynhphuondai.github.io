"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionController() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove("reveal-pending");
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: "0px 0px 32px 0px" });
    elements.forEach((element) => {
      // Keep visible content stable during hydration and route navigation.
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    });
    const showAll = () => elements.forEach((element) => element.classList.remove("reveal-pending"));
    preference.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", showAll);
      showAll();
    };
  }, [pathname]);
  return null;
}
