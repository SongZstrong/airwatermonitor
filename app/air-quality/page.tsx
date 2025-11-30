import { WorldMap } from "@/components/WorldMap";
import { RankingPanel } from "@/components/RankingPanel";
import { getAirQualityOverview } from "@/lib/airQuality";
import { formatDateToReadable, formatNumber } from "@/lib/formatters";
import { getWaterQualityOverview } from "@/lib/waterQuality";

export const metadata = {
  title: "Air Quality Dashboard | Global Air & Water Observatory",
  description:
    "Live OpenAQ PM2.5 data with world rankings, map visualisation, and key insights.",
};

export default async function AirQualityPage() {
  const [air, water] = await Promise.all([
    getAirQualityOverview(),
    getWaterQualityOverview(),
  ]);

  const mapData = air.stats.map((stat) => ({
    iso3: stat.iso3,
    value: stat.average,
    name: stat.name,
    region: stat.region,
  }));

  const waterMapData = water.stats.map((stat) => ({
    iso3: stat.iso3,
    value: stat.score,
    name: stat.name,
    region: stat.region,
  }));

  const globalAverage = air.stats.length
    ? air.stats.reduce((acc, item) => acc + item.average, 0) / air.stats.length
    : 0;

  const latestStamp = air.stats
    .map((item) => item.updatedAt)
    .sort()
    .reverse()[0];

  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Air quality
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          Fresh PM2.5 readings around the world
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Readings stream from the OpenAQ latest endpoint. Each bubble in the
          map shows the mean PM2.5 for that country based on the most recent
          hourly measurements we received, so you can see clean air corridors
          and hotspots at a glance.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Coverage
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {air.stats.length} countries
            </p>
            <p className="text-sm text-slate-500">
              Aggregated from {air.stats.reduce((acc, item) => acc + item.sampleCount, 0)} monitoring stations
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Global average
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(globalAverage, 1)} µg/m³
            </p>
            <p className="text-sm text-slate-500">Mean of country averages</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Latest update
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatDateToReadable(latestStamp)}
            </p>
            <p className="text-sm text-slate-500">Local timestamp</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          World PM2.5 map
        </h2>
        <WorldMap
          data={mapData}
          legendLabel="Average PM2.5 (µg/m³)"
          formatOptions={{ decimals: 1, suffix: " µg/m³" }}
          detailMetrics={[
            {
              label: "Safely managed water access",
              data: waterMapData,
              formatOptions: { decimals: 0, suffix: "%" },
            },
          ]}
        />
        <p className="mt-4 text-sm text-slate-500">
          Source: {air.source}. Click any country for paired air and water context.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Global rankings
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <RankingPanel
            title="Top 15 clean air champions"
            items={air.topClean.map((entry) => ({
              name: entry.name,
              value: `${formatNumber(entry.average, 1)} ${entry.unit}`,
              detail: `${entry.sampleCount} monitoring sites`,
            }))}
            accent="good"
          />
          <RankingPanel
            title="Top 15 smoggiest readings"
            items={air.mostPolluted.map((entry) => ({
              name: entry.name,
              value: `${formatNumber(entry.average, 1)} ${entry.unit}`,
              detail: `${entry.sampleCount} monitoring sites`,
            }))}
            accent="bad"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          City rankings
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <RankingPanel
            title="15 cleanest metro averages"
            items={air.cleanCities.map((city) => ({
              name: city.city,
              value: `${formatNumber(city.average, 1)} ${city.unit}`,
              detail: `${city.country} • ${city.sampleCount} sensors`,
            }))}
            accent="good"
          />
          <RankingPanel
            title="15 heaviest PM2.5 loads"
            items={air.pollutedCities.map((city) => ({
              name: city.city,
              value: `${formatNumber(city.average, 1)} ${city.unit}`,
              detail: `${city.country} • ${city.sampleCount} sensors`,
            }))}
            accent="bad"
          />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Cities reflect OpenAQ city fields; averages combine every monitor reporting during the latest fetch.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          Methodology
        </h2>
        <div className="space-y-3 text-slate-600">
          <p>
            Countries receive the average PM2.5 value across every OpenAQ
            location reporting during the last fetch. Lower values signal cleaner air;
            higher values trigger the smog ranking on the right.
          </p>
          <p>
            Units are micrograms per cubic metre (µg/m³). The World Health
            Organization annual guideline is 5 µg/m³, so anything above that
            merits close monitoring.
          </p>
        </div>
      </section>
    </>
  );
}
