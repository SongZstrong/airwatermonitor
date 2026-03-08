import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Global Air & Water Observatory website and APIs.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Legal</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Terms of use</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          By using this site, you agree to these terms. If you do not agree, please discontinue use.
        </p>
      </section>

      <section className="space-y-4 text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Informational purpose.</span> Content is provided for
          educational and informational use only. It does not constitute medical, legal, or regulatory advice.
        </p>
        <p>
          <span className="font-semibold text-slate-900">No warranties.</span> Data accuracy and timeliness are
          not guaranteed. Public APIs can be delayed, unavailable, or revised without notice.
        </p>
        <p>
          <span className="font-semibold text-slate-900">Responsible use.</span> You may quote and share insights
          with attribution to source datasets and this project page.
        </p>
        <p>
          <span className="font-semibold text-slate-900">Liability limitation.</span> We are not liable for
          losses arising from reliance on this site, to the fullest extent permitted by law.
        </p>
        <p>
          <span className="font-semibold text-slate-900">Contact.</span> Questions can be sent to
          {" "}<a href="mailto:hello@airwatermonitor.org" className="font-semibold text-slate-900">hello@airwatermonitor.org</a>.
        </p>
      </section>
    </>
  );
}
