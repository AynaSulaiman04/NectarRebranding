"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { makeField, prefersReducedMotion } from "@/lib/field";
import { useTypewriter, useLaunchGate } from "@/lib/useTypewriter";
import { Arrow } from "./Arrow";

/** Display headline, split so the italic accents can be typed in sequence. */
const HEADLINE: { text: string; italic?: boolean }[] = [
  { text: "Building " },
  { text: "Certainty", italic: true },
  { text: "\n" },
  { text: "Business", italic: true },
  { text: " Advisory Firm" },
];

const FULL = HEADLINE.map((s) => s.text).join("");

/* Kept to three lines at the caption's measure, as the reference sets it. */
const CAPTION =
  "From lodgements and governance to tendering, systems and restructuring, we help Australian organisations move forward with clarity and structure.";

export default function Hero() {
  const ref = useRef<HTMLCanvasElement>(null);
  const ready = useLaunchGate();
  const { n } = useTypewriter(FULL, ready, 30, 420);
  const done = n >= FULL.length;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const field = makeField(cv, 6, "light");
    const reduced = prefersReducedMotion();
    let raf = 0;
    let running = false;

    // Warm ground cools toward plum as the hero scrolls away. Completed over
    // roughly half a viewport, so the change is fully visible before the hero
    // leaves the screen.
    let shift = 0;
    const readScroll = () => {
      const span = window.innerHeight * 0.55;
      shift = Math.max(0, Math.min(window.scrollY / span, 1));
    };
    readScroll();

    field.size();
    field.paint(1, 1, 1, shift);

    const tick = (t: number) => {
      if (!running) return;
      field.paint(0.99 + 0.01 * Math.cos(t / 11000), 1, 1, shift);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readScroll();
      // Repaint directly when the breathing loop is not running.
      if (!running) field.paint(1, 1, 1, shift);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = reduced
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting && !running) {
                running = true;
                raf = requestAnimationFrame(tick);
              } else if (!e.isIntersecting) {
                running = false;
                cancelAnimationFrame(raf);
              }
            }
          },
          { threshold: 0 },
        );
    io?.observe(cv);

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        field.size();
        readScroll();
        field.paint(1, 1, 1, shift);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  // Walk the segments, handing each the slice of the typed range it owns.
  let cursor = 0;

  return (
    <section className="hero">
      <canvas ref={ref} aria-hidden="true" />

      <div className="hero__inner">
        <h1 className="hero__title display" aria-label={FULL.replace("\n", " ")}>
          {HEADLINE.map((seg, i) => {
            const start = cursor;
            cursor += seg.text.length;
            const shown = Math.max(0, Math.min(seg.text.length, n - start));
            const slice = seg.text.slice(0, shown);
            if (seg.text === "\n") return slice ? <br key={i} /> : null;
            return (
              <span
                key={i}
                aria-hidden="true"
                style={seg.italic ? { fontStyle: "italic" } : undefined}
              >
                {slice}
              </span>
            );
          })}
          {!done && ready && <span className="caret" aria-hidden="true" />}
        </h1>

        <p className="hero__caption" data-in={done}>
          {CAPTION}
        </p>

        <div className="hero__cta" data-in={done}>
          <Link className="btn btn--dark" href="/contact">
            Talk to us <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
