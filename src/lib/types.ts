// ============================================================================
// SERVICE OBSERVATORY — SHARED TYPES
// ============================================================================

export type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";

export type Service = {
  id: string;
  name: string;
  repo: string;
  team: string;
  account: string;
  port: number;
  language: "java" | "kotlin" | "python" | "typescript" | "go";
  framework: string;
  status: ServiceStatus;
  description: string;
  entryPoints: string[];
  dependencies: string[];
  queues: string[];
  topics: string[];
  databases: string[];
  s3Buckets: string[];
  podCount: number;
  avgLatencyMs: number;
  requestsPerMin: number;
  errorRate: number;
  lastDeploy: string;
  coveragePercent: number;
};

export type Team = {
  id: string;
  name: string;
  lead: string;
  slackChannel: string;
  oncallSchedule: string;
  members: number;
  color: string;
};

export type AwsAccount = {
  id: string;
  alias: string;
  environment: "production" | "staging" | "development";
  regions: string[];
};

export type GraphEdge = {
  from: string;
  to: string;
  type: string;
  label?: string;
};

export type Incident = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "resolved" | "investigating" | "monitoring";
  service: string;
  startedAt: string;
  resolvedAt?: string;
  rootCause?: string;
  impactSummary: string;
};

export type CypherRecipe = {
  id: string;
  name: string;
  description: string;
  category: "orientation" | "code" | "blast-radius" | "sql" | "dependencies";
  query: string;
  placeholders: { key: string; example: string; description: string }[];
};

export type McpTool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  modes: { name: string; description: string; example: string }[];
  configKey: string;
  configExample: string;
};

export type Organization = {
  name: string;
  logo: string;
  githubOrg: string;
  jiraBaseUrl: string;
  grafanaUrl: string;
  slackWorkspace: string;
};

export type GitHubConnection = {
  repo: string;
  connected: boolean;
  addedAt: string;
};
