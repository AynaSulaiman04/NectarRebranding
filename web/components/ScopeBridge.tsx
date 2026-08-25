"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/field";
import { practices } from "@/content/practices";
import { Arrow } from "./Arrow";

/** The client's own scope test, from the project meeting (brief R4). */
const SCOPE = "Anything that improves efficiency for the business.";
const WORDS = SCOPE.split(" ");

/**
 * The beat after the black screen. Carries the ground out of black and back to
 * the page, and lands the firm's scope test one word at a time as it goes.
 */
export default function ScopeBridge() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--reveal", String(WORDS.length));
      el.style.setProperty("--rows", "6");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight * 0.4);
      const p = Math.max(0, Math.min((window.innerHeight * 0.85 - rect.top) / total, 1));
      // words land one by one across the first two thirds
      el.style.setProperty("--reveal", String(Math.min(p / 0.62, 1) * WORDS.length));
      el.style.setProperty("--rows", String(Math.max(0, (p - 0.45) / 0.4) * 6));
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
    <section className="bridge" ref={ref}>
      <div className="wrap">
        <span className="bridge__eyebrow">The scope test</span>

        <p className="bridge__scope display">
          {WORDS.map((w, i) => (
            <span key={i} className="bridge__w" style={{ ["--i" as string]: i }}>
              {w}
            </span>
          ))}
        </p>

        <p className="bridge__note">
          The client&rsquo;s own boundary, kept as the firm&rsquo;s. If a piece
          of work makes the business measurably more efficient, it is ours. If
          it does not, we will say so in the first conversation.
        </p>

        <ul className="bridge__rows">
          {practices.map((p, i) => (
            <li key={p.slug} style={{ ["--r" as string]: i }}>
              <Link href={`/what-we-do/${p.slug}`}>
                <span className="bridge__idx tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="bridge__name display">{p.name}</span>
                <span className="bridge__sum">{p.summary}</span>
                <span className="bridge__go">
                  <Arrow size={15} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
