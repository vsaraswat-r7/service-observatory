"use client";

import { useState } from "react";
import { Plus, Trash2, Github, Cloud, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store";

const inputCls =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]";
const labelCls = "block text-xs text-[var(--text-muted)] mb-1";

export default function ConnectionsPage() {
  const {
    connections,
    addConnection,
    removeConnection,
    awsAccounts,
    addAwsAccount,
    deleteAwsAccount,
  } = useStore();

  // GitHub form
  const [repoInput, setRepoInput] = useState("");

  // AWS form
  const [accountId, setAccountId] = useState("");
  const [alias, setAlias] = useState("");
  const [environment, setEnvironment] = useState<
    "production" | "staging" | "development"
  >("production");
  const [regions, setRegions] = useState("");

  const handleAddRepo = () => {
    const repo = repoInput.trim();
    if (!repo) return;
    addConnection({ repo, connected: true, addedAt: new Date().toISOString() });
    setRepoInput("");
  };

  const handleAddAccount = () => {
    if (!accountId.trim()) return;
    const regionList = regions
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    addAwsAccount({
      id: accountId.trim(),
      alias: alias.trim() || accountId.trim(),
      environment,
      regions: regionList,
    });
    setAccountId("");
    setAlias("");
    setEnvironment("production");
    setRegions("");
  };

  return (
    <div className="space-y-8">
      {/* GitHub Repos */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Github className="w-5 h-5 text-[var(--accent)]" />
          GitHub Repositories
        </h2>

        <div className="flex gap-2">
          <input
            className={inputCls}
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="org/repo"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRepo();
              }
            }}
          />
          <button
            onClick={handleAddRepo}
            className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {connections.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No repositories connected yet.</p>
        ) : (
          <div className="space-y-1.5">
            {connections.map((c) => (
              <div
                key={c.repo}
                className="flex items-center justify-between px-3 py-2.5 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.repo}</span>
                  {c.connected && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" /> Connected
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeConnection(c.repo)}
                  className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-card)] transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AWS Accounts */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[var(--accent)]" />
          AWS Accounts
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Account ID</label>
            <input
              className={inputCls}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="123456789012"
            />
          </div>
          <div>
            <label className={labelCls}>Alias</label>
            <input
              className={inputCls}
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="production"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Environment</label>
            <select
              className={inputCls}
              value={environment}
              onChange={(e) =>
                setEnvironment(
                  e.target.value as "production" | "staging" | "development"
                )
              }
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Regions (comma-separated)</label>
            <input
              className={inputCls}
              value={regions}
              onChange={(e) => setRegions(e.target.value)}
              placeholder="us-east-1, eu-west-1"
            />
          </div>
        </div>
        <button
          onClick={handleAddAccount}
          className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Account
        </button>

        {awsAccounts.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No AWS accounts connected yet.</p>
        ) : (
          <div className="space-y-1.5">
            {awsAccounts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between px-3 py-2.5 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
              >
                <div className="text-sm">
                  <span className="font-medium">{a.alias}</span>
                  <span className="text-[var(--text-muted)]"> ({a.id})</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border)]">
                    {a.environment}
                  </span>
                  <span className="ml-2 text-xs text-[var(--text-muted)]">
                    {a.regions.join(", ")}
                  </span>
                </div>
                <button
                  onClick={() => deleteAwsAccount(a.id)}
                  className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-card)] transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
