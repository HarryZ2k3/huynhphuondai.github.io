"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const update = () => {
    let preference;
    try { preference = localStorage.getItem("portfolio-theme"); } catch { /* System preference remains available without storage. */ }
    document.documentElement.dataset.theme = preference === "dark" || preference === "light"
      ? preference : query.matches ? "dark" : "light";
    callback();
  };
  query.addEventListener("change", update);
  window.addEventListener("storage", update);
  window.addEventListener("portfolio-theme-change", callback);
  return () => {
    query.removeEventListener("change", update);
    window.removeEventListener("storage", update);
    window.removeEventListener("portfolio-theme-change", callback);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "dark", () => false);
  function toggle() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("portfolio-theme", theme); } catch { /* Keep the choice for this page when storage is unavailable. */ }
    window.dispatchEvent(new Event("portfolio-theme-change"));
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark ? "Switch to day mode" : "Switch to night mode"} title={dark ? "Switch to day mode" : "Switch to night mode"} aria-pressed={dark}>
    <Sun className="theme-sun" size={19} aria-hidden="true" />
    <Moon className="theme-moon" size={19} aria-hidden="true" />
  </button>;
}
