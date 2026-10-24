"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store";

const inputCls =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]";
const labelCls = "block text-xs text-[var(--text-muted)] mb-1";

export default function OrganizationPage() {
  const { organization, updateOrganization } = useStore();

  const [name, setName] = useState(organization.name);
  const [githubOrg, setGithubOrg] = useState(organization.githubOrg);
  const [jiraBaseUrl, setJiraBaseUrl] = useState(organization.jiraBaseUrl);
  const [grafanaUrl, setGrafanaUrl] = useState(organization.grafanaUrl);
  const [slackWorkspace, setSlackWorkspace] = useState(organization.slackWorkspace);
  const [saved, setSaved] = useState(false);

  // Sync form if organization changes externally
  useEffect(() => {
    setName(organization.name);
    setGithubOrg(organization.githubOrg);
    setJiraBaseUrl(organization.jiraBaseUrl);
    setGrafanaUrl(organization.grafanaUrl);
    setSlackWorkspace(organization.slackWorkspace);
  }, [organization]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      name,
      githubOrg,
      jiraBaseUrl,
      grafanaUrl,
      slackWorkspace,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSave}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-5"
      >
        <div>
          <label className={labelCls}>Company Name</label>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
          />
        </div>
        <div>
          <label className={labelCls}>GitHub Organization</label>
          <input
            className={inputCls}
            value={githubOrg}
            onChange={(e) => setGithubOrg(e.target.value)}
            placeholder="acme-corp"
          />
        </div>
        <div>
          <label className={labelCls}>Jira URL</label>
          <input
            className={inputCls}
            value={jiraBaseUrl}
            onChange={(e) => setJiraBaseUrl(e.target.value)}
            placeholder="https://acme.atlassian.net"
          />
        </div>
        <div>
          <label className={labelCls}>Grafana URL</label>
          <input
            className={inputCls}
            value={grafanaUrl}
            onChange={(e) => setGrafanaUrl(e.target.value)}
            placeholder="https://grafana.acme.com"
          />
        </div>
        <div>
          <label className={labelCls}>Slack Workspace</label>
          <input
            className={inputCls}
            value={slackWorkspace}
            onChange={(e) => setSlackWorkspace(e.target.value)}
            placeholder="acme-corp"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
