import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import HairlineBand from "@/components/HairlineBand";
import { sectors } from "@/content/site";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Not-for-profit, public sector, health and community services, professional services, industrial and trades, and member organisations.",
};

export default function Sectors() {
  return (
    <>
      <section className="section wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Sectors</span>
            <h1 className="display" style={{ marginTop: 16 }}>
              Where we already work.
            </h1>
          </div>
          <p className="lede">
            We take work in sectors where regulatory obligation and operating
            efficiency are the same problem — because that is where a
            consultancy that understands both is worth more than two that
            understand one each.
          </p>
        </div>

        <div className="grid3">
          {sectors.map((s) => (
            <div className="cell" key={s.name}>
              <h2 className="display display-500" style={{ fontSize: 21 }}>
                {s.name}
              </h2>
              <p>{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <HairlineBand />
      <CtaBand />
    </>
  );
}
