'use client';

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export type MapDatum = {
  iso3: string;
  value: number;
  name: string;
  region?: string;
};

type FormatOptions = {
  decimals?: number;
  suffix?: string;
};

type WorldMapProps = {
  data: MapDatum[];
  legendLabel: string;
  formatOptions?: FormatOptions;
  higherIsWorse?: boolean;
  detailMetrics?: Array<{
    label: string;
    data: MapDatum[];
    formatOptions?: FormatOptions;
  }>;
};

type HoverPreview = {
  name: string;
  iso3: string | null;
  value?: number;
  hasData: boolean;
  x: number;
  y: number;
};

const GEO_URL = "/world-110m.json";

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  "united states of america": "united states",
  "russian federation": "russia",
  "cote divoire": "ivory coast",
  "czechia": "czech republic",
  "korea republic of": "south korea",
  "korea democratic peoples republic of": "north korea",
  "bolivia plurinational state of": "bolivia",
  "venezuela bolivarian republic of": "venezuela",
  "tanzania united republic of": "tanzania",
  "iran islamic republic of": "iran",
  "syrian arab republic": "syria",
  "lao peoples democratic republic": "laos",
  "viet nam": "vietnam",
};

function normalizeCountryName(input: string): string {
  const normalized = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return COUNTRY_NAME_ALIASES[normalized] ?? normalized;
}

function resolveIso3FromGeoProperties(
  properties: Record<string, unknown>,
): string | null {
  const candidates = [
    properties.ISO_A3,
    properties.ADM0_A3,
    properties.WB_A3,
    properties.SU_A3,
    properties.BRK_A3,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim().length === 3) {
      return value.trim().toUpperCase();
    }
  }

  return null;
}

function percentile(values: number[], ratio: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor((sorted.length - 1) * ratio)),
  );
  return sorted[index];
}

function interpolateColor(severity: number): string {
  const ratio = Math.min(Math.max(severity, 0), 1);
  const start = [254, 242, 242];
  const end = [153, 27, 27];

  const rgb = start.map((component, index) => {
    const diff = end[index] - component;
    return Math.round(component + diff * ratio);
  });

  return `rgb(${rgb.join(",")})`;
}

type DetailLookup = {
  label: string;
  ref: Map<string, MapDatum>;
  formatValue: (value: number) => string;
};

