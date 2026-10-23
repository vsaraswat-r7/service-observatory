import {
  Server,
  Activity,
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle,
} from "lucide-react";
import { services, incidents, teams, graphEdges } from "@/data/placeholder";
import StatCard from "@/components/StatCard";
import ServiceCard from "@/components/ServiceCard";
import GraphView from "@/components/GraphView";

export default function Dashboard() {
  const healthyCount = services.filter((s) => s.status === "healthy").length;
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const totalRequests = services.reduce((sum, s) => sum + s.requestsPerMin, 0);
  const avgLatency = Math.round(
    services.reduce((sum, s) => sum + s.avgLatencyMs, 0) / services.length
  );
  const openIncidents = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Replace with your company&apos;s services →{" "}
          <code className="text-xs bg-[var(--bg-card)] px-1.5 py-0.5 rounded">
            src/data/placeholder.ts
          </code>
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
