'use client';

type RankingPanelProps = {
  title: string;
  items: { name: string; value: string; detail?: string }[];
  accent?: "good" | "bad";
};

const accentClasses: Record<
  NonNullable<RankingPanelProps["accent"]>,
  string
> = {
  good: "from-emerald-500 to-lime-400",
  bad: "from-rose-500 to-orange-400",
};

export function RankingPanel({ title, items, accent = "good" }: RankingPanelProps) {
  return (
    <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div
          className={`h-2 w-24 rounded-full bg-gradient-to-r ${accentClasses[accent]}`}
          aria-hidden
        />
      </div>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.name + index}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="font-medium text-slate-800">
              {index + 1}. {item.name}
            </span>
            <div className="text-right text-slate-600">
              <div className="font-semibold text-slate-900">{item.value}</div>
              {item.detail && (
                <p className="text-xs text-slate-500">{item.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
