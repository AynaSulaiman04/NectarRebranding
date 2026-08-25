"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLaunchGate } from "@/lib/useTypewriter";
import { Arrow } from "./Arrow";

const links = [
  { href: "/what-we-do", label: "Practices" },
  { href: "/sectors", label: "Sectors" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/evidence", label: "Evidence" },
  { href: "/firm", label: "Firm" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const ready = useLaunchGate();
  // On the home page the pills settle in once the launch has finished.
  // Elsewhere they are simply present.
  const shown = isHome ? ready : true;

  return (
    <>
      <header className="nav" data-home={isHome} data-ready={shown}>
        <div className="nav__row">
          <Link
            href="/"
            className="pill brandPill"
            data-pop
            style={{ transitionDelay: "60ms" }}
            aria-label="Nectar Consultancy, home"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3.6l7.3 4.2v8.4L12 20.4l-7.3-4.2V7.8L12 3.6z"
                stroke="var(--brick)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand__name">Nectar</span>
          </Link>

          <nav
            className="pill nav__links"
            data-pop
            style={{ transitionDelay: "0ms" }}
            aria-label="Primary"
          >
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                data-active={pathname.startsWith(l.href)}
                data-popitem
                style={{ transitionDelay: `${260 + i * 55}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            className="btn btn--dark btn--pill"
            href="/contact"
            data-pop
            style={{ transitionDelay: "120ms" }}
          >
            Talk to us <Arrow />
          </Link>
        </div>
      </header>
      {!isHome && <div style={{ height: "var(--nav-h)" }} aria-hidden="true" />}
    </>
  );
}
