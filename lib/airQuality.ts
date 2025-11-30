import { getCountryDirectory, resolveIso3 } from "./countries";

type OpenAQMeasurement = {
  parameter: string;
  value: number;
  unit: string;
  lastUpdated: string;
};

type OpenAQItem = {
  id: number;
  name: string;
  city?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  measurements?: OpenAQMeasurement[];
};

type OpenAQResponse = {
  results: OpenAQItem[];
};

export type AirQualityStat = {
  iso3: string;
  name: string;
  average: number;
  sampleCount: number;
  updatedAt: string;
  latitude: number;
  longitude: number;
  unit: string;
  region: string;
};

export type AirQualityOverview = {
  stats: AirQualityStat[];
  topClean: AirQualityStat[];
  mostPolluted: AirQualityStat[];
  cleanCities: AirCityStat[];
  pollutedCities: AirCityStat[];
  source: string;
};

export type AirCityStat = {
  city: string;
  country: string;
  iso3: string;
  average: number;
  sampleCount: number;
  updatedAt: string;
  unit: string;
};

const OPEN_AQ_URL =
  "https://api.openaq.org/v2/latest?limit=200&parameter=pm25&sort=desc&has_geo=true";

const FALLBACK_AIR_STATS: AirQualityStat[] = [
  {
    iso3: "FIN",
    name: "Finland",
    average: 4.8,
    sampleCount: 12,
    updatedAt: new Date().toISOString(),
    latitude: 64.0,
    longitude: 26.0,
    unit: "µg/m³",
    region: "Europe",
  },
  {
    iso3: "CAN",
    name: "Canada",
    average: 6.2,
    sampleCount: 35,
    updatedAt: new Date().toISOString(),
    latitude: 56.0,
    longitude: -106.0,
    unit: "µg/m³",
    region: "Americas",
  },
  {
    iso3: "IND",
    name: "India",
    average: 64.1,
    sampleCount: 58,
    updatedAt: new Date().toISOString(),
    latitude: 21.0,
    longitude: 78.0,
    unit: "µg/m³",
    region: "Asia",
  },
  {
    iso3: "CHN",
    name: "China",
    average: 55.4,
    sampleCount: 62,
    updatedAt: new Date().toISOString(),
    latitude: 35.0,
    longitude: 103.0,
    unit: "µg/m³",
    region: "Asia",
  },
  {
    iso3: "AUS",
    name: "Australia",
    average: 7.9,
    sampleCount: 18,
    updatedAt: new Date().toISOString(),
    latitude: -25.0,
    longitude: 133.0,
    unit: "µg/m³",
    region: "Oceania",
  },
  {
    iso3: "USA",
    name: "United States",
    average: 8.5,
    sampleCount: 50,
    updatedAt: new Date().toISOString(),
    latitude: 38.0,
    longitude: -97.0,
    unit: "µg/m³",
    region: "Americas",
  },
  {
    iso3: "ZAF",
    name: "South Africa",
    average: 39.2,
    sampleCount: 20,
    updatedAt: new Date().toISOString(),
    latitude: -29.0,
    longitude: 24.0,
    unit: "µg/m³",
    region: "Africa",
  },
  {
    iso3: "BRA",
    name: "Brazil",
    average: 15.1,
    sampleCount: 28,
    updatedAt: new Date().toISOString(),
    latitude: -14.2,
    longitude: -51.9,
    unit: "µg/m³",
    region: "Americas",
  },
  {
    iso3: "NOR",
    name: "Norway",
    average: 5.5,
    sampleCount: 10,
    updatedAt: new Date().toISOString(),
    latitude: 60.5,
    longitude: 8.5,
    unit: "µg/m³",
    region: "Europe",
  },
  {
    iso3: "SWE",
    name: "Sweden",
    average: 5.1,
    sampleCount: 14,
    updatedAt: new Date().toISOString(),
    latitude: 62.0,
    longitude: 15.0,
    unit: "µg/m³",
    region: "Europe",
  },
  {
    iso3: "DEU",
    name: "Germany",
    average: 12.3,
    sampleCount: 30,
    updatedAt: new Date().toISOString(),
    latitude: 51.2,
    longitude: 10.5,
    unit: "µg/m³",
    region: "Europe",
  },
  {
    iso3: "FRA",
    name: "France",
    average: 11.1,
    sampleCount: 22,
    updatedAt: new Date().toISOString(),
    latitude: 46.2,
    longitude: 2.2,
    unit: "µg/m³",
    region: "Europe",
  },
  {
    iso3: "GBR",
    name: "United Kingdom",
    average: 10.2,
    sampleCount: 19,
    updatedAt: new Date().toISOString(),
    latitude: 54.0,
    longitude: -2.0,
    unit: "µg/m³",
    region: "Europe",
  },
  {
    iso3: "JPN",
    name: "Japan",
    average: 13.6,
    sampleCount: 24,
    updatedAt: new Date().toISOString(),
    latitude: 36.2,
    longitude: 138.3,
    unit: "µg/m³",
    region: "Asia",
  },
  {
    iso3: "MEX",
    name: "Mexico",
    average: 22.4,
    sampleCount: 18,
    updatedAt: new Date().toISOString(),
    latitude: 23.6,
    longitude: -102.5,
    unit: "µg/m³",
    region: "Americas",
  },
  {
    iso3: "CHL",
    name: "Chile",
    average: 17.8,
    sampleCount: 16,
    updatedAt: new Date().toISOString(),
    latitude: -35.7,
    longitude: -71.5,
    unit: "µg/m³",
    region: "Americas",
  },
];

