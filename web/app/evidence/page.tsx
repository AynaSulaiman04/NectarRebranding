import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { cases } from "@/content/site";

export const metadata: Metadata = {
  title: "Evidence",
  description:
    "Case notes measured against the figure agreed at diagnostic, by sector and practice.",
};

export default function Evidence() {
  return (
    <>
      <section className="section wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Evidence</span>
            <h1 className="display" style={{ marginTop: 16 }}>
              The number that moved.
            </h1>
          </div>
          <p className="lede">
            Each engagement is measured against a figure agreed at diagnostic,
            before any work starts — so the result is the client&rsquo;s measure,
            not ours.
          </p>
        </div>

        <Reveal>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Sector</th>
                  <th scope="col">Practice</th>
                  <th scope="col">Measure</th>
                  <th scope="col">Before</th>
                  <th scope="col">After</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={`${c.sector}-${c.measure}`}>
                    <td>
                      {c.sector}
                      <br />
                      <span className="micro">{c.note}</span>
                    </td>
                    <td>{c.practice}</td>
                    <td>{c.measure}</td>
                    <td className="tnum">{c.from}</td>
                    <td className="tnum">{c.to}</td>
                    <td className={`delta tnum delta--${c.tone}`}>{c.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="notice" style={{ marginTop: 40, borderLeftColor: "var(--amber)" }}>
          <span className="notice__tag" style={{ color: "var(--amber-ink)" }}>
            Placeholder data
          </span>
          <p className="body" style={{ maxWidth: "72ch" }}>
            The figures on this page are illustrative. Which engagements may be
            published, and with what level of client identification, is an open
            question for the firm before launch.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
