"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Service } from "@/lib/types";
import ServiceCard from "@/components/ServiceCard";
import Modal from "@/components/Modal";

const LANGUAGES: Service["language"][] = ["java", "kotlin", "python", "typescript", "go"];

function ServiceForm({
  initial,
  teams,
  onSubmit,
  onCancel,
}: {
  initial?: Service;
  teams: { id: string; name: string }[];
  onSubmit: (data: Omit<Service, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [repo, setRepo] = useState(initial?.repo ?? "{org}/");
  const [team, setTeam] = useState(initial?.team ?? (teams[0]?.id ?? ""));
  const [language, setLanguage] = useState<Service["language"]>(initial?.language ?? "java");
  const [framework, setFramework] = useState(initial?.framework ?? "");
  const [port, setPort] = useState(initial?.port ?? 8080);
  const [description, setDescription] = useState(initial?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      ...(initial ? { id: initial.id } : {}),
      name: name.trim(),
      repo,
      team,
      language,
      framework,
      port,
      description,
      status: initial?.status ?? "unknown",
      podCount: initial?.podCount ?? 1,
      avgLatencyMs: initial?.avgLatencyMs ?? 0,
      requestsPerMin: initial?.requestsPerMin ?? 0,
      errorRate: initial?.errorRate ?? 0,
      coveragePercent: initial?.coveragePercent ?? 0,
      lastDeploy: initial?.lastDeploy ?? new Date().toISOString(),
      queues: initial?.queues ?? [],
      databases: initial?.databases ?? [],
      s3Buckets: initial?.s3Buckets ?? [],
      entryPoints: initial?.entryPoints ?? [],
      dependencies: initial?.dependencies ?? [],
      topics: initial?.topics ?? [],
      account: initial?.account ?? "",
    });
  };

  const inputCls =
    "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs text-[var(--text-muted)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Name *</label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className={labelCls}>Repository</label>
        <input className={inputCls} value={repo} onChange={(e) => setRepo(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Team</label>
          <select className={inputCls} value={team} onChange={(e) => setTeam(e.target.value)}>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Language</label>
          <select
            className={inputCls}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Service["language"])}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Framework</label>
          <input className={inputCls} value={framework} onChange={(e) => setFramework(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Port</label>
          <input
            className={inputCls}
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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
          {initial ? "Save Changes" : "Add Service"}
        </button>
      </div>
    </form>
  );
}

export default function ServicesPage() {
  const { services, teams, addService, updateService, deleteService } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const grouped = teams.map((team) => ({
    team,
    services: services.filter((s) => s.team === team.id),
  }));

  const handleAdd = (data: Omit<Service, "id"> & { id?: string }) => {
    const id = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    addService({ ...data, id } as Service);
    setShowAddModal(false);
  };

  const handleEdit = (data: Omit<Service, "id"> & { id?: string }) => {
    if (!editingService) return;
    updateService(editingService.id, data);
    setEditingService(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {services.length} services across {teams.length} teams
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {grouped.map(({ team, services: teamServices }) => (
        <div key={team.id}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: team.color }} />
            {team.name}
            <span className="text-xs text-[var(--text-muted)] font-normal">
              ({teamServices.length} services · Lead: {team.lead})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamServices.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                onEdit={(s) => setEditingService(s)}
                onDelete={(id) => deleteService(id)}
              />
            ))}
          </div>
        </div>
      ))}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Service">
        <ServiceForm teams={teams} onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        isOpen={editingService !== null}
        onClose={() => setEditingService(null)}
        title="Edit Service"
      >
        {editingService && (
          <ServiceForm
            initial={editingService}
            teams={teams}
            onSubmit={handleEdit}
            onCancel={() => setEditingService(null)}
          />
        )}
      </Modal>
    </div>
  );
}
