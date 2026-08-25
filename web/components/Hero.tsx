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

/** Wheel travel, in px, needed to take the ground fully dark. */
const LOCK = 900;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const shiftRef = useRef(0);
  const ready = useLaunchGate();
  const { n } = useTypewriter(FULL, ready, 30, 420);
  const done = n >= FULL.length;

  /* ---------- the field ---------- */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const field = makeField(cv, 6, "light");
    const reduced = prefersReducedMotion();
    let raf = 0;
    let running = false;

    field.size();
    field.paint(1, 1, 1, shiftRef.current);

    const tick = (t: number) => {
      if (!running) return;
      field.paint(0.99 + 0.01 * Math.cos(t / 11000), 1, 1, shiftRef.current);
      raf = requestAnimationFrame(tick);
    };

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
        field.paint(1, 1, 1, shiftRef.current);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  /* ---------- hold the page while the ground goes dark ---------- */
  useEffect(() => {
    if (!ready) return;

    const setDark = (on: boolean) => {
      if (sectionRef.current) sectionRef.current.dataset.dark = String(on);
      document.documentElement.dataset.heroDark = String(on);
    };

    if (prefersReducedMotion()) {
      shiftRef.current = 1;
      setDark(true);
      return;
    }

    let progress = 0;
    let unlocked = false;
    document.body.style.overflow = "hidden";

    const apply = () => {
      shiftRef.current = progress;
      // Type crosses navy-900 -> sky-100 across the middle of the change, so
      // it stays legible against both grounds.
      const t = Math.max(0, Math.min((progress - 0.3) / 0.45, 1));
      const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
      sectionRef.current?.style.setProperty(
        "--hero-fg",
        `rgb(${mix(10, 234)},${mix(22, 241)},${mix(38, 248)})`,
      );
      setDark(progress > 0.5);
    };

    const release = () => {
      unlocked = true;
      progress = 1;
      apply();
      document.body.style.overflow = "";
      teardown();
    };

    const advance = (dy: number) => {
      if (unlocked) return;
      progress = Math.max(0, Math.min(progress + dy / LOCK, 1));
      apply();
      if (progress >= 1) release();
    };

    const onWheel = (e: WheelEvent) => {
      if (unlocked) return;
      e.preventDefault();
      advance(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (unlocked) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? touchY;
      advance((touchY - y) * 2.2);
      touchY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if (unlocked) return;
      // Escape is the way out for anyone who does not want to sit through it.
      if (e.key === "Escape" || e.key === "Tab") return release();
      if (["ArrowDown", "PageDown", " ", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        advance(e.key === "ArrowUp" || e.key === "PageUp" ? -160 : 160);
      }
    };

    function teardown() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      teardown();
      document.body.style.overflow = "";
    };
  }, [ready]);

  // Walk the segments, handing each the slice of the typed range it owns.
  let cursor = 0;

  return (
    <section className="hero" ref={sectionRef} data-dark="false">
      <canvas ref={canvasRef} aria-hidden="true" />

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
