import { WorldMap } from "@/components/WorldMap";
import { RankingPanel } from "@/components/RankingPanel";
import { formatPercent } from "@/lib/formatters";
import { getWaterQualityOverview } from "@/lib/waterQuality";
import { getAirQualityOverview } from "@/lib/airQuality";

export const metadata = {
  title: "Water Quality Dashboard | Global Air & Water Observatory",
  description:
    "Safely managed drinking water coverage from the latest World Bank surveys.",
};

export default async function WaterQualityPage() {
  const [water, air] = await Promise.all([
    getWaterQualityOverview(),
    getAirQualityOverview(),
  ]);

  const mapData = water.stats.map((stat) => ({
    iso3: stat.iso3,
    value: stat.score,
    name: stat.name,
    region: stat.region,
  }));

  const airMapData = air.stats.map((stat) => ({
    iso3: stat.iso3,
    value: stat.average,
    name: stat.name,
    region: stat.region,
  }));

  const averageCoverage = water.stats.length
    ? water.stats.reduce((acc, item) => acc + item.score, 0) /
      water.stats.length
    : 0;

  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Water quality
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          Safely managed drinking water coverage
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          This dashboard relies on the World Bank indicator SH.H2O.SMDW.ZS, the
          most comparable dataset for safe drinking water services. Higher
          values are better because they represent a larger share of residents
          served by regulated utilities and point-of-use disinfection.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Countries covered
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {water.stats.length}
            </p>
            <p className="text-sm text-slate-500">Latest surveys 2018-2023</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Average coverage
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatPercent(averageCoverage, 1)}
            </p>
            <p className="text-sm text-slate-500">
              Weighted equally per country
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Newest data point
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {water.topCovered[0]?.year ?? "Latest survey"}
            </p>
            <p className="text-sm text-slate-500">Best-performing country</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          Map of drinking water access
        </h2>
        <WorldMap
          data={mapData}
          legendLabel="Safely managed drinking water (%)"
          formatOptions={{ decimals: 0, suffix: "%" }}
          detailMetrics={[
            {
              label: "Average PM2.5",
              data: airMapData,
              formatOptions: { decimals: 1, suffix: " µg/m³" },
            },
          ]}
        />
        <p className="mt-4 text-sm text-slate-500">
          {water.source}. Click any country to see paired PM2.5 readings.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Global rankings
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <RankingPanel
            title="Top 15 countries with safe water"
            items={water.topCovered.map((entry) => ({
              name: `${entry.name} (${entry.year})`,
              value: formatPercent(entry.score, 1),
              detail: "Safely managed coverage",
            }))}
            accent="good"
          />
          <RankingPanel
            title="Top 15 countries needing investment"
            items={water.leastCovered.map((entry) => ({
              name: `${entry.name} (${entry.year})`,
              value: formatPercent(entry.score, 1),
              detail: "Safely managed coverage",
            }))}
            accent="bad"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Capital city view
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <RankingPanel
            title="15 cities with safest taps"
            items={water.topCities.map((city) => ({
              name: city.city,
              value: formatPercent(city.score, 1),
              detail: `${city.country} • Survey ${city.year}`,
            }))}
            accent="good"
          />
          <RankingPanel
            title="15 cities needing upgrades"
            items={water.leastCities.map((city) => ({
              name: city.city,
              value: formatPercent(city.score, 1),
              detail: `${city.country} • Survey ${city.year}`,
            }))}
            accent="bad"
          />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          City names follow national capitals to provide a relatable reference point for the national survey values.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          How to interpret the data
        </h2>
        <div className="space-y-3 text-slate-600">
          <p>
            Safely managed drinking water services mean water sources located on
            premises, available when needed and free from contamination. Lower
            percentages typically reflect insufficient chlorination, drought, or
            conflict-driven damage to infrastructure.
          </p>
          <p>
            This page updates twice a day to capture new releases from
            government statistical offices as they flow through the World Bank.
          </p>
        </div>
      </section>
    </>
  );
}
