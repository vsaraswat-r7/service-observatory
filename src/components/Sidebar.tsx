"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  GitBranch,
  Terminal,
  Wrench,
  AlertTriangle,
  Users,
  Settings,
  Telescope,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Server },
  { href: "/graph", label: "Service Graph", icon: GitBranch },
  { href: "/queries", label: "Query Playground", icon: Terminal },
  { href: "/tools", label: "MCP Tools", icon: Wrench },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/setup", label: "Setup Guide", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col z-50">
      <div className="p-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <Telescope className="w-6 h-6 text-[var(--accent)]" />
          <div>
            <div className="font-semibold text-sm text-[var(--text)]">
              Service Observatory
            </div>
            <div className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
              Your Company Here
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? "text-[var(--accent)] bg-[var(--accent)]/10 border-r-2 border-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
        <div>Open Source · MIT License</div>
        <div className="mt-1 opacity-70">Replace placeholder data →</div>
        <div className="opacity-70">src/data/placeholder.ts</div>
      </div>
    </aside>
  );
}
