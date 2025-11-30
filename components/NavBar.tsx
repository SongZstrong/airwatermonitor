'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/air-quality", label: "Air Quality" },
  { href: "/water-quality", label: "Water Quality" },
  { href: "/blog", label: "Insights" },
  { href: "/privacy", label: "Privacy & About" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname?.startsWith(href));

  const navLinks = LINKS.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive(link.href)
          ? "bg-sky-100 text-sky-900"
          : "text-slate-700 hover:bg-slate-100"
      }`}
      onClick={() => setOpen(false)}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Air & Water Monitor
        </Link>
        <nav className="hidden items-center gap-2 md:flex">{navLinks}</nav>
        <button
          className="md:hidden"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="inline-block h-5 w-7 border-y-2 border-slate-900"></span>
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">{navLinks}</nav>
        </div>
      )}
    </header>
  );
}
