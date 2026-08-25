"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLaunchGate } from "@/lib/useTypewriter";
import { Arrow } from "./Arrow";
import BrandLockup from "./BrandLockup";

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
            {/* wordmark only — the mark is out of the nav until the real
                artwork lands. CONSULTANCY is also dropped here: it is
                unreadable at 34px, so the full lockup stays in the footer. */}
            <BrandLockup size={19} suffix={false} mark={false} />
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
