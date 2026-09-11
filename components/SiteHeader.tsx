"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/photos", label: "Photos" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const initials = name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return (
    <header className="site-header">
      <div className="section-shell header-inner">
        <Link className="brand" href="/" aria-label={`${name} home`}>
          <span className="brand-mark" aria-hidden="true">{initials}</span>
          <span className="brand-name">{name}</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link aria-current={active ? "page" : undefined} href={item.href} key={item.href}>{item.label}</Link>;
          })}
        </nav>
        <div className="header-tools"><Link className="header-contact text-link" href="/contact">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></Link><ThemeToggle /></div>
      </div>
    </header>
  );
}
