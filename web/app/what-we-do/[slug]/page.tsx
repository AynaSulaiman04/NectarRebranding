import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Arrow } from "@/components/Arrow";
import { practices, getPractice } from "@/content/practices";

export function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) return {};
  return { title: practice.name, description: practice.summary };
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) notFound();

  const index = practices.findIndex((p) => p.slug === slug);
  const next = practices[(index + 1) % practices.length];

  return (
    <>
      <section className="section wrap">
        <p className="micro" style={{ marginBottom: 26 }}>
          <Link href="/what-we-do" className="textlink" style={{ color: "var(--ink-38)" }}>
            Practices
          </Link>
          <span aria-hidden="true"> / </span>
          {practice.name}
        </p>

        <div className="sectionHead">
          <div>
            <span className="eyebrow tnum">
              {String(index + 1).padStart(2, "0")} / 06
            </span>
            <h1 className="display" style={{ marginTop: 16 }}>
              {practice.name}
            </h1>
          </div>
          <div>
            <hr className="rule--brick" style={{ marginBottom: 22 }} />
            <p className="lede">{practice.lede}</p>
          </div>
        </div>

        <hr className="rule" />

        <div className="grid3" style={{ marginTop: 40, gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
          {practice.capabilities.map((c, i) => (
            <div className="cell" key={c.title}>
              <span className="micro tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display display-500">{c.title}</h3>
              <p>{c.detail}</p>
            </div>
          ))}
        </div>

        <Reveal>
          <dl className="stats" style={{ marginTop: 40, gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
            <div className="stat">
              <dt className="stat__l" style={{ marginTop: 0, marginBottom: 10 }}>Audience</dt>
              <dd style={{ fontSize: 15.5 }}>{practice.audience}</dd>
            </div>
            <div className="stat">
              <dt className="stat__l" style={{ marginTop: 0, marginBottom: 10 }}>Typical duration</dt>
              <dd style={{ fontSize: 15.5 }}>{practice.duration}</dd>
            </div>
            <div className="stat">
              <dt className="stat__l" style={{ marginTop: 0, marginBottom: 10 }}>Fee basis</dt>
              <dd style={{ fontSize: 15.5 }}>{practice.basis}</dd>
            </div>
          </dl>
        </Reveal>

        <p style={{ marginTop: 40 }}>
          <Link className="textlink" href={`/what-we-do/${next.slug}`}>
            Next practice — {next.name} <Arrow />
          </Link>
        </p>
      </section>

      <CtaBand />
    </>
  );
}
