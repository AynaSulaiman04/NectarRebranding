"use client";

import { useEffect, useRef, useState } from "react";
import { makeField, prefersReducedMotion } from "@/lib/field";
import { LAUNCH_DONE_EVENT } from "@/lib/useTypewriter";

const M0 = 0.015; // fully pinched
const HOLD = 560; // hold the bowtie so it registers
const RELAX = 2300; // pinch relaxes into straight lines
const BLOOM = 1500; // warm field washes in underneath
const LIFT = 2980;
const DONE = 3400;

const SEEN_KEY = "nectar.launch.seen";

/**
 * Opens on almond with brick lines fully pinched, holds, then relaxes into the
 * straight hairline field as the warm ground blooms in underneath. Runs once
 * per browser session — an enterprise site should not replay an intro on every
 * navigation.
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
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || prefersReducedMotion()) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
      sessionStorage.setItem("nectar.launch.running", "1");
    } catch {
      /* private mode — run it anyway */
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
    field.paint(M0, 0);

    const raf0 = requestAnimationFrame(() => setOn(true));

    let raf = 0;
    let t0: number | null = null;
    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const el = t - t0;
      let m = M0;
      if (el > HOLD) {
        const p = Math.min((el - HOLD) / RELAX, 1);
        m = M0 + (1 - M0) * (1 - Math.pow(1 - p, 5)); // ease-out quint
      }
      const q = Math.min(el / BLOOM, 1);
      field.paint(m, q * q * (3 - 2 * q)); // smoothstep bloom
      if (el < HOLD + RELAX) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const timers = [
      setTimeout(() => setMark(true), 640),
      setTimeout(() => setMark(false), 2500),
      setTimeout(() => setUp(true), LIFT),
      setTimeout(() => {
        document.body.style.overflow = "";
        setGone(true);
        try {
          sessionStorage.removeItem("nectar.launch.running");
        } catch {
          /* ignore */
        }
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
