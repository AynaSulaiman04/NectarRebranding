"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The black beat the hero resolves into. Statement type centred in the frame,
 * with the firm's position set small along the foot. The drawn line picks up
 * the blue the hero just travelled through, so the two read as one sequence.
 */
export default function DarkStatement() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="dark" ref={ref} data-in={inView}>
      <svg
        className="dark__line"
        viewBox="0 0 420 640"
        fill="none"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
      >
        <path
          d="M182 24C96 150 62 300 150 424c62 88 168 108 254 62"
          stroke="var(--sky-600)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M176 44C150 78 132 108 122 138"
          stroke="var(--sky-600)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity=".55"
        />
      </svg>

      <div className="dark__inner">
        <h2 className="dark__title display">
          <span>A Clear Path</span>
          <span>Through Every</span>
          <span className="dark__em">Obligation</span>
        </h2>

        <div className="dark__foot">
          <span className="dark__label">The firm</span>
          <span className="dark__label">Since 2015</span>
          <p className="dark__body">
            Nectar Consultancy works with Australian organisations on business
            solutions, process optimisation and regulatory compliance. We scope
            every engagement in writing, name what is excluded, and measure the
            result against the figure agreed before the work began.
          </p>
        </div>
      </div>
    </section>
  );
}
