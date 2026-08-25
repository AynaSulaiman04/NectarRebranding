import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Arrow } from "@/components/Arrow";
import { practices } from "@/content/practices";

export const metadata: Metadata = {
  title: "Practices",
  description:
    "Six practices: compliance, tendering, software and systems, growth and customer success, marketing and innovation, structuring and restructuring.",
};

export default function WhatWeDo() {
  return (
    <>
      <section className="section wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Practices</span>
            <h1 className="display" style={{ marginTop: 16 }}>
              What we do, in full.
            </h1>
          </div>
          <p className="lede">
            Anything that improves efficiency for the business is in scope.
            Anything that does not, is not. Each practice below states its
            audience, its typical duration and how it is charged, so an enquirer
            can qualify themselves before the first call.
          </p>
        </div>

        <div className="plist">
          {practices.map((p, i) => (
            <Reveal key={p.slug} delay={i * 40}>
              <Link className="prow" href={`/what-we-do/${p.slug}`}>
                <span className="prow__i tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="prow__t display">{p.name}</span>
                <span className="prow__d">{p.summary}</span>
                <span className="prow__a">
                  <Arrow size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="lede" style={{ marginTop: 32 }}>
          Not sure which one you are? Describe the problem and the number
          attached to it. We will tell you which practice it sits in — or that it
          is not ours.
        </p>
      </section>

      <CtaBand />
    </>
  );
}
