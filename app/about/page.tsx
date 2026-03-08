import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Global Air & Water Observatory project, mission, data sources, and editorial process.",
  alternates: { canonical: "/about" },
};

const principles = [
  "Public-interest first: we prioritize clarity and transparency over growth metrics.",
  "Source traceability: every chart and ranking links back to a verifiable public dataset.",
  "Methodology openness: aggregation rules are documented and versioned in source control.",
  "Accessibility by default: readable contrast, keyboard-friendly navigation, and semantic HTML.",
];

export default function AboutPage() {
  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">About</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Why this project exists</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Global Air & Water Observatory helps people understand two critical public-health indicators:
          PM2.5 air pollution and safely managed drinking-water coverage. We combine reputable public
          datasets into clear dashboards so non-specialists can still make evidence-based decisions.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Mission and scope</h2>
        <div className="space-y-3 text-slate-600">
          <p>
            We focus on global comparability, not hyper-local forecasting. The platform is intended for
            education, public communication, and early policy exploration.
          </p>
          <p>
            We are not a replacement for national regulatory portals or emergency alert systems.
            For official advisories, users should always consult their local environmental authority.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">How we work</h2>
        <ul className="grid gap-3 text-slate-600 md:grid-cols-2">
          {principles.map((item) => (
            <li key={item} className="rounded-2xl border border-slate-200 bg-white p-4">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Data provenance</h2>
        <div className="space-y-3 text-slate-600">
          <p>
            Air-quality figures are sourced from OpenAQ PM2.5 readings. Water-coverage indicators come from
            the World Bank dataset SH.H2O.SMDW.ZS. Country metadata is enriched via Rest Countries.
          </p>
          <p>
            When live API calls fail, the platform may display clearly labeled fallback samples so pages stay
            functional. Source labels are shown directly on dashboard pages for transparency.
          </p>
        </div>
      </section>
    </>
  );
}
