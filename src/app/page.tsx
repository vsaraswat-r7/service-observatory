"use client";

import Link from "next/link";
import {
  Server,
  Activity,
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle,
  Rocket,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import StatCard from "@/components/StatCard";
import ServiceCard from "@/components/ServiceCard";
import GraphView from "@/components/GraphView";

export default function Dashboard() {
  const { services, incidents, teams, graphEdges, organization, onboardingDone, completeOnboarding } = useStore();

  const healthyCount = services.filter((s) => s.status === "healthy").length;
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const totalRequests = services.reduce((sum, s) => sum + s.requestsPerMin, 0);
  const avgLatency =
    services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + s.avgLatencyMs, 0) / services.length)
      : 0;
  const openIncidents = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Onboarding Banner */}
      {!onboardingDone && (
        <div className="flex items-center justify-between bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Rocket className="w-5 h-5 text-[var(--accent)]" />
            <div>
              <p className="text-sm font-medium">Complete onboarding to set up your organization</p>
              <Link
                href="/onboarding"
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
              >
                Start setup →
              </Link>
            </div>
          </div>
          <button
            onClick={completeOnboarding}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {organization.name} service overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Services"
          value={services.length}
          subtitle={`${healthyCount} healthy · ${degradedCount} degraded`}
          icon={<Server className="w-4 h-4" />}
        />
        <StatCard
          label="Requests/min"
          value={totalRequests.toLocaleString()}
          subtitle="Across all services"
          icon={<Zap className="w-4 h-4" />}
          trend={{ direction: "up", label: "+12% from last week" }}
        />
        <StatCard
          label="Avg Latency"
          value={`${avgLatency}ms`}
          subtitle="p50 across all services"
          icon={<Clock className="w-4 h-4" />}
          trend={{ direction: "flat", label: "Stable" }}
        />
        <StatCard
          label="Open Incidents"
          value={openIncidents}
          subtitle={`${incidents.length} total this month`}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>

      {/* Service Graph */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--accent)]" />
            Service Map
          </h2>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Healthy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" /> Degraded
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Down
            </span>
          </div>
        </div>
        <GraphView />
        <div className="mt-3 text-xs text-[var(--text-muted)] flex items-center gap-4">
          <span>{services.length} services</span>
          <span>{graphEdges.filter((e) => e.type === "CALLS_SERVICE").length} connections</span>
          <span>{teams.length} teams</span>
        </div>
      </div>

      {/* Top Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
            All Services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      </div>
    </div>
  );
}
