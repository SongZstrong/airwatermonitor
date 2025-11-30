export const metadata = {
  title: "Privacy & About | Global Air & Water Observatory",
  description:
    "How we handle data, protect privacy, and who maintains the platform.",
};

const policies = [
  {
    title: "Data we process",
    detail:
      "Only public, anonymised telemetry from OpenAQ, the World Bank, and Rest Countries is processed. We do not collect personal data from visitors.",
  },
  {
    title: "Cookies",
    detail:
      "This site relies exclusively on functional cookies needed by Next.js for caching. Analytics and behavioural tracking are disabled by default.",
  },
  {
    title: "Security controls",
    detail:
      "APIs are accessed over HTTPS with a read-only token. Raw responses stay in volatile memory and are never stored on disk.",
  },
];

const aboutPoints = [
  "Air & Water Monitor is maintained by a volunteer civic tech team that collaborates with environmental agencies.",
  "All code is open-source. You can fork it, connect different APIs, or embed the widgets in municipal dashboards.",
  "We welcome pull requests that add more datasets, improve accessibility, or translate the UI.",
];

export default function PrivacyPage() {
  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Privacy & about us
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          We protect visitors while sharing open data
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Transparency matters. Below you will find short summaries about how
          the platform uses data, how to request deletion of server logs, and
          where to reach us for partnerships.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          Privacy highlights
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {policies.map((policy) => (
            <article
              key={policy.title}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {policy.title}
              </h3>
              <p className="mt-3 text-slate-600">{policy.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Need a signed data processing agreement? Email{" "}
          <a
            href="mailto:privacy@airwatermonitor.org"
            className="font-semibold text-slate-900"
          >
            privacy@airwatermonitor.org
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          About the team
        </h2>
        <div className="space-y-3 text-slate-600">
          {aboutPoints.map((point, index) => (
            <p key={index}>{point}</p>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Contact</p>
          <p>Email: hello@airwatermonitor.org</p>
          <p>Press: press@airwatermonitor.org</p>
        </div>
      </section>
    </>
  );
}
