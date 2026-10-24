import type { ServiceStatus } from "@/lib/types";

const config: Record<ServiceStatus, { bg: string; text: string; dot: string; label: string }> = {
  healthy: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400", label: "Healthy" },
  degraded: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400", label: "Degraded" },
  down: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Down" },
  unknown: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400", label: "Unknown" },
};

export default function StatusBadge({ status }: { status: ServiceStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}
