"use client";

import { useStore } from "@/lib/store";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export default function TeamsPage() {
  const { teams, services } = useStore();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {teams.length} teams owning {services.length} services.
        </p>
      </div>

      {teams.map((team) => {
        const teamServices = services.filter((s) => s.team === team.id);
        return (
          <div
            key={team.id}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ background: team.color }} />
                <div>
                  <h2 className="font-semibold">{team.name}</h2>
                  <span className="text-xs text-[var(--text-muted)]">
                    Lead: {team.lead} · {team.members} members
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>Slack: {team.slackChannel}</span>
                <span>On-call: {team.oncallSchedule}</span>
              </div>
            </div>

            <div className="divide-y divide-[var(--border)]/50">
              {teamServices.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/services/${svc.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={svc.status} />
                    <span className="text-sm font-medium">{svc.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">{svc.framework}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
                    <span>{svc.requestsPerMin} req/min</span>
                    <span>{svc.avgLatencyMs}ms</span>
                    <span>{svc.podCount} pods</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
