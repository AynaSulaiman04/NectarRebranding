"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/field";

/** progress of `p` across the window [a, b], clamped and smoothed */
function range(p: number, a: number, b: number) {
  const t = Math.max(0, Math.min((p - a) / (b - a), 1));
  return t * t * (3 - 2 * t);
}

/**
 * The black beat the hero resolves into.
 *
 * Pinned while it plays: the middle line of the statement splits apart and an
 * image slots into the gap, a second paragraph follows, the partner card
 * arrives, and the drawn line extends around the type.
 */
export default function DarkStatement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const set = (k: string, v: number) => el.style.setProperty(k, String(v));

    if (prefersReducedMotion()) {
      ["--split", "--p2", "--card", "--draw", "--draw2"].forEach((k) => set(k, 1));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = Math.max(0, Math.min(-rect.top / total, 1));

      set("--draw", range(p, 0.0, 0.3));
      set("--split", range(p, 0.12, 0.42));
      set("--p2", range(p, 0.34, 0.58));
      set("--card", range(p, 0.5, 0.72));
      set("--draw2", range(p, 0.45, 0.95));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="dark" ref={ref}>
      <div className="dark__sticky">
        <svg
          className="dark__line"
          viewBox="0 0 1100 634"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="dark__stroke"
            pathLength={100}
            d="M181 182C120 296 230 396 330 486c42 40 58 76 70 80c40 12 105-34 160-58"
            stroke="var(--azure-500)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="dark__stroke dark__stroke--tick"
            pathLength={100}
            d="M188 189c7 15 14 26 19 34"
            stroke="var(--azure-500)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* extends later in the sequence, looping below the statement.
              Kept clear of the right-hand copy column so it never crosses text. */}
          <path
            className="dark__stroke dark__stroke--ext"
            pathLength={100}
            d="M561 508c56-24 118-30 150 2c28 28 6 74-46 84c-64 12-150-22-214-74"
            stroke="var(--azure-500)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        <div className="dark__inner">
          <h2 className="dark__title display">
            <span className="dark__ln">A Clear Path</span>
            <span className="dark__ln dark__ln--split">
              <span>Through</span>
              <span className="dark__slot" aria-hidden="true">
                <span className="dark__img" />
              </span>
              <span>Every</span>
            </span>
            <span className="dark__ln dark__em">Obligation</span>
          </h2>

          <div className="dark__foot">
            <span className="dark__label">The firm</span>
            <span className="dark__label">Since 2015</span>

            <div className="dark__copy">
              <p className="dark__body">
                Nectar Consultancy works with Australian organisations on
                business solutions, process optimisation and regulatory
                compliance. We scope every engagement in writing, name what is
                excluded, and measure the result against the figure agreed
                before the work began.
              </p>
              <p className="dark__body dark__body--2">
                Our approach is practical and specific. We diagnose before we
                propose, price variations before they happen, and hand back
                documentation the team can actually run — not a report that sits
                on a shelf.
              </p>
            </div>

            <figure className="dark__card">
              <span className="dark__avatar" aria-hidden="true" />
              <figcaption>
                <b>[Partner name]</b>
                <span>Managing Partner, Nectar Consultancy</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
