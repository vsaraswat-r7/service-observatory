"use client";

import { useStore } from "@/lib/store";
import { Settings, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Install Prerequisites",
    description: "Neo4j for the graph database and Ripgrep for code search.",
    code: `# Neo4j (graph database)
docker run -d --name neo4j \\
  -p 7474:7474 -p 7687:7687 \\
  -e NEO4J_AUTH=neo4j/changeme \\
  neo4j:latest

# Ripgrep (code search)
brew install ripgrep   # macOS
# apt install ripgrep  # Debian/Ubuntu`,
  },
  {
    number: 2,
    title: "Clone & Configure",
    description: "Copy the example config and fill in your company's details.",
    code: `git clone https://github.com/your-org/service-observatory.git
cd service-observatory && npm install
cp config/observatory.example.yaml config/observatory.yaml

# Edit the config — see the full YAML below`,
  },
  {
    number: 3,
    title: "Register Your Services",
    description: "Edit src/data/placeholder.ts with your actual services, teams, and AWS accounts.",
    code: `# The placeholder data file is the source of truth for the UI.
# Replace the example "Acme Corp" data with your own:
#
#   src/data/placeholder.ts
#
# Fields to update:
#   company    → Your company name, GitHub org, Jira URL
#   teams[]    → Your teams, leads, Slack channels
#   services[] → Your services, repos, accounts, ports
#   awsAccounts[] → Your AWS account IDs and regions`,
  },
  {
    number: 4,
    title: "Run Initial Scan",
    description: "Clone your repos and build the Neo4j knowledge graph.",
    code: `export NEO4J_PASSWORD=changeme

# Scan everything
./bin/observatory scan --all

# Or scan incrementally
./bin/observatory scan --code     # Just code AST
./bin/observatory scan --aws      # Just AWS resources
./bin/observatory scan --deps     # Just dependencies`,
  },
  {
    number: 5,
    title: "Start MCP Server",
    description: "Connect the MCP server to your IDE so AI agents can query your graph.",
    code: `# For IDE integration (stdio)
./bin/observatory mcp --stdio

# For remote agents (SSE)
./bin/observatory mcp --sse --port 3001`,
  },
  {
    number: 6,
    title: "Configure Your IDE",
    description: "Add the MCP server to your IDE's configuration.",
    code: `// .kiro/settings/mcp.json
{
  "mcpServers": {
    "observatory": {
      "command": "./bin/observatory",
      "args": ["mcp", "--stdio"],
      "env": {
        "NEO4J_PASSWORD": "\${env:NEO4J_PASSWORD}",
        "AWS_PROFILE": "your-readonly-profile"
      }
    }
  }
}`,
  },
  {
    number: 7,
    title: "Deploy to Vercel",
    description: "Push to GitHub and deploy the dashboard to Vercel.",
    code: `git init && git add -A
git commit -m "initial: service observatory"
gh repo create your-org/service-observatory --public --push

# Install Vercel CLI and deploy
npm i -g vercel
vercel --prod`,
  },
];

export default function SetupPage() {
  const { placeholderConfig, organization } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Setup Guide</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Get Service Observatory running for <strong>{organization.name}</strong> (or your company) in 7 steps.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center text-xs font-bold">
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <p className="text-xs text-[var(--text-muted)]">{step.description}</p>
              </div>
            </div>
            <pre className="px-5 py-4 text-xs font-mono overflow-x-auto text-[var(--text)] leading-relaxed bg-[var(--bg)]">
              {step.code}
            </pre>
          </div>
        ))}
      </div>

      {/* Full YAML Config */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-semibold text-sm">Full Configuration (observatory.yaml)</span>
        </div>
        <pre className="px-5 py-4 text-xs font-mono overflow-x-auto text-[var(--text)] leading-relaxed bg-[var(--bg)] max-h-[600px] overflow-y-auto">
          {placeholderConfig}
        </pre>
      </div>

      {/* What to Replace */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
          What You Need to Replace
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="pb-2">Placeholder</th>
                <th className="pb-2">Example Value</th>
                <th className="pb-2">Where</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                ["Company name", '"Acme Corp"', "company.name"],
                ["GitHub org", '"acme-corp"', "company.githubOrg"],
                ["Jira URL", '"https://acme.atlassian.net"', "company.jiraBaseUrl"],
                ["AWS account ID", '"123456789012"', "awsAccounts[].id"],
                ["AWS profile", '"acme-prod-readonly"', "awsAccounts[].profile"],
                ["Service name", '"order-service"', "services[].id"],
                ["Service repo", '"acme-corp/order-service"', "services[].repo"],
                ["Team name", '"Payments Team"', "teams[].name"],
                ["Team lead", '"Alice Chen"', "teams[].lead"],
                ["Slack channel", '"#payments-oncall"', "teams[].slackChannel"],
                ["Neo4j password", '"changeme"', "NEO4J_PASSWORD env var"],
                ["Queue name", '"order-processing-queue"', "services[].queues"],
                ["DB name", '"orders-postgres-prod"', "services[].databases"],
              ].map(([placeholder, example, where]) => (
                <tr key={placeholder} className="border-b border-[var(--border)]/30">
                  <td className="py-2 font-medium">{placeholder}</td>
                  <td className="py-2 font-mono text-green-400">{example}</td>
                  <td className="py-2 text-[var(--text-muted)] font-mono">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
