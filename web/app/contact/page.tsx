import type { Metadata } from "next";
import { practices } from "@/content/practices";
import { site } from "@/content/site";
import { Arrow } from "@/components/Arrow";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us the problem and the number attached to it. One conversation, no fee, no obligation.",
};

export default function Contact() {
  return (
    <section className="section wrap">
      <div className="sectionHead">
        <div>
          <span className="eyebrow">Contact</span>
          <h1 className="display" style={{ marginTop: 16 }}>
            Tell us the problem and the number attached to it.
          </h1>
        </div>
        <p className="lede">
          One conversation, no fee, no obligation. If it is not our work we will
          say so in that first call and, where we can, point you at who does it.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)",
          gap: "clamp(24px,4vw,64px)",
          alignItems: "start",
        }}
      >
        <form
          style={{ display: "grid", gap: 20 }}
          aria-describedby="form-note"
        >
          <Field label="Your name" name="name" />
          <Field label="Organisation" name="org" />
          <Field label="Email" name="email" type="email" />
          <Field label="Telephone" name="phone" type="tel" required={false} />

          <label style={{ display: "grid", gap: 8 }}>
            <span className="micro" style={{ color: "var(--ink-55)" }}>
              Which practice?
            </span>
            <select name="practice" style={selectStyle} defaultValue="">
              <option value="">Not sure yet</option>
              {practices.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span className="micro" style={{ color: "var(--ink-55)" }}>
              The problem, and the measure attached to it
            </span>
            <textarea name="detail" rows={5} style={selectStyle} />
          </label>

          <p id="form-note" className="micro">
            Submission is not yet wired to a mailbox or CRM — this is a design
            prototype.
          </p>

          <div>
            <button className="btn" type="submit">
              Send enquiry <Arrow />
            </button>
          </div>
        </form>

        <aside style={{ display: "grid", gap: 24 }}>
          <div>
            <h2 className="micro" style={{ color: "var(--ink-55)", marginBottom: 8 }}>
              Direct
            </h2>
            <p className="body" style={{ fontSize: 15.5 }}>
              {site.email}
              <br />
              {site.phone}
            </p>
          </div>

          <hr className="rule" />

          <div id="existing">
            <div className="notice">
              <span className="notice__tag">Existing compliance clients</span>
              <p className="body" style={{ fontSize: 14.6 }}>
                Keep using your named contact and your usual address. Your
                lodgement calendar and fee basis are unchanged — there is
                nothing you need to do because of the rebrand.
              </p>
            </div>
          </div>

          <div>
            <h2 className="micro" style={{ color: "var(--ink-55)", marginBottom: 8 }}>
              Entity
            </h2>
            <p className="body" style={{ fontSize: 15.5 }}>
              {site.entity}
              <br />
              {site.abn}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

const selectStyle: React.CSSProperties = {
  fontFamily: "inherit",
  fontSize: 15,
  color: "var(--ink)",
  background: "var(--white)",
  border: "1px solid var(--line)",
  padding: "11px 13px",
  borderRadius: 0,
  width: "100%",
};

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span className="micro" style={{ color: "var(--ink-55)" }}>
        {label}
        {!required && " (optional)"}
      </span>
      <input type={type} name={name} required={required} style={selectStyle} />
    </label>
  );
}
