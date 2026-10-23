import { incidents, services } from "@/data/placeholder";
import { CheckCircle, Search, Eye } from "lucide-react";

const severityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  resolved: <CheckCircle className="w-4 h-4 text-green-400" />,
  investigating: <Search className="w-4 h-4 text-yellow-400" />,
  monitoring: <Eye className="w-4 h-4 text-blue-400" />,
};

export default function IncidentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Incidents</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {incidents.length} incidents tracked. Replace with your PagerDuty/OpsGenie integration data.
        </p>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => {
          const svc = services.find((s) => s.id === inc.service);
          return (
            <div
              key={inc.id}
              className={`bg-[var(--bg-card)] border rounded-xl overflow-hidden ${
                inc.status === "resolved" ? "border-[var(--border)]" : "border-yellow-500/30"
              }`}
            >
              <div className="px-5 py-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{statusIcons[inc.status]}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[var(--text-muted)]">{inc.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${severityColors[inc.severity] || ""}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm">{inc.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{inc.impactSummary}</p>
                  </div>
                </div>
                {svc && (
                  <span className="text-xs bg-[var(--bg)] px-2.5 py-1 rounded-full whitespace-nowrap">
                    {svc.name}
                  </span>
                )}
              </div>

              <div className="px-5 py-3 border-t border-[var(--border)]/50 flex items-center gap-6 text-xs text-[var(--text-muted)]">
                <span>Started: {new Date(inc.startedAt).toLocaleString()}</span>
                {inc.resolvedAt && (
                  <span>Resolved: {new Date(inc.resolvedAt).toLocaleString()}</span>
                )}
                {inc.resolvedAt && (
                  <span className="text-green-400">
                    Duration:{" "}
                    {Math.round(
                      (new Date(inc.resolvedAt).getTime() - new Date(inc.startedAt).getTime()) / 60000
                    )}{" "}
                    min
                  </span>
                )}
              </div>

              {inc.rootCause && (
                <div className="px-5 py-3 border-t border-[var(--border)]/50 bg-[var(--bg)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Root Cause</span>
                  <p className="text-xs mt-1">{inc.rootCause}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
