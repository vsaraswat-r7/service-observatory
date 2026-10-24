"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Incident } from "@/lib/types";
import Modal from "@/components/Modal";

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

const SEVERITIES: Incident["severity"][] = ["critical", "high", "medium", "low"];
const STATUSES: Incident["status"][] = ["investigating", "monitoring", "resolved"];

function IncidentForm({
  initial,
  servicesList,
  onSubmit,
  onCancel,
}: {
  initial?: Incident;
  servicesList: { id: string; name: string }[];
  onSubmit: (data: Omit<Incident, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [severity, setSeverity] = useState<Incident["severity"]>(initial?.severity ?? "medium");
  const [service, setService] = useState(initial?.service ?? (servicesList[0]?.id ?? ""));
  const [impactSummary, setImpactSummary] = useState(initial?.impactSummary ?? "");
  const [rootCause, setRootCause] = useState(initial?.rootCause ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      ...(initial ? { id: initial.id } : {}),
      title: title.trim(),
      severity,
      service,
      impactSummary,
      rootCause: rootCause || undefined,
      status: initial?.status ?? "investigating",
      startedAt: initial?.startedAt ?? new Date().toISOString(),
      resolvedAt: initial?.resolvedAt,
    });
  };

  const inputCls =
    "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs text-[var(--text-muted)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Title *</label>
        <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Severity</label>
          <select
            className={inputCls}
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Incident["severity"])}
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Service</label>
          <select className={inputCls} value={service} onChange={(e) => setService(e.target.value)}>
            {servicesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Impact Summary</label>
        <textarea className={inputCls} rows={3} value={impactSummary} onChange={(e) => setImpactSummary(e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Root Cause (optional)</label>
        <textarea className={inputCls} rows={2} value={rootCause} onChange={(e) => setRootCause(e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          {initial ? "Save Changes" : "Report Incident"}
        </button>
      </div>
    </form>
  );
}

export default function IncidentsPage() {
  const { incidents, services, addIncident, updateIncident, deleteIncident } = useStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

  const generateId = () => {
    const year = new Date().getFullYear();
    const num = String(incidents.length + 1).padStart(3, "0");
    return `INC-${year}-${num}`;
  };

  const handleAdd = (data: Omit<Incident, "id"> & { id?: string }) => {
    addIncident({ ...data, id: generateId() } as Incident);
    setShowReportModal(false);
  };

  const handleEdit = (data: Omit<Incident, "id"> & { id?: string }) => {
    if (!editingIncident) return;
    updateIncident(editingIncident.id, data);
    setEditingIncident(null);
  };

  const handleStatusChange = (inc: Incident, newStatus: Incident["status"]) => {
    const updates: Partial<Incident> = { status: newStatus };
    if (newStatus === "resolved" && !inc.resolvedAt) {
      updates.resolvedAt = new Date().toISOString();
    }
    updateIncident(inc.id, updates);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Incidents</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {incidents.length} incidents tracked. Replace with your PagerDuty/OpsGenie integration data.
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--red)] text-white hover:opacity-90 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" /> Report Incident
        </button>
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
                <div className="flex items-center gap-2">
                  {svc && (
                    <span className="text-xs bg-[var(--bg)] px-2.5 py-1 rounded-full whitespace-nowrap">
                      {svc.name}
                    </span>
                  )}
                  <button
                    onClick={() => setEditingIncident(inc)}
                    className="p-1.5 rounded hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    title="Edit incident"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete incident "${inc.id}"?`)) deleteIncident(inc.id);
                    }}
                    className="p-1.5 rounded hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    title="Delete incident"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider mr-1">Status:</span>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(inc, s)}
                      className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider transition-colors ${
                        inc.status === s
                          ? s === "resolved"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : s === "monitoring"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] border border-transparent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
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

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Incident">
        <IncidentForm servicesList={services} onSubmit={handleAdd} onCancel={() => setShowReportModal(false)} />
      </Modal>

      <Modal isOpen={editingIncident !== null} onClose={() => setEditingIncident(null)} title="Edit Incident">
        {editingIncident && (
          <IncidentForm
            initial={editingIncident}
            servicesList={services}
            onSubmit={handleEdit}
            onCancel={() => setEditingIncident(null)}
          />
        )}
      </Modal>
    </div>
  );
}
