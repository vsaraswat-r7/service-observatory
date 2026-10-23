import GraphView from "@/components/GraphView";
import { services, graphEdges, teams } from "@/data/placeholder";

export default function GraphPage() {
  const serviceEdges = graphEdges.filter((e) => e.type === "CALLS_SERVICE");
  const queueEdges = graphEdges.filter((e) => e.type.includes("SQS"));
  const dbEdges = graphEdges.filter((e) => e.type.includes("DB"));
  const s3Edges = graphEdges.filter((e) => e.type.includes("S3"));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Service Graph</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Visual map of service-to-service calls. Built from Neo4j knowledge graph data.
        </p>
      </div>

      <GraphView />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Services", value: services.length, color: "text-[var(--accent)]" },
          { label: "Service Calls", value: serviceEdges.length, color: "text-purple-400" },
          { label: "Queue Links", value: queueEdges.length, color: "text-orange-400" },
          { label: "DB Links", value: dbEdges.length, color: "text-cyan-400" },
          { label: "S3 Links", value: s3Edges.length, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* All Edges Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="font-semibold">All Graph Edges ({graphEdges.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">Relationship</th>
                <th className="px-5 py-3">To</th>
              </tr>
            </thead>
            <tbody>
              {graphEdges.map((e, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-card-hover)]">
                  <td className="px-5 py-2.5 font-mono text-xs">{e.from}</td>
                  <td className="px-5 py-2.5">
                    <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded text-xs font-medium">
                      {e.type}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 font-mono text-xs">{e.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
