export type Capability = { title: string; detail: string };

export type Practice = {
  slug: string;
  name: string;
  summary: string;
  lede: string;
  capabilities: Capability[];
  audience: string;
  duration: string;
  basis: string;
};

/**
 * The six verticals named by the client in the project meeting (brief R2),
 * with compliance retained as a named practice (R3).
 */
export const practices: Practice[] = [
  {
    slug: "compliance",
    name: "Compliance",
    summary: "ACNC registration, governance, lodgements and audit",
    lede: "The practice Nectar was built on, unchanged. Registration, governance, lodgements and audit for charities, not-for-profits and regulated entities, run against a maintained calendar rather than a deadline scramble.",
    capabilities: [
      { title: "Registration", detail: "Establishment, ACNC registration and DGR endorsement, with the constitution drafted to suit the purpose rather than a template." },
      { title: "Governance", detail: "Board papers, conflict registers, policy sets and the responsible person obligations that sit behind them." },
      { title: "Lodgements", detail: "Annual Information Statement, ATO obligations and a maintained calendar, so nothing is filed late." },
      { title: "Audit", detail: "Audit and review readiness, working papers, and the evidence trail an auditor will actually ask for." },
    ],
    audience: "Charities, not-for-profits and regulated entities",
    duration: "Ongoing, annual cycle",
    basis: "Retainer or fixed fee",
  },
  {
    slug: "tendering",
    name: "Tendering",
    summary: "Bid strategy, response writing and panel applications",
    lede: "Most bid effort is wasted on submissions that were never winnable. We put a scored gate before the writing, then build a response library so the second bid costs a fraction of the first.",
    capabilities: [
      { title: "Go / no-go", detail: "A scored gate applied before anyone writes, so effort goes where the odds actually are." },
      { title: "Response library", detail: "Reusable, maintained answers to the questions that recur across every schedule." },
      { title: "Submission", detail: "Drafting, compliance checking and lodgement against the buyer's own evaluation criteria." },
      { title: "Debrief", detail: "Post-award review turned into changes to the library — win or lose." },
    ],
    audience: "Bidders into government and corporate panels",
    duration: "4–10 weeks per bid",
    basis: "Fixed fee per submission",
  },
  {
    slug: "software-and-systems",
    name: "Software and systems",
    summary: "Selection, implementation and integration",
    lede: "Requirements written from the process, not from a vendor's feature list. We select, implement and integrate, and we measure adoption rather than delivery.",
    capabilities: [
      { title: "Selection", detail: "Requirements drawn from how the work is actually done, then a shortlist scored against them." },
      { title: "Implementation", detail: "Configuration, data migration and the cutover plan behind it." },
      { title: "Integration", detail: "Removing the double entry between systems that were never designed to talk to each other." },
      { title: "Adoption", detail: "Training and documentation, measured on use rather than on go-live." },
    ],
    audience: "Operators on spreadsheets or on the wrong platform",
    duration: "8–20 weeks",
    basis: "Staged fixed fee",
  },
  {
    slug: "growth-and-customer-success",
    name: "Growth and customer success",
    summary: "Pipeline, retention and account structure",
    lede: "For firms with revenue but no repeatable way of producing it. Stage definitions, qualification, and the early-warning signals that show up well before a client leaves.",
    capabilities: [
      { title: "Pipeline", detail: "Stage definitions, qualification criteria and a forecast that survives contact with reality." },
      { title: "Retention", detail: "Onboarding, review cadence and the signals that precede a departure." },
      { title: "Account structure", detail: "Segmentation, coverage, and who owns which relationship." },
      { title: "Measurement", detail: "A small number of measures that are genuinely reported on, rather than a dashboard nobody opens." },
    ],
    audience: "Firms with revenue but no repeatable motion",
    duration: "12 weeks, then review",
    basis: "Fixed fee plus optional retainer",
  },
  {
    slug: "marketing-and-innovation",
    name: "Marketing and innovation",
    summary: "Positioning, brand and new offer development",
    lede: "What is sold, to whom, against whom, in the language a buyer would actually use. Then the brand and the channels to carry it, and the two or three worth doing properly.",
    capabilities: [
      { title: "Positioning", detail: "The offer stated plainly enough that a buyer can repeat it to their board." },
      { title: "Brand and web", detail: "Identity and site built to sell rather than to decorate." },
      { title: "New offers", detail: "Productising what is already done well, and pricing it deliberately." },
      { title: "Channel", detail: "The two or three channels worth doing properly — and the rest declined." },
    ],
    audience: "Firms repositioning or launching an offer",
    duration: "6–14 weeks",
    basis: "Project fee",
  },
  {
    slug: "structuring-and-restructuring",
    name: "Structuring and restructuring",
    summary: "Corporate structure, entities and operating model",
    lede: "Entity design and operating model for groups that have outgrown the structure they started with, sequenced so trading is not interrupted while it changes.",
    capabilities: [
      { title: "Corporate structure", detail: "Entity design, holding arrangements, and where the risk actually sits." },
      { title: "Restructure", detail: "Carve-outs, mergers, and the sequencing that keeps trading uninterrupted." },
      { title: "Operating model", detail: "Roles, decision rights, and the reporting line that follows from them." },
      { title: "Transition", detail: "A staged plan with regulatory obligations mapped at every step." },
    ],
    audience: "Groups outgrowing their current structure",
    duration: "10–24 weeks",
    basis: "Staged fixed fee",
  },
];

export const getPractice = (slug: string) => practices.find((p) => p.slug === slug);
