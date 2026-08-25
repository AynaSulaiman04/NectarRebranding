"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTypewriter, useLaunchGate } from "@/lib/useTypewriter";
import { Arrow } from "./Arrow";

const links = [
  { href: "/what-we-do", label: "Practices" },
  { href: "/sectors", label: "Sectors" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/evidence", label: "Evidence" },
  { href: "/firm", label: "Firm" },
];

/** One nav label, typed in on its own stagger. */
function NavLink({
  href,
  label,
  active,
  start,
  delay,
}: {
  href: string;
  label: string;
  active: boolean;
  start: boolean;
  delay: number;
}) {
  const { typed } = useTypewriter(label, start, 22, delay);
  return (
    <Link href={href} data-active={active} aria-label={label}>
      <span aria-hidden="true">{typed || " "}</span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const ready = useLaunchGate();
  // Only type on the home page; elsewhere the nav is simply present.
  const animate = isHome;
  const start = animate ? ready : true;

  return (
    <>
      <header className="nav" data-home={isHome}>
        <div className="nav__row">
          <Link href="/" className="pill brandPill" aria-label="Nectar Consultancy, home">
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

          <nav className="pill nav__links" aria-label="Primary">
            {links.map((l, i) => (
              <NavLink
                key={l.href}
                href={l.href}
                label={l.label}
                active={pathname.startsWith(l.href)}
                start={start}
                delay={animate ? 120 + i * 170 : 0}
              />
            ))}
          </nav>

          <Link className="btn btn--dark btn--pill" href="/contact">
            Talk to us <Arrow />
          </Link>
        </div>
      </header>
      {!isHome && <div style={{ height: "var(--nav-h)" }} aria-hidden="true" />}
    </>
  );
}
