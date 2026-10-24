"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2, Users, Building2, AlertOctagon } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { href: "/settings/connections", label: "Connections", icon: Link2 },
  { href: "/settings/team", label: "Team", icon: Users },
  { href: "/settings/organization", label: "Organization", icon: Building2 },
  { href: "/settings/danger", label: "Danger Zone", icon: AlertOctagon },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage your connections, team, and organization settings.
        </p>
      </div>

      {/* Sub-nav tabs */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <nav className="flex overflow-x-auto">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? "text-[var(--accent)] border-[var(--accent)]"
                    : "text-[var(--text-muted)] border-transparent hover:text-[var(--text)] hover:border-[var(--border-hover)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page content */}
      <div>{children}</div>
    </div>
  );
}
