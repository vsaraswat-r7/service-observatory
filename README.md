# Service Observatory

**Company-agnostic service observability platform.**

A reusable template that any company can deploy to visualize their microservice architecture, query a Neo4j knowledge graph via AI agents (MCP), and track incidents — inspired by Hermit (Rapid7) and awesome-low-level-design patterns.

## Features

- **Dashboard** — Real-time service health, request metrics, and incident overview
- **Service Graph** — Visual map of service-to-service calls, queues, databases, and S3 buckets
- **Query Playground** — Ready-to-use Cypher recipes with placeholder examples
- **MCP Tools** — 9 AI-accessible tools (graph, codesearch, aws, k8s, jenkins, github, logs, grafana, memory)
- **Incident Tracker** — Recent incidents with root cause and impact
- **Team Directory** — Teams, ownership, and on-call info
- **Setup Guide** — Step-by-step instructions to deploy for your company

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

Edit `src/data/placeholder.ts` — replace the example "Acme Corp" data with your own:

- `company` → Your company name, GitHub org, Jira URL
- `teams[]` → Your teams, leads, Slack channels
- `services[]` → Your services, repos, AWS accounts, ports
- `awsAccounts[]` → Your AWS account IDs and regions
- `graphEdges[]` → How your services connect
- `incidents[]` → Your recent incidents
- `cypherRecipes[]` → Cypher queries using your service names
- `mcpTools[]` → MCP tool configuration for your infra

## Deploy to Vercel

```bash
npm run build
npx vercel --prod
```

## Tech Stack

- **Next.js 15** (App Router, static export)
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React** (icons)

## License

MIT
