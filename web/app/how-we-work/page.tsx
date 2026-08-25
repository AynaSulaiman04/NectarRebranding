import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { process } from "@/content/site";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Four stages with two defined exit points. Written scope, stated fee basis, explicit exclusions.",
};

export default function HowWeWork() {
  return (
    <>
      <section className="section wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">How we work</span>
            <h1 className="display" style={{ marginTop: 16 }}>
              Four stages. Two ways out.
            </h1>
          </div>
          <p className="lede">
            Every engagement is scoped in writing before it starts, with a
            stated fee basis and written exclusions. There is a defined exit at
            the end of stage one and stage two, so a project that should not
            continue does not.
          </p>
        </div>

        <Reveal>
          <div className="steps">
            {process.map((s) => (
              <div className="step" key={s.n}>
                <div className="step__n tnum">{s.n}</div>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <div className="step__exit">{s.exit}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="sectionHead" style={{ paddingTop: 64 }}>
          <div>
            <span className="eyebrow">What we exclude</span>
            <h2 className="display">Written down, before you sign.</h2>
          </div>
          <p className="lede">
            An exclusion list is more useful than a capability list. Every
            statement of work names what is <em>not</em> included, so the
            variation conversation happens before the invoice rather than after
            it.
          </p>
        </div>

        <div className="notice">
          <span className="notice__tag">Standard exclusions</span>
          <p className="body" style={{ maxWidth: "72ch" }}>
            Legal advice, audit sign-off, tax agent services and financial
            product advice sit outside our engagement. Where a piece of work
            needs one of them we will say so at diagnostic and, where we can,
            name someone who holds the relevant licence.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
