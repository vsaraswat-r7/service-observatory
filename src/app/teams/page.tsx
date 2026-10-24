"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Team } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import Modal from "@/components/Modal";

function TeamForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Team;
  onSubmit: (data: Omit<Team, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [lead, setLead] = useState(initial?.lead ?? "");
  const [slackChannel, setSlackChannel] = useState(initial?.slackChannel ?? "#");
  const [oncallSchedule, setOncallSchedule] = useState(initial?.oncallSchedule ?? "");
  const [members, setMembers] = useState(initial?.members ?? 1);
  const [color, setColor] = useState(initial?.color ?? "#6366f1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      ...(initial ? { id: initial.id } : {}),
      name: name.trim(),
      lead,
      slackChannel,
      oncallSchedule,
      members,
      color,
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
        <label className={labelCls}>Lead</label>
        <input className={inputCls} value={lead} onChange={(e) => setLead(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Slack Channel</label>
          <input className={inputCls} value={slackChannel} onChange={(e) => setSlackChannel(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>On-call Schedule</label>
          <input className={inputCls} value={oncallSchedule} onChange={(e) => setOncallSchedule(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Members</label>
          <input
            className={inputCls}
            type="number"
            min={1}
            value={members}
            onChange={(e) => setMembers(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Color</label>
          <div className="flex items-center gap-2">
            <input className={inputCls} value={color} onChange={(e) => setColor(e.target.value)} />
            <div className="w-8 h-8 rounded-lg border border-[var(--border)] shrink-0" style={{ background: color }} />
          </div>
        </div>
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
          {initial ? "Save Changes" : "Add Team"}
        </button>
      </div>
    </form>
  );
}

export default function TeamsPage() {
  const { teams, services, addTeam, updateTeam, deleteTeam } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleAdd = (data: Omit<Team, "id"> & { id?: string }) => {
    const id = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    addTeam({ ...data, id } as Team);
    setShowAddModal(false);
  };

  const handleEdit = (data: Omit<Team, "id"> & { id?: string }) => {
    if (!editingTeam) return;
    updateTeam(editingTeam.id, data);
    setEditingTeam(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {teams.length} teams owning {services.length} services.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Team
        </button>
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
                <button
                  onClick={() => setEditingTeam(team)}
                  className="p-1.5 rounded hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  title="Edit team"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete team "${team.name}"?`)) deleteTeam(team.id);
                  }}
                  className="p-1.5 rounded hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  title="Delete team"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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
              {teamServices.length === 0 && (
                <div className="px-5 py-3 text-sm text-[var(--text-muted)]">No services yet</div>
              )}
            </div>
          </div>
        );
      })}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Team">
        <TeamForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={editingTeam !== null} onClose={() => setEditingTeam(null)} title="Edit Team">
        {editingTeam && (
          <TeamForm initial={editingTeam} onSubmit={handleEdit} onCancel={() => setEditingTeam(null)} />
        )}
      </Modal>
    </div>
  );
}
