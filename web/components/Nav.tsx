"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/what-we-do", label: "Practices" },
  { href: "/sectors", label: "Sectors" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/evidence", label: "Evidence" },
  { href: "/firm", label: "Firm" },
];

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Nectar Consultancy, home">
      <span className="brand__name">Nectar</span>
      <span className="brand__suffix">Consultancy</span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="nav__row">
        <Brand />
        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname.startsWith(l.href)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav__cta">
          <Link className="btn" href="/contact">
            Talk to us
          </Link>
        </div>
      </div>
    </header>
  );
}
