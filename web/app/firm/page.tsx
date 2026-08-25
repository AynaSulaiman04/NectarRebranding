import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import HairlineBand from "@/components/HairlineBand";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "The firm",
  description:
    "Nectar Consultancy, a trading name of Nectar Consulting Group Pty Ltd. Eleven years of compliance practice, now a general business consultancy.",
};

export default function Firm() {
  return (
    <>
      <section className="section wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">The firm</span>
            <h1 className="display" style={{ marginTop: 16 }}>
              The same practice.
              <br />A wider brief.
            </h1>
          </div>
          <p className="lede">
            Nectar has always been a consultancy. For eleven years the brief was
            charity compliance, and that work continues unchanged. The brief is
            now the whole business.
          </p>
        </div>

        <div className="grid3" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
          <div className="cell" style={{ background: "var(--sunk)" }}>
            <span className="eyebrow eyebrow--muted">Until 2026</span>
            <h2 className="display display-500" style={{ fontSize: 24, margin: "14px 0 10px", opacity: 0.65 }}>
              Nectar Compliance
            </h2>
            <p style={{ opacity: 0.65 }}>
              ACNC registration, governance, lodgements and audit for Australian
              charities. One audience, four pillars, a specialist practice that
              was not built to sell anything.
            </p>
          </div>
          <div className="cell">
            <span className="eyebrow">From 2026</span>
            <h2 className="display display-500" style={{ fontSize: 24, margin: "14px 0 10px" }}>
              Nectar Consultancy
            </h2>
            <p>
              A consulting firm engaged directly on business solutions, business
              optimisation and business process optimisation. Compliance is
              retained as a named practice, with the same team and the same
              lodgement calendars.
            </p>
          </div>
        </div>

        <div className="sectionHead" style={{ paddingTop: 64 }}>
          <div>
            <span className="eyebrow">Entity</span>
            <h2 className="display">Who you are contracting with.</h2>
          </div>
          <p className="lede">
            Nectar Consultancy is the trading name. {site.entity} is the
            contracting entity, and the parent under which the group&rsquo;s
            other companies sit.
          </p>
        </div>

        <dl className="stats" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
          <div className="stat">
            <dt className="stat__l" style={{ marginTop: 0, marginBottom: 10 }}>Trading name</dt>
            <dd style={{ fontSize: 16 }}>{site.name}</dd>
          </div>
          <div className="stat">
            <dt className="stat__l" style={{ marginTop: 0, marginBottom: 10 }}>Legal entity</dt>
            <dd style={{ fontSize: 16 }}>{site.entity}</dd>
          </div>
          <div className="stat">
            <dt className="stat__l" style={{ marginTop: 0, marginBottom: 10 }}>Registration</dt>
            <dd style={{ fontSize: 16 }}>{site.abn}</dd>
          </div>
        </dl>

        <div className="notice" style={{ marginTop: 40, borderLeftColor: "var(--amber)" }}>
          <span className="notice__tag" style={{ color: "var(--amber-ink)" }}>
            To be confirmed
          </span>
          <p className="body" style={{ maxWidth: "72ch" }}>
            Whether partners are named and photographed on this page, or whether
            the firm is presented at firm level only, is an open decision. This
            page is built to take either.
          </p>
        </div>
      </section>

      <HairlineBand />
      <CtaBand />
    </>
  );
}
