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
        viewBox="0 0 1100 634"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="dark__stroke"
          d="M181 182C120 296 230 396 330 486c42 40 58 76 70 80c40 12 105-34 160-58"
          stroke="var(--azure-500)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="dark__stroke dark__stroke--tick"
          d="M188 189c7 15 14 26 19 34"
          stroke="var(--azure-500)"
          strokeWidth="1.2"
          strokeLinecap="round"
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
