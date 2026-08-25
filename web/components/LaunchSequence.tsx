"use client";

import { useEffect, useRef, useState } from "react";
import { makeField, prefersReducedMotion } from "@/lib/field";
import { LAUNCH_DONE_EVENT } from "@/lib/useTypewriter";

const M0 = 0.015; // fully pinched
const FADE = 900; // lines fade in from the centre outward
const HOLD = 1150; // the pinched form sits before it moves
const RELAX = 2000; // pinch relaxes into straight lines
const BLOOM_IN = 650; // warm ground starts washing in under the lines
const BLOOM = 1700;
const LIFT = 3300;
const DONE = 3750;

/**
 * Opens on almond with brick lines fully pinched, holds, then relaxes into the
 * straight hairline field as the warm ground blooms in underneath. Runs on
 * every page load; it lives in the root layout, so client-side navigation
 * between pages does not remount and replay it.
 */
export default function LaunchSequence() {
  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  const [mark, setMark] = useState(false);
  const [up, setUp] = useState(false);
  const [gone, setGone] = useState(true);
  const ref = useRef<HTMLCanvasElement>(null);

  // Decide on the client only, so the server never renders the overlay.
  // Runs on every page load; client-side navigation does not remount it.
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
    field.paint(M0, 0, 0); // nothing drawn yet — the lines fade in

    const raf0 = requestAnimationFrame(() => setOn(true));

    let raf = 0;
    let t0: number | null = null;
    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const el = t - t0;

      // 1. lines fade in from the centre outward, still fully pinched
      const f = Math.min(el / FADE, 1);
      const reveal = 1 - Math.pow(1 - f, 3); // ease-out cubic

      // 2. after the hold, the pinch relaxes into straight lines
      let m = M0;
      if (el > HOLD) {
        const p = Math.min((el - HOLD) / RELAX, 1);
        m = M0 + (1 - M0) * (1 - Math.pow(1 - p, 5)); // ease-out quint
      }

      // 3. the warm ground washes in underneath, overlapping both
      const b = Math.max(0, Math.min((el - BLOOM_IN) / BLOOM, 1));

      field.paint(m, b * b * (3 - 2 * b), reveal); // smoothstep bloom
      if (el < HOLD + RELAX) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const timers = [
      setTimeout(() => setMark(true), HOLD),
      setTimeout(() => setMark(false), 2950),
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
    <div
      className="launch"
      aria-hidden="true"
      data-on={on}
      data-mark={mark}
      data-up={up}
    >
      <canvas ref={ref} />
      <div className="launch__mark">
        <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
          <path
            d="M17 6.4l9.2 5.3v10.6L17 27.6l-9.2-5.3V11.7L17 6.4z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
        <span>Nectar Consultancy</span>
      </div>
    </div>
  );
}
