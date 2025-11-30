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
  detailMetrics?: Array<{
    label: string;
    data: MapDatum[];
    formatOptions?: FormatOptions;
  }>;
};

const GEO_URL = "/world-110m.json";

function interpolateColor(value: number, min: number, max: number): string {
  if (max === min) {
    return "#4f46e5";
  }

  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const start = [224, 242, 255];
  const end = [16, 121, 145];

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

export function WorldMap({ data, legendLabel, formatOptions, detailMetrics }: WorldMapProps) {
  const decimals = formatOptions?.decimals ?? 1;
  const suffix = formatOptions?.suffix ?? "";
  const formatValue = (value: number) => `${value.toFixed(decimals)}${suffix}`;
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);

  const prepareData = (dataset: MapDatum[]) =>
    dataset.filter((item) => item.iso3 && Number.isFinite(item.value));

  const prepared = useMemo(() => {
    const filtered = prepareData(data);

    const values = filtered.map((item) => item.value);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 1;
    const ref = new Map(filtered.map((item) => [item.iso3, item]));

    return { ref, min, max };
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <ComposableMap projectionConfig={{ scale: 150 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props = geo.properties as {
                ISO_A3?: string;
                NAME?: string;
              };
              const iso3 = props.ISO_A3 ?? "";
              const datum = prepared.ref.get(iso3);
              const value = datum?.value;
              const fill =
                value !== undefined
                  ? interpolateColor(value, prepared.min, prepared.max)
                  : "#f1f5f9";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#ffffff"
                  style={{
                    default: { outline: "none", cursor: "pointer" },
                    hover: { outline: "none", fill: "#2563eb", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => setSelectedIso3(iso3)}
                  tabIndex={-1}
                  aria-label={
                    datum
                      ? `${datum.name} ${legendLabel} ${formatValue(value!)}`
                      : props.NAME
                  }
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">{legendLabel}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs">{formatValue(prepared.min)}</span>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-sky-100 to-cyan-600" />
          <span className="text-xs">{formatValue(prepared.max)}</span>
        </div>
      </div>
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
