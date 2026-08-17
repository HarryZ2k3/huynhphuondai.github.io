"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/photos", label: "Photos" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Harry Huynh home">
        <span className="brand-mark">HH</span>
        <span className="brand-copy">
          <strong>Harry Huynh</strong>
          <span>IT engineer · writing · photos</span>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link aria-current={active ? "page" : undefined} data-active={active} href={item.href} key={item.href}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
