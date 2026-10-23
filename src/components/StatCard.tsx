import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; label: string };
};

export default function StatCard({ label, value, subtitle, icon, trend }: Props) {
  const trendColor =
    trend?.direction === "up" ? "text-green-400" :
    trend?.direction === "down" ? "text-red-400" :
    "text-[var(--text-muted)]";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        <span className="text-[var(--text-muted)]">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-[var(--text)]">{value}</div>
      {subtitle && <div className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</div>}
      {trend && <div className={`text-xs mt-2 ${trendColor}`}>{trend.label}</div>}
    </div>
  );
}
