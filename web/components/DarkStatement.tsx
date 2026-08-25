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
 * image slots into the gap, a second paragraph follows, and the partner card
 * arrives.
 */
export default function DarkStatement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const set = (k: string, v: number) => el.style.setProperty(k, String(v));

    if (prefersReducedMotion()) {
      ["--split", "--p2", "--card"].forEach((k) => set(k, 1));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = Math.max(0, Math.min(-rect.top / total, 1));

      set("--split", range(p, 0.12, 0.42));
      set("--p2", range(p, 0.34, 0.58));
      set("--card", range(p, 0.5, 0.72));
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
