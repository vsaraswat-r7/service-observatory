"use client";

import { useStore } from "@/lib/store";

// Simple force-layout positions for the graph visualization
// In production, use d3-force or react-flow
const positions: Record<string, { x: number; y: number }> = {
  "api-gateway":          { x: 400, y: 50 },
  "user-service":         { x: 150, y: 180 },
  "order-service":        { x: 400, y: 180 },
  "search-service":       { x: 650, y: 180 },
  "analytics-service":    { x: 650, y: 50 },
  "payment-gateway":      { x: 250, y: 330 },
  "inventory-service":    { x: 550, y: 330 },
  "notification-service": { x: 400, y: 440 },
};

const statusColors: Record<string, string> = {
  healthy: "#22c55e",
  degraded: "#eab308",
  down: "#ef4444",
  unknown: "#6b7280",
};

export default function GraphView() {
  const { services, graphEdges, teams } = useStore();
  const serviceEdges = graphEdges.filter((e) => e.type === "CALLS_SERVICE");

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 overflow-auto">
      <svg viewBox="0 0 800 520" className="w-full h-auto min-h-[400px]">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" opacity="0.5" />
          </marker>
        </defs>

        {/* Edges */}
        {serviceEdges.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--border)"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* Nodes */}
        {services.map((svc) => {
          const pos = positions[svc.id];
          if (!pos) return null;
          const team = teams.find((t) => t.id === svc.team);
          return (
            <g key={svc.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="28"
                fill="var(--bg-card)"
                stroke={statusColors[svc.status]}
                strokeWidth="2"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={statusColors[svc.status]}
                opacity="0.8"
              />
              <text
                x={pos.x}
                y={pos.y + 42}
                textAnchor="middle"
                fill="var(--text)"
                fontSize="11"
                fontWeight="600"
              >
                {svc.name}
              </text>
              <text
                x={pos.x}
                y={pos.y + 55}
                textAnchor="middle"
                fill={team?.color ?? "var(--text-muted)"}
                fontSize="9"
              >
                {team?.name ?? ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
