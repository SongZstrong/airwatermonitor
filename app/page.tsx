import Link from "next/link";
import { getAirQualityOverview } from "@/lib/airQuality";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { getWaterQualityOverview } from "@/lib/waterQuality";

export default async function HomePage() {
  const [airResult, waterResult] = await Promise.allSettled([
    getAirQualityOverview(),
    getWaterQualityOverview(),
  ]);

  const air = airResult.status === "fulfilled" ? airResult.value : null;
  const water = waterResult.status === "fulfilled" ? waterResult.value : null;

  const cleanStat = air?.topClean?.[0];
  const pollutedStat = air?.mostPolluted?.[0];
  const waterSafeStat = water?.topCovered?.[0];
  const waterLowStat = water?.leastCovered?.[0];

  const heroStats = [
    {
      title: "Cleanest air monitor",
      label: cleanStat?.name ?? "Live sensor",
      value:
        cleanStat && cleanStat.unit
          ? `${formatNumber(cleanStat.average, 1)} ${cleanStat.unit}`
          : "Loading from OpenAQ",
    },
    {
      title: "PM2.5 hotspots",
      label: pollutedStat?.name ?? "Live sensor",
      value:
        pollutedStat && pollutedStat.unit
          ? `${formatNumber(pollutedStat.average, 1)} ${pollutedStat.unit}`
          : "Loading from OpenAQ",
    },
    {
      title: "Safest water coverage",
      label: waterSafeStat?.name ?? "World Bank",
      value: waterSafeStat ? formatPercent(waterSafeStat.score, 1) : "Loading...",
    },
    {
      title: "Lowest water access",
      label: waterLowStat?.name ?? "World Bank",
      value: waterLowStat ? formatPercent(waterLowStat.score, 1) : "Loading...",
    },
  ];

  return (
    <>
      <section className="text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Near real-time climate intelligence
        </p>
        <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Track global air quality and water safety on one clean dashboard.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
          We stream PM2.5 readings from OpenAQ stations and combine them with
          World Bank drinking water coverage indicators so you can move from raw
          data to action.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/air-quality"
            className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700"
          >
            Explore air insights
          </Link>
          <Link
            href="/water-quality"
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-900 transition hover:bg-slate-100"
          >
            Review water coverage
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Today&apos;s live signals
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {heroStats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.title}
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
          <span>Sources: OpenAQ, World Bank.</span>
          <span>Updated automatically.</span>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          Navigate the observatory
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Air quality detail
            </h3>
            <p className="mt-3 text-slate-600">
              Drill into city-level PM2.5 readings, rankings, and a live global
              map showing the cleanest and most polluted corridors.
            </p>
            <Link
              href="/air-quality"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              View dashboard →
            </Link>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Water quality detail
            </h3>
            <p className="mt-3 text-slate-600">
              Compare which countries provide safely managed drinking water and
              highlight underserved regions that need urgent funding.
            </p>
            <Link
              href="/water-quality"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              View dashboard →
            </Link>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Climate blog
            </h3>
            <p className="mt-3 text-slate-600">
              Automatically generated posts recap the most encouraging and most
              worrying trends with imagery you can reuse in briefings.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              Read the posts →
            </Link>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Privacy & About us
            </h3>
            <p className="mt-3 text-slate-600">
              Understand how we process telemetry, how to cite the platform, and
              ways to collaborate with local governments.
            </p>
            <Link
              href="/privacy"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              Review details →
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