const FALLBACK_AIR_CITY_STATS: AirCityStat[] = FALLBACK_AIR_STATS.map((stat) => ({
  city: `${stat.name} City`,
  country: stat.name,
  iso3: stat.iso3,
  average: stat.average,
  sampleCount: stat.sampleCount,
  updatedAt: stat.updatedAt,
  unit: stat.unit,
}));

function summarizeAir(
  stats: AirQualityStat[],
  source: string,
  cityStats: AirCityStat[],
): AirQualityOverview {
  const validStats = stats.filter((stat) => Number.isFinite(stat.average));
  const topClean = [...validStats]
    .sort((a, b) => a.average - b.average)
    .slice(0, 15);

  const mostPolluted = [...validStats]
    .sort((a, b) => b.average - a.average)
    .slice(0, 15);

  const validCities = cityStats.filter((stat) => Number.isFinite(stat.average));
  const cleanCities = [...validCities]
    .sort((a, b) => a.average - b.average)
    .slice(0, 15);
  const pollutedCities = [...validCities]
    .sort((a, b) => b.average - a.average)
    .slice(0, 15);

  return {
    stats: validStats,
    topClean,
    mostPolluted,
    cleanCities,
    pollutedCities,
    source,
  };
}

export async function getAirQualityOverview(): Promise<AirQualityOverview> {
  try {
    const [countryDirectory, response] = await Promise.all([
      getCountryDirectory(),
      fetch(OPEN_AQ_URL, { next: { revalidate: 60 * 30 } }),
    ]);

    if (!response.ok) {
      throw new Error(`OpenAQ responded with ${response.status}`);
    }

    const payload = (await response.json()) as OpenAQResponse;
    const records = payload.results ?? [];

    const aggregates = new Map<
      string,
      {
        total: number;
        count: number;
        name: string;
        region: string;
        updatedAt: string;
        latitude: number;
        longitude: number;
        unit: string;
      }
    >();

    const cityAggregates = new Map<
      string,
      {
        city: string;
        country: string;
        iso3: string;
        total: number;
        count: number;
        updatedAt: string;
        unit: string;
      }
    >();

    records.forEach((record) => {
      if (!record.measurements?.length) return;

      const pm25 =
        record.measurements.find(
          (measurement) => measurement.parameter.toLowerCase() === "pm25",
        ) ?? record.measurements[0];

      if (!pm25) return;

      const iso3 = resolveIso3(countryDirectory, record.country);
      if (!iso3) return;

      const entry = aggregates.get(iso3);
      const value = pm25.value;

      if (Number.isNaN(value)) return;

      const latitude =
        record.coordinates?.latitude ?? countryDirectory[iso3]?.lat ?? 0;
      const longitude =
        record.coordinates?.longitude ?? countryDirectory[iso3]?.lng ?? 0;

      if (entry) {
        entry.total += value;
        entry.count += 1;
        entry.updatedAt =
          pm25.lastUpdated > entry.updatedAt ? pm25.lastUpdated : entry.updatedAt;
        entry.latitude = (entry.latitude + latitude) / 2;
        entry.longitude = (entry.longitude + longitude) / 2;
      } else {
        aggregates.set(iso3, {
          total: value,
          count: 1,
          name: countryDirectory[iso3]?.name ?? iso3,
          region: countryDirectory[iso3]?.region ?? "Unknown region",
          updatedAt: pm25.lastUpdated,
          latitude,
          longitude,
          unit: pm25.unit,
        });
      }

      const cityName = record.city?.trim() || record.name?.trim();
      if (!cityName) return;
      const cityKey = `${iso3}-${cityName.toLowerCase()}`;
      const countryName = countryDirectory[iso3]?.name ?? iso3;
      const cityEntry = cityAggregates.get(cityKey);

      if (cityEntry) {
        cityEntry.total += value;
        cityEntry.count += 1;
        cityEntry.updatedAt =
          pm25.lastUpdated > cityEntry.updatedAt
            ? pm25.lastUpdated
            : cityEntry.updatedAt;
      } else {
        cityAggregates.set(cityKey, {
          city: cityName,
          country: countryName,
          iso3,
          total: value,
          count: 1,
          updatedAt: pm25.lastUpdated,
          unit: pm25.unit,
        });
      }
    });

    const stats: AirQualityStat[] = Array.from(aggregates.entries()).map(
      ([iso3, entry]) => ({
        iso3,
        name: entry.name,
        average: Number((entry.total / entry.count).toFixed(2)),
        sampleCount: entry.count,
        updatedAt: entry.updatedAt,
        latitude: Number(entry.latitude.toFixed(2)),
        longitude: Number(entry.longitude.toFixed(2)),
        unit: entry.unit,
        region: entry.region,
      }),
    );

    const cityStats: AirCityStat[] = Array.from(cityAggregates.values()).map(
      (entry) => ({
        city: entry.city,
        country: entry.country,
        iso3: entry.iso3,
        average: Number((entry.total / entry.count).toFixed(2)),
        sampleCount: entry.count,
        updatedAt: entry.updatedAt,
        unit: entry.unit,
      }),
    );

    return summarizeAir(
      stats,
      "OpenAQ latest PM2.5 readings (µg/m³)",
      cityStats,
    );
  } catch {
    return summarizeAir(
      FALLBACK_AIR_STATS,
      "Static OpenAQ sample (offline mode: µg/m³)",
      FALLBACK_AIR_CITY_STATS,
    );
  }
}
