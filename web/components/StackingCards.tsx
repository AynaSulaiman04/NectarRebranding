import { process } from "@/content/site";

/**
 * Four stages as cards that stack. Each card sticks a little lower than the
 * one before it, so scrolling deals them onto a pile rather than scrolling
 * them past. Pure CSS sticky — no scroll listener.
 */
export default function StackingCards() {
  return (
    <section className="stack">
      <div className="wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">How we work</span>
            <h2 className="display">Four stages. Two ways out.</h2>
          </div>
          <p className="lede">
            Every engagement is scoped in writing before it starts, with a
            stated fee basis and written exclusions. There is a defined exit at
            the end of stage one and stage two, so a project that should not
            continue does not.
          </p>
        </div>

        <ul className="stack__list">
          {process.map((s, i) => (
            <li className="stack__item" key={s.n} style={{ ["--i" as string]: i }}>
              <article className="stack__card">
                <div className="stack__top">
                  <span className="stack__n tnum">{s.n}</span>
                  <span className="stack__rule" />
                </div>
                <h3 className="display">{s.title}</h3>
                <p>{s.body}</p>
                <div className="stack__exit">{s.exit}</div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
