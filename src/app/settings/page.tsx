"use client";

import Link from "next/link";
import { Link2, Users, Building2, AlertOctagon } from "lucide-react";
import { useStore } from "@/lib/store";

const sections = [
  {
    href: "/settings/connections",
    label: "Connections",
    icon: Link2,
    description: "Manage GitHub repositories and AWS accounts.",
  },
  {
    href: "/settings/team",
    label: "Team",
    icon: Users,
    description: "Add, edit, or remove teams that own your services.",
  },
  {
    href: "/settings/organization",
    label: "Organization",
    icon: Building2,
    description: "Update your company name, integrations, and URLs.",
  },
  {
    href: "/settings/danger",
    label: "Danger Zone",
    icon: AlertOctagon,
    description: "Export data, reset to demo, or delete everything.",
  },
];

export default function SettingsOverview() {
  const { connections, awsAccounts, teams, organization } = useStore();

  const stats = [
    `${connections.length} repos`,
    `${awsAccounts.length} AWS accounts`,
    `${teams.length} teams`,
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="font-semibold mb-1">{organization.name}</h2>
        <p className="text-sm text-[var(--text-muted)]">{stats.join(" · ")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ href, label, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                {label}
              </h3>
            </div>
            <p className="text-sm text-[var(--text-muted)]">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