export function WorldMap({
  data,
  legendLabel,
  formatOptions,
  higherIsWorse = true,
  detailMetrics,
}: WorldMapProps) {
  const decimals = formatOptions?.decimals ?? 1;
  const suffix = formatOptions?.suffix ?? "";
  const formatValue = (value: number) => `${value.toFixed(decimals)}${suffix}`;
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);
  const [hoverPreview, setHoverPreview] = useState<HoverPreview | null>(null);
  const [showMissingList, setShowMissingList] = useState(false);

  const prepareData = (dataset: MapDatum[]) =>
    dataset.filter((item) => item.iso3 && Number.isFinite(item.value));

  const prepared = useMemo(() => {
    const filtered = prepareData(data);

    const values = filtered.map((item) => item.value);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 1;
    const lowerBound = values.length ? percentile(values, 0.1) : min;
    const upperBound = values.length ? percentile(values, 0.9) : max;
    const ref = new Map(filtered.map((item) => [item.iso3, item]));
    const nameRef = new Map(
      filtered.map((item) => [normalizeCountryName(item.name), item]),
    );

    return {
      ref,
      nameRef,
      min,
      max,
      lowerBound,
      upperBound,
      dataCount: filtered.length,
    };
  }, [data]);

  const detailSources = useMemo(
    () => [
      { label: legendLabel, data, formatOptions },
      ...(detailMetrics ?? []),
    ],
    [data, detailMetrics, legendLabel, formatOptions],
  );

  const detailLookups = useMemo<DetailLookup[]>(
    () =>
      detailSources.map((metric) => {
        const decimals = metric.formatOptions?.decimals ?? 1;
        const suffix = metric.formatOptions?.suffix ?? "";
        const ref = new Map(
          prepareData(metric.data).map((item) => [item.iso3, item]),
        );

        return {
          label: metric.label,
          ref,
          formatValue: (value: number) => `${value.toFixed(decimals)}${suffix}`,
        };
      }),
    [detailSources],
  );

  const selection = useMemo(() => {
    if (!selectedIso3) return null;

    const baseDatum = prepared.ref.get(selectedIso3);
    const fallbackDatum = detailLookups
      .map((lookup) => lookup.ref.get(selectedIso3))
      .find((datum) => datum);

    const name = baseDatum?.name ?? fallbackDatum?.name ?? selectedIso3;
    const region = baseDatum?.region ?? fallbackDatum?.region ?? "Unknown region";

    const metrics = detailLookups.map((lookup) => {
      const datum = lookup.ref.get(selectedIso3);
      return {
        label: lookup.label,
        value: datum ? lookup.formatValue(datum.value) : "No live data",
      };
    });

    return { code: selectedIso3, name, region, metrics };
  }, [detailLookups, prepared.ref, selectedIso3]);

  const coverageRate = Math.round((prepared.dataCount / 177) * 100);
  const missingCountries = useMemo(
    () =>
      data
        .filter((item) => !item.iso3 || !Number.isFinite(item.value))
        .map((item) => item.name)
        .slice(0, 20),
    [data],
  );

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Live data coverage: {prepared.dataCount} countries (~{coverageRate}%)</span>
        <div className="flex items-center gap-3">
          <span>Hover to preview, click to pin details.</span>
          <button
            type="button"
            onClick={() => setShowMissingList((prev) => !prev)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {showMissingList ? "Hide" : "Show"} missing list
          </button>
        </div>
      </div>
      <ComposableMap projectionConfig={{ scale: 150 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props = geo.properties as {
                ISO_A3?: string;
                NAME?: string;
                name?: string;
                ADMIN?: string;
              };
              const countryName =
                props.NAME ?? props.name ?? props.ADMIN ?? "Unknown country";
              const iso3 = resolveIso3FromGeoProperties(props);
              const datum =
                (iso3 ? prepared.ref.get(iso3) : undefined) ??
                prepared.nameRef.get(normalizeCountryName(countryName));
              const value = datum?.value;
              const severity =
                value !== undefined
                  ? (() => {
                      const range = prepared.upperBound - prepared.lowerBound;
                      if (range <= 0) return 0.5;
                      const normalized =
                        (value - prepared.lowerBound) / range;
                      return higherIsWorse
                        ? Math.min(Math.max(normalized, 0), 1)
                        : Math.min(Math.max(1 - normalized, 0), 1);
                    })()
                  : null;
              const fill = severity !== null ? interpolateColor(severity) : "#e2e8f0";
              const selectedKey = datum?.iso3 ?? iso3 ?? null;
              const isSelected = Boolean(selectedIso3 && selectedKey === selectedIso3);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={isSelected ? "#0f172a" : "#ffffff"}
                  strokeWidth={isSelected ? 1.2 : 0.6}
                  style={{
                    default: { outline: "none", cursor: "pointer" },
                    hover: { outline: "none", fill: "#2563eb", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  onMouseMove={(event) => {
                    setHoverPreview({
                      name: datum?.name ?? countryName,
                      iso3: selectedKey,
                      value,
                      hasData: value !== undefined,
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => selectedKey && setSelectedIso3(selectedKey)}
                  tabIndex={-1}
                  aria-label={
                    datum
                      ? `${datum.name} ${legendLabel} ${formatValue(value!)}`
                      : countryName
                  }
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">{legendLabel} (darker = worse)</span>
        <div className="flex items-center gap-2">
          <span className="text-xs">{formatValue(prepared.min)}</span>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-rose-100 to-red-800" />
          <span className="text-xs">{formatValue(prepared.max)}</span>
        </div>
      </div>
      {hoverPreview ? (
        <div
          className="pointer-events-none fixed z-30 rounded-xl border border-sky-100 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow"
          style={{ left: hoverPreview.x + 12, top: hoverPreview.y + 12 }}
        >
          <p className="font-semibold text-slate-900">{hoverPreview.name}</p>
          <p>
            {hoverPreview.hasData
              ? `${legendLabel}: ${formatValue(hoverPreview.value!)}`
              : "No live data for this country"}
            {hoverPreview.iso3 ? ` · ISO: ${hoverPreview.iso3}` : ""}
          </p>
        </div>
      ) : null}
      {showMissingList ? (
        <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Countries currently missing usable metric values</p>
          {missingCountries.length ? (
            <p className="mt-1 text-xs leading-5 text-slate-600">{missingCountries.join(", ")}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-600">No missing countries detected in the current dataset.</p>
          )}
        </div>
      ) : null}
      {selection ? (
        <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Selected region
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">
            {selection.name}
          </h3>
          <p className="text-sm text-slate-600">
            Region: {selection.region} · ISO code: {selection.code}
          </p>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            {selection.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-sm font-medium text-slate-600">
                  {metric.label}
                </dt>
                <dd className="text-xl font-semibold text-slate-900">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          Click any country to reveal air quality and water access readings side by side.
        </div>
      )}
    </div>
  );
}
