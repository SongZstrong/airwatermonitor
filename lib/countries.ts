export type CountryMeta = {
  name: string;
  cca2: string;
  cca3: string;
  lat: number;
  lng: number;
  region: string;
  capital?: string;
};

export type CountryDirectory = Record<string, CountryMeta>;

let cachedDirectory: CountryDirectory | null = null;

const FALLBACK_COUNTRIES: CountryDirectory = {
  USA: {
    name: "United States",
    cca2: "US",
    cca3: "USA",
    lat: 38.0,
    lng: -97.0,
    region: "Americas",
    capital: "Washington D.C.",
  },
  CHN: {
    name: "China",
    cca2: "CN",
    cca3: "CHN",
    lat: 35.0,
    lng: 103.0,
    region: "Asia",
    capital: "Beijing",
  },
  IND: {
    name: "India",
    cca2: "IN",
    cca3: "IND",
    lat: 21.0,
    lng: 78.0,
    region: "Asia",
    capital: "New Delhi",
  },
  AUS: {
    name: "Australia",
    cca2: "AU",
    cca3: "AUS",
    lat: -27.0,
    lng: 133.0,
    region: "Oceania",
    capital: "Canberra",
  },
  BRA: {
    name: "Brazil",
    cca2: "BR",
    cca3: "BRA",
    lat: -10.0,
    lng: -55.0,
    region: "Americas",
    capital: "Brasília",
  },
  CAN: {
    name: "Canada",
    cca2: "CA",
    cca3: "CAN",
    lat: 60.0,
    lng: -95.0,
    region: "Americas",
    capital: "Ottawa",
  },
  ZAF: {
    name: "South Africa",
    cca2: "ZA",
    cca3: "ZAF",
    lat: -29.0,
    lng: 24.0,
    region: "Africa",
    capital: "Pretoria",
  },
  FRA: {
    name: "France",
    cca2: "FR",
    cca3: "FRA",
    lat: 46.0,
    lng: 2.0,
    region: "Europe",
    capital: "Paris",
  },
  DEU: {
    name: "Germany",
    cca2: "DE",
    cca3: "DEU",
    lat: 51.0,
    lng: 9.0,
    region: "Europe",
    capital: "Berlin",
  },
  GBR: {
    name: "United Kingdom",
    cca2: "GB",
    cca3: "GBR",
    lat: 54.0,
    lng: -2.0,
    region: "Europe",
    capital: "London",
  },
};

export async function getCountryDirectory(): Promise<CountryDirectory> {
  if (cachedDirectory) {
    return cachedDirectory;
  }

  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,latlng,region,capital",
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!response.ok) {
      throw new Error("Unable to download country reference data");
    }

    const payload = (await response.json()) as Array<{
      name: { common: string };
      cca2: string;
      cca3: string;
      latlng?: [number, number];
      region?: string;
      capital?: string[];
    }>;

    const directory: CountryDirectory = {};

    payload.forEach((country) => {
      if (!country.cca3) return;

      const lat = country.latlng?.[0] ?? 0;
      const lng = country.latlng?.[1] ?? 0;

      directory[country.cca3.toUpperCase()] = {
        name: country.name?.common ?? country.cca3,
        cca2: country.cca2,
        cca3: country.cca3,
        lat,
        lng,
        region: country.region ?? "Unknown",
        capital: country.capital?.[0],
      };
    });

    cachedDirectory = directory;
    return directory;
  } catch (error) {
    console.error("Country lookups failed", error);
    cachedDirectory = FALLBACK_COUNTRIES;
    return cachedDirectory;
  }
}

export function resolveIso3(
  countryDirectory: CountryDirectory,
  isoCode: string | undefined | null,
): string | null {
  if (!isoCode) return null;
  const normalized = isoCode.trim().toUpperCase();

  const iso3 =
    normalized.length === 2
      ? Object.values(countryDirectory).find(
          (entry) => entry.cca2 === normalized,
        )?.cca3
      : normalized;

  return iso3 ?? null;
}
