import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Global Air & Water Observatory, including analytics, data retention, and user rights.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "1. What data we collect",
    items: [
      "Site diagnostics such as page request timestamps, route paths, and basic performance metrics.",
      "Aggregated analytics events provided by Vercel Analytics.",
      "No account registration, no user-uploaded files, and no intentional collection of sensitive personal data.",
    ],
  },
  {
    title: "2. Why we process data",
    items: [
      "To keep the service stable, secure, and fast.",
      "To understand which pages are useful and improve content quality.",
      "To detect abuse patterns (for example, automated scraping that harms availability).",
    ],
  },
  {
    title: "3. Data sources shown on the dashboards",
    items: [
      "OpenAQ for PM2.5 air-quality measurements.",
      "World Bank indicator SH.H2O.SMDW.ZS for safely managed drinking-water coverage.",
      "Rest Countries for country metadata such as ISO codes and regions.",
    ],
  },
  {
    title: "4. Cookies and tracking",
    items: [
      "Essential platform cookies may be used for cache behavior and performance delivery.",
      "We do not run ad retargeting pixels or cross-site behavioral advertising trackers.",
      "Analytics data is aggregated and used for product improvement, not personal profiling.",
    ],
  },
  {
    title: "5. Data retention",
    items: [
      "Operational logs are retained for a limited period based on hosting-provider defaults.",
      "We keep only what is needed for reliability, security, and troubleshooting.",
      "When feasible, logs are minimized and anonymized.",
    ],
  },
  {
    title: "6. Third-party processors",
    items: [
      "Vercel (hosting, analytics, and edge delivery).",
      "Public data APIs listed above; their own terms and privacy policies apply to their services.",
    ],
  },
  {
    title: "7. International transfers",
    items: [
      "Infrastructure providers may process data in multiple regions.",
      "We choose reputable providers that implement industry-standard safeguards.",
    ],
  },
  {
    title: "8. Your rights",
    items: [
      "You may request information about personal data processing relevant to your usage.",
      "You may request correction or deletion where applicable by law.",
      "You may object to certain processing activities where legally available.",
    ],
  },
  {
    title: "9. Children",
    items: [
      "This site is not directed to children under applicable minimum ages.",
      "We do not knowingly collect personal data from children.",
    ],
  },
  {
    title: "10. Policy updates",
    items: [
      "We may update this policy as legal requirements or technical architecture evolve.",
      "Material changes will be reflected with an updated effective date on this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Privacy Policy</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">How we handle data and analytics</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          We build this project for public interest. That means clear data provenance, minimal personal-data
          collection, and explicit explanations about what is tracked and why.
        </p>
        <p className="mt-2 text-sm text-slate-500">Effective date: 2026-03-08</p>
      </section>

      <section className="space-y-5">
        {sections.map((section) => (
          <article key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Contact for privacy requests</p>
        <p>Email: privacy@airwatermonitor.org</p>
        <p>General support: hello@airwatermonitor.org</p>
      </section>
    </>
  );
}
