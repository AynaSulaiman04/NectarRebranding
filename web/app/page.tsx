import Link from "next/link";
import Hero from "@/components/Hero";
import DarkStatement from "@/components/DarkStatement";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Arrow } from "@/components/Arrow";
import { practices } from "@/content/practices";
import { sectors, stats, cases } from "@/content/site";

export default function Home() {
  return (
    <>
      {/* the field is now the hero itself — revealed as the launch curtain lifts */}
      <Hero />

      {/* the black beat the hero's ground resolves into */}
      <DarkStatement />

      {/* ---------- proof strip ---------- */}
      <section className="section--tight wrap">
        <Reveal>
          <dl className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <dd className="stat__n tnum">{s.n}</dd>
                <dt className="stat__l">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ---------- practices ---------- */}
      <section className="section wrap" id="practices">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Practices</span>
            <h2 className="display">Six practices, stated plainly.</h2>
          </div>
          <p className="lede">
            Written so a buyer can point at the thing they need. Compliance
            remains a named specialism — the same team, the same lodgement
            calendars — rather than the whole offer.
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
      </section>

      {/* ---------- sectors ---------- */}
      <section className="section wrap" id="sectors">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Sectors</span>
            <h2 className="display">Where we already work.</h2>
          </div>
          <p className="lede">
            Eleven years of compliance work built the not-for-profit practice.
            The others follow the same rule: sectors where obligation and
            efficiency are the same problem.
          </p>
        </div>

        <div className="grid3">
          {sectors.map((s) => (
            <div className="cell" key={s.name}>
              <h3 className="display display-500">{s.name}</h3>
              <p>{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- evidence ---------- */}
      <section className="section wrap" id="evidence">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Evidence</span>
            <h2 className="display">The number that moved.</h2>
          </div>
          <p className="lede">
            Every engagement is measured against the figure agreed at
            diagnostic. Case notes below are illustrative pending client sign-off
            on publication.
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

        <p style={{ marginTop: 24 }}>
          <Link className="textlink" href="/evidence">
            All case notes <Arrow />
          </Link>
        </p>
      </section>

      {/* ---------- existing clients ---------- */}
      <section className="section--tight wrap">
        <Reveal>
          <div className="notice">
            <span className="notice__tag">For existing clients</span>
            <h3 className="display display-500">
              Nothing about your engagement changes.
            </h3>
            <p className="body" style={{ marginTop: 12, maxWidth: "70ch" }}>
              Your lodgement calendar, your ACNC and ATO deadlines, your fee
              basis and your named contact are all unchanged. The rebrand adds
              services around the compliance practice; it does not alter the
              practice itself.
            </p>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
