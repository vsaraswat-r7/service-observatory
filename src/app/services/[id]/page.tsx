"use client";

import {
  Server,
  Database,
  Mail,
  HardDrive,
  GitBranch,
  Clock,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/StatusBadge";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { services, teams, graphEdges } = useStore();

  const svc = services.find((s) => s.id === id);
  if (!svc) return <div className="p-8 text-red-400">Service not found: {id}</div>;

  const team = teams.find((t) => t.id === svc.team);
  const upstreamEdges = graphEdges.filter((e) => e.to === svc.id && e.type === "CALLS_SERVICE");
  const downstreamEdges = graphEdges.filter((e) => e.from === svc.id && e.type === "CALLS_SERVICE");
  const callers = upstreamEdges.map((e) => services.find((s) => s.id === e.from)).filter(Boolean);
  const callees = downstreamEdges.map((e) => services.find((s) => s.id === e.to)).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/services" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]">
            ← Back to Services
          </Link>
          <h1 className="text-2xl font-bold mt-2 flex items-center gap-3">
            {svc.name}
            <StatusBadge status={svc.status} />
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xl">{svc.description}</p>
        </div>
        <a
          href={`https://github.com/${svc.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline"
        >
          {svc.repo} <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Requests/min", value: svc.requestsPerMin.toLocaleString() },
          { label: "p50 Latency", value: `${svc.avgLatencyMs}ms` },
          { label: "Error Rate", value: `${(svc.errorRate * 100).toFixed(2)}%` },
          { label: "Pods", value: svc.podCount },
          { label: "Coverage", value: `${svc.coveragePercent}%` },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 text-center">
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Metadata */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-[var(--accent)]" /> Service Info
          </h3>
          <dl className="space-y-3 text-sm">
            {[
              ["Language", svc.language],
              ["Framework", svc.framework],
              ["Port", svc.port],
              ["Account", svc.account],
              ["Last Deploy", new Date(svc.lastDeploy).toLocaleString()],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between">
                <dt className="text-[var(--text-muted)]">{k}</dt>
                <dd className="font-mono text-xs">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Team */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--accent)]" /> Team
          </h3>
          {team && (
            <dl className="space-y-3 text-sm">
              {[
                ["Team", team.name],
                ["Lead", team.lead],
                ["Members", team.members],
                ["Slack", team.slackChannel],
                ["On-call", team.oncallSchedule],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-[var(--text-muted)]">{k}</dt>
                  <dd className="font-mono text-xs">{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Entry Points */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--accent)]" /> Entry Points
          </h3>
          <ul className="space-y-2">
            {svc.entryPoints.map((ep) => (
              <li key={ep} className="text-sm font-mono bg-[var(--bg)] rounded px-3 py-2 text-[var(--accent)]">
                {ep}
              </li>
            ))}
          </ul>
        </div>

        {/* Infrastructure */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[var(--accent)]" /> Infrastructure
          </h3>
          {svc.databases.length > 0 && (
            <div>
              <div className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                <Database className="w-3 h-3" /> Databases
              </div>
              {svc.databases.map((db) => (
                <div key={db} className="text-sm font-mono bg-[var(--bg)] rounded px-3 py-1.5 mb-1">{db}</div>
              ))}
            </div>
          )}
          {svc.queues.length > 0 && (
            <div>
              <div className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> SQS Queues
              </div>
              {svc.queues.map((q) => (
                <div key={q} className="text-sm font-mono bg-[var(--bg)] rounded px-3 py-1.5 mb-1">{q}</div>
              ))}
            </div>
          )}
          {svc.s3Buckets.length > 0 && (
            <div>
              <div className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> S3 Buckets
              </div>
              {svc.s3Buckets.map((b) => (
                <div key={b} className="text-sm font-mono bg-[var(--bg)] rounded px-3 py-1.5 mb-1">{b}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dependency Graph */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-cyan-400">↓ Called by ({callers.length})</h3>
          {callers.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No upstream callers</p>
          ) : (
            callers.map((c) => c && (
              <Link
                key={c.id}
                href={`/services/${c.id}`}
                className="block text-sm bg-[var(--bg)] rounded px-3 py-2 mb-2 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-[var(--text-muted)] ml-2 text-xs">CALLS_SERVICE →</span>
              </Link>
            ))
          )}
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-green-400">↑ Depends on ({callees.length})</h3>
          {callees.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No downstream dependencies</p>
          ) : (
            callees.map((c) => c && (
              <Link
                key={c.id}
                href={`/services/${c.id}`}
                className="block text-sm bg-[var(--bg)] rounded px-3 py-2 mb-2 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-[var(--text-muted)] ml-2 text-xs">→ CALLS_SERVICE</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* How to query this service */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--accent)]" /> Ask Your AI Agent About This Service
        </h3>
        <div className="space-y-2 text-sm">
          {[
            `graph query="MATCH (s:Microservice {id:'${svc.id}'})-[r]->(n) RETURN type(r), labels(n)[0], n.id LIMIT 50"`,
            `codesearch mode=search repo=${svc.id} q="placeOrder"`,
            `aws account=production service=sqs mode=depth name=${svc.queues[0] || "your-queue-name"}`,
            `memory mode=recall entity=${svc.id}`,
          ].map((cmd) => (
            <div
              key={cmd}
              className="font-mono text-xs bg-[var(--bg)] rounded px-4 py-2.5 text-[var(--accent)] overflow-x-auto"
            >
              {cmd}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
