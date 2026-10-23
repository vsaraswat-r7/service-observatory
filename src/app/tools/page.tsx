import { mcpTools } from "@/data/placeholder";
import {
  GitBranch,
  Search,
  Cloud,
  Container,
  Hammer,
  Github,
  FileText,
  BarChart3,
  Brain,
  Wrench,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  GitBranch: <GitBranch className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Cloud: <Cloud className="w-5 h-5" />,
  Container: <Container className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Github: <Github className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
};

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">MCP Tools</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {mcpTools.length} tools your AI agent can call via the Model Context Protocol.
          Configure each tool by setting the required environment variable.
        </p>
      </div>

      {/* MCP Config Example */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-medium text-sm">IDE Configuration</span>
        </div>
        <pre className="px-5 py-4 text-xs font-mono overflow-x-auto leading-relaxed text-[var(--text)]">
{`// .kiro/settings/mcp.json (or equivalent for your IDE)
{
  "mcpServers": {
    "observatory": {
      "command": "./bin/observatory",
      "args": ["mcp", "--stdio"],
      "env": {
        "NEO4J_PASSWORD": "\${env:NEO4J_PASSWORD}",
        "AWS_PROFILE": "your-profile",
        "GITHUB_TOKEN": "\${env:GITHUB_TOKEN}"
      }
    }
  }
}`}
        </pre>
      </div>

      {/* Tool Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {mcpTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--border-hover)] transition-colors"
          >
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
              <div className="text-[var(--accent)]">{iconMap[tool.icon] ?? <Wrench className="w-5 h-5" />}</div>
              <div>
                <h3 className="font-semibold text-sm">{tool.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{tool.description}</p>
              </div>
            </div>

            <div className="px-5 py-3 space-y-3">
              {tool.modes.map((mode) => (
                <div key={mode.name}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[var(--text)]">mode={mode.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{mode.description}</span>
                  </div>
                  <pre className="text-[11px] font-mono bg-[var(--bg)] rounded px-3 py-2 overflow-x-auto text-[var(--accent)]">
                    {mode.example}
                  </pre>
                </div>
              ))}

              <div className="border-t border-[var(--border)]/50 pt-2 mt-2">
                <span className="text-[10px] text-[var(--text-muted)]">Config: </span>
                <code className="text-[10px] text-yellow-400">{tool.configKey}</code>
                <span className="text-[10px] text-[var(--text-muted)]"> = </span>
                <code className="text-[10px] text-green-400">{tool.configExample}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
