"use client";

import { useEffect, useRef } from "react";
import { makeField, prefersReducedMotion } from "@/lib/field";

/**
 * The hairline field demoted to a horizontal accent band. Settled (straight
 * lines over the warm field), breathing very slightly so it is not inert.
 */
export default function HairlineBand({ className = "band" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const field = makeField(cv);
    const reduced = prefersReducedMotion();
    let raf = 0;
    let running = false;

    field.size();
    field.paint(1, 1);

    const tick = (t: number) => {
      if (!running) return;
      field.paint(0.985 + 0.015 * Math.cos(t / 9000), 1);
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

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        field.size();
        field.paint(1, 1);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
