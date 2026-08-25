/**
 * Firm-level content. Anything marked PLACEHOLDER is illustrative and must be
 * replaced with a real value before the site is published (brief, Section 09).
 */

export const site = {
  name: "Nectar Consultancy",
  entity: "Nectar Consulting Group Pty Ltd",
  // PLACEHOLDER — no domain has been registered yet (brief R19).
  domain: "nectarconsultancy.com.au",
  email: "hello@nectarconsultancy.com.au",
  // PLACEHOLDER
  phone: "+61 X XXXX XXXX",
  // PLACEHOLDER
  abn: "ABN to be confirmed",
  locale: "en-AU",
};

export const stats = [
  // PLACEHOLDER figures — illustrative pending client confirmation.
  { n: "140+", label: "Engagements" },
  { n: "11", label: "Years practising" },
  { n: "6", label: "Practices" },
  { n: "4", label: "States served" },
];

export const sectors = [
  {
    name: "Not-for-profit and charities",
    detail:
      "The practice's original specialism. ACNC-registered entities, federated groups and DGR-endorsed funds, from establishment through to audit.",
  },
  {
    name: "Public sector and government",
    detail:
      "Panel applications, procurement response and the reporting obligations that attach to public money.",
  },
  {
    name: "Health and community services",
    detail:
      "Providers carrying both funding-body reporting and operational load, where compliance and efficiency are the same problem.",
  },
  {
    name: "Professional services",
    detail:
      "Firms billing time who have outgrown spreadsheets — job costing, pipeline and the structure underneath both.",
  },
  {
    name: "Industrial and trades",
    detail:
      "Operators with quoting, scheduling and compliance running in parallel across systems that do not talk.",
  },
  {
    name: "Member organisations",
    detail:
      "Associations and peak bodies balancing member service against governance obligation and a volunteer board.",
  },
];

export const process = [
  {
    n: "01",
    title: "Diagnostic",
    body: "Two to three weeks. We map the process, the obligations and the cost of the current state, and put a number on the gap.",
    exit: "Exit point — fixed fee, no obligation to continue.",
  },
  {
    n: "02",
    title: "Scope",
    body: "A written statement of work: deliverables, sequence, dependencies, fee basis and explicit exclusions. Signed before any build starts.",
    exit: "Exit point — the scope is yours to take elsewhere.",
  },
  {
    n: "03",
    title: "Delivery",
    body: "The work itself, run against the scope with a named lead and a fortnightly written status. Variations are priced before they happen.",
    exit: "Variation control — nothing unbilled, nothing unannounced.",
  },
  {
    n: "04",
    title: "Handover",
    body: "Documentation, training and a measured before-and-after against the diagnostic. Retained support is optional and separately priced.",
    exit: "Measured against the stage-one number.",
  },
];

export type CaseNote = {
  sector: string;
  practice: string;
  measure: string;
  from: string;
  to: string;
  delta: string;
  tone: "moss" | "brick" | "plum";
  note: string;
};

/** PLACEHOLDER — every figure below is illustrative pending client sign-off (brief Q4). */
export const cases: CaseNote[] = [
  {
    sector: "Not-for-profit",
    practice: "Compliance",
    measure: "AIS preparation",
    from: "26 days",
    to: "7 days",
    delta: "−19 days",
    tone: "brick",
    note: "Nine federated entities consolidated onto one evidence register.",
  },
  {
    sector: "Professional services",
    practice: "Software and systems",
    measure: "Quote to invoice",
    from: "31 days",
    to: "21 days",
    delta: "−31%",
    tone: "moss",
    note: "Three duplicate approval steps removed; job costing moved off spreadsheets.",
  },
  {
    sector: "Public sector",
    practice: "Tendering",
    measure: "Panel submissions",
    from: "0 of 3",
    to: "2 of 4",
    delta: "2 awards",
    tone: "plum",
    note: "Reusable response library with a scored go/no-go gate applied before writing.",
  },
  {
    sector: "Health services",
    practice: "Structuring",
    measure: "Entity count",
    from: "11",
    to: "4",
    delta: "−7 entities",
    tone: "moss",
    note: "Group simplified without interrupting funding agreements or service delivery.",
  },
];
