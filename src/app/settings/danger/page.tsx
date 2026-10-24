"use client";

import { useState } from "react";
import { Download, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";

export default function DangerPage() {
  const { exportData, resetToDemo, clearAllData } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "service-observatory-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetToDemo();
    setConfirmReset(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    clearAllData();
    setConfirmDelete(false);
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Download className="w-4 h-4 text-[var(--accent)]" />
              Export Data
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Download all your data as JSON. This includes services, teams, connections,
              incidents, and configuration.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-card-hover)] transition-colors shrink-0"
          >
            Export
          </button>
        </div>
      </div>

      {/* Reset to Demo */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2 text-red-400">
              <RotateCcw className="w-4 h-4" />
              Reset to Demo Data
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Restore the default Acme Corp demo data. This will replace all your current
              data with the built-in demonstration dataset.
            </p>
          </div>
          <div className="shrink-0">
            {!confirmReset ? (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Reset
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Are you sure?
                </span>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete All Data */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2 text-red-400">
              <Trash2 className="w-4 h-4" />
              Delete All Data
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Remove all data from this browser. This will permanently delete all your services,
              teams, connections, and configuration. This cannot be undone.
            </p>
          </div>
          <div className="shrink-0">
            {!confirmDelete ? (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
              >
                Delete Everything
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Permanently delete?
                </span>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
