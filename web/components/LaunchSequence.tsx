"use client";

import { useEffect, useRef, useState } from "react";
import { makeField, prefersReducedMotion } from "@/lib/field";
import { LAUNCH_DONE_EVENT } from "@/lib/useTypewriter";
import { Mark } from "./BrandLockup";

const LOGO_IN = 60; // mark appears on the almond ground
const DROP_AT = 700; // lines start falling from the top edge
const DROP = 1400;
const BLOOM_AT = 1500; // warm ground washes in underneath
const BLOOM = 1400;
const MARK_OUT = 2050;
const LIFT = 2900;
const DONE = 3300;

/**
 * Opens on almond with the mark alone. Lines then fall from the top edge on
 * staggered offsets, the warm ground washes in underneath them, and the whole
 * layer lifts to reveal the hero.
 *
 * Runs on every page load; it lives in the root layout, so client-side
 * navigation between pages does not remount and replay it.
 */
export default function LaunchSequence() {
  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  const [mark, setMark] = useState(false);
  const [up, setUp] = useState(false);
  const [gone, setGone] = useState(true);
  const ref = useRef<HTMLCanvasElement>(null);

  // Decide on the client only, so the server never renders the overlay.
  useEffect(() => {
    if (prefersReducedMotion()) {
      window.dispatchEvent(new Event(LAUNCH_DONE_EVENT));
      return;
    }
    setGone(false);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cv = ref.current;
    if (!cv) return;

    document.body.style.overflow = "hidden";
    const field = makeField(cv);
    field.size();
    field.paint(1, 0, 0); // almond ground, nothing drawn yet

    const raf0 = requestAnimationFrame(() => setOn(true));

    let raf = 0;
    let t0: number | null = null;
    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const el = t - t0;

      // lines fall from the top edge
      const d = Math.max(0, Math.min((el - DROP_AT) / DROP, 1));
      const reveal = 1 - Math.pow(1 - d, 3); // ease-out cubic

      // warm ground washes in underneath them
      const b = Math.max(0, Math.min((el - BLOOM_AT) / BLOOM, 1));

      field.paint(1, b * b * (3 - 2 * b), reveal); // straight lines throughout
      if (el < BLOOM_AT + BLOOM) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const timers = [
      setTimeout(() => setMark(true), LOGO_IN),
      setTimeout(() => setMark(false), MARK_OUT),
      setTimeout(() => setUp(true), LIFT),
      setTimeout(() => {
        document.body.style.overflow = "";
        setGone(true);
        window.dispatchEvent(new Event(LAUNCH_DONE_EVENT));
      }, DONE),
    ];

    return () => {
      cancelAnimationFrame(raf0);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (gone) return null;

  return (
    <div className="launch" aria-hidden="true" data-on={on} data-mark={mark} data-up={up}>
      <canvas ref={ref} />
      <div className="launch__mark">
        <Mark size={46} tone="gradient" />
      </div>
    </div>
  );
}
