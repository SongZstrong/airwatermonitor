import { getCountryDirectory } from "./countries";

type WorldBankRecord = {
  countryiso3code: string;
  country: { value: string };
  date: string;
  value: number | null;
};

export type WaterQualityStat = {
  iso3: string;
  name: string;
  score: number;
  year: string;
  latitude: number;
  longitude: number;
  capital?: string;
  region?: string;
};

export type WaterQualityOverview = {
  stats: WaterQualityStat[];
  topCovered: WaterQualityStat[];
  leastCovered: WaterQualityStat[];
  topCities: WaterCityStat[];
  leastCities: WaterCityStat[];
  source: string;
};

export type WaterCityStat = {
  city: string;
  country: string;
  score: number;
  year: string;
};

const WORLD_BANK_URL =
  "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.SMDW.ZS?per_page=400&format=json&date=2018:2023";

const FALLBACK_WATER_STATS: WaterQualityStat[] = [
  {
    iso3: "NZL",
    name: "New Zealand",
    score: 99.0,
    year: "2022",
    latitude: -41.0,
    longitude: 174.0,
    capital: "Wellington",
    region: "Oceania",
  },
  {
    iso3: "FIN",
    name: "Finland",
    score: 98.4,
    year: "2022",
    latitude: 64.0,
    longitude: 26.0,
    capital: "Helsinki",
    region: "Europe",
  },
  {
    iso3: "SGP",
    name: "Singapore",
    score: 100.0,
    year: "2021",
    latitude: 1.3,
    longitude: 103.8,
    capital: "Singapore",
    region: "Asia",
  },
  {
    iso3: "ZAF",
    name: "South Africa",
    score: 68.3,
    year: "2020",
    latitude: -29.0,
    longitude: 24.0,
    capital: "Pretoria",
    region: "Africa",
  },
  {
    iso3: "NGA",
    name: "Nigeria",
    score: 21.0,
    year: "2019",
    latitude: 9.1,
    longitude: 8.7,
    capital: "Abuja",
    region: "Africa",
  },
  {
    iso3: "ETH",
    name: "Ethiopia",
    score: 12.0,
    year: "2019",
    latitude: 9.1,
    longitude: 40.5,
    capital: "Addis Ababa",
    region: "Africa",
  },
];

const FALLBACK_WATER_CITY_STATS: WaterCityStat[] = FALLBACK_WATER_STATS.map(
  (stat) => ({
    city: stat.capital ?? `${stat.name} Capital`,
    country: stat.name,
    score: stat.score,
    year: stat.year,
  }),
);

function summarizeWater(
  stats: WaterQualityStat[],
  source: string,
  cityStats: WaterCityStat[],
): WaterQualityOverview {
  const valid = stats.filter((entry) => entry.score > 0);

  const topCovered = [...valid]
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const leastCovered = [...valid]
    .sort((a, b) => a.score - b.score)
    .slice(0, 15);

  const validCities = cityStats.filter((entry) => entry.score > 0);
  const topCities = [...validCities]
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
  const leastCities = [...validCities]
    .sort((a, b) => a.score - b.score)
    .slice(0, 15);

  return {
    stats: valid,
    topCovered,
    leastCovered,
    topCities,
    leastCities,
    source,
  };
}

export async function getWaterQualityOverview(): Promise<WaterQualityOverview> {
  try {
    const [countryDirectory, response] = await Promise.all([
      getCountryDirectory(),
      fetch(WORLD_BANK_URL, { next: { revalidate: 60 * 60 * 12 } }),
    ]);

    if (!response.ok) {
      throw new Error(`World Bank responded with ${response.status}`);
    }

    const payload = (await response.json()) as [unknown, WorldBankRecord[]];
    const rows = payload[1] ?? [];

    const latestByCountry = new Map<string, WorldBankRecord>();

    rows.forEach((row) => {
      if (!row.countryiso3code || row.value === null) return;

      const existing = latestByCountry.get(row.countryiso3code);
      if (!existing || Number(row.date) > Number(existing.date)) {
        latestByCountry.set(row.countryiso3code, row);
      }
    });

    const stats: WaterQualityStat[] = Array.from(
      latestByCountry.entries(),
    ).map(([iso3, record]) => {
      const country = countryDirectory[iso3];
      return {
        iso3,
        name: country?.name ?? record.country.value ?? iso3,
        score: Number((record.value ?? 0).toFixed(2)),
        year: record.date,
        latitude: country?.lat ?? 0,
        longitude: country?.lng ?? 0,
        capital: country?.capital,
        region: country?.region,
      };
    });

    const cityStats: WaterCityStat[] = stats.map((stat) => ({
      city: stat.capital ?? `${stat.name} Capital`,
      country: stat.name,
      score: stat.score,
      year: stat.year,
    }));

    return summarizeWater(
      stats,
      "World Bank indicator SH.H2O.SMDW.ZS (% population with safely managed drinking water)",
      cityStats,
    );
  } catch {
    return summarizeWater(
      FALLBACK_WATER_STATS,
      "Static World Bank sample (offline mode: % safely managed drinking water)",
      FALLBACK_WATER_CITY_STATS,
    );
  }
}
