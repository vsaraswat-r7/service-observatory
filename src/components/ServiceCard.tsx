"use client";

import Link from "next/link";
import type { Service } from "@/lib/types";
import { useStore } from "@/lib/store";
import StatusBadge from "./StatusBadge";

const langColors: Record<string, string> = {
  java: "bg-orange-500",
  kotlin: "bg-purple-500",
  python: "bg-blue-500",
  typescript: "bg-blue-400",
  go: "bg-cyan-500",
};

export default function ServiceCard({ service }: { service: Service }) {
  const { teams } = useStore();
  const team = teams.find((t) => t.id === service.team);

  return (
    <Link
      href={`/services/${service.id}`}
      className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${langColors[service.language] ?? "bg-gray-500"}`} />
          <h3 className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors">
            {service.name}
          </h3>
        </div>
        <StatusBadge status={service.status} />
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2">{service.description}</p>

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <div>
          <div className="text-base font-bold">{service.requestsPerMin}</div>
          <div className="text-[10px] text-[var(--text-muted)]">req/min</div>
        </div>
        <div>
          <div className="text-base font-bold">{service.avgLatencyMs}ms</div>
          <div className="text-[10px] text-[var(--text-muted)]">p50 latency</div>
        </div>
        <div>
          <div className={`text-base font-bold ${service.errorRate > 0.01 ? "text-red-400" : ""}`}>
            {(service.errorRate * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">error rate</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>{service.framework}</span>
        {team && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: team.color }} />
            {team.name}
          </span>
        )}
      </div>
    </Link>
  );
}
