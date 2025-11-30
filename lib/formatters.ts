export function formatNumber(value: number, fractionDigits = 1): string {
  if (Number.isNaN(value)) return "N/A";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPercent(value: number, fractionDigits = 1): string {
  if (Number.isNaN(value)) return "N/A";
  return `${formatNumber(value, fractionDigits)}%`;
}

export function formatDateToReadable(iso: string | undefined): string {
  if (!iso) return "Unknown";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
