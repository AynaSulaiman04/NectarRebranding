import Link from "next/link";
import { site } from "@/content/site";
import { Arrow } from "./Arrow";

export default function CtaBand() {
  return (
    <section className="cta">
      <div className="wrap">
        <span className="eyebrow" style={{ color: "var(--amber)" }}>
          Start here
        </span>
        <h2 className="display" style={{ marginTop: 16 }}>
          Tell us the problem and the number attached to it.
        </h2>
        <p>
          One conversation, no fee, no obligation. If it is not our work we will
          say so in that first call and, where we can, point you at who does it.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
          <Link className="btn" href="/contact">
            Book a diagnostic call <Arrow />
          </Link>
          <Link className="btn btn--ghost" href="/contact#existing">
            Existing compliance client
          </Link>
        </div>
        <dl className="ctaMeta">
          <div>
            <dt>Email</dt>
            <dd>{site.email}</dd>
          </div>
          <div>
            <dt>Telephone</dt>
            <dd>{site.phone}</dd>
          </div>
          <div>
            <dt>Entity</dt>
            <dd>{site.entity}</dd>
          </div>
          <div>
            <dt>Operating</dt>
            <dd>Australia wide</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
