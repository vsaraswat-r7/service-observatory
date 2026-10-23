// ============================================================================
// SERVICE OBSERVATORY — PLACEHOLDER DATA
// ============================================================================
// Replace this file with your own company's data.
// Every field has a comment showing what to put there.
//
// This example uses a fictional e-commerce company "Acme Corp" with
// 8 microservices, 3 teams, and 2 AWS accounts.
// ============================================================================

// --- COMPANY CONFIG ---------------------------------------------------------
export const company = {
  name: "Acme Corp",                          // Your company name
  logo: "/logo.svg",                           // Path to your logo (put in /public)
  githubOrg: "acme-corp",                      // Your GitHub org
  jiraBaseUrl: "https://acme.atlassian.net",   // Your Jira instance
  grafanaUrl: "https://grafana.acme.internal", // Your Grafana instance
  slackWorkspace: "acme-corp",                 // Slack workspace name
};

// --- TEAMS ------------------------------------------------------------------
export type Team = {
  id: string;
  name: string;
  lead: string;
  slackChannel: string;
  oncallSchedule: string;
  members: number;
  color: string;   // for UI badges
};

export const teams: Team[] = [
  {
    id: "payments-team",
    name: "Payments Team",
    lead: "Alice Chen",
    slackChannel: "#payments-oncall",
    oncallSchedule: "payments-pd-schedule",
    members: 6,
    color: "#6366f1",
  },
  {
    id: "platform-team",
    name: "Platform Team",
    lead: "Bob Martinez",
    slackChannel: "#platform-oncall",
    oncallSchedule: "platform-pd-schedule",
    members: 8,
    color: "#06b6d4",
  },
  {
    id: "growth-team",
    name: "Growth Team",
    lead: "Carol Davis",
    slackChannel: "#growth-oncall",
    oncallSchedule: "growth-pd-schedule",
    members: 5,
    color: "#22c55e",
  },
];

// --- AWS ACCOUNTS -----------------------------------------------------------
export type AwsAccount = {
  id: string;       // 12-digit AWS account ID
  alias: string;    // Human-readable alias
  environment: "production" | "staging" | "development";
  regions: string[];
};

export const awsAccounts: AwsAccount[] = [
  {
    id: "123456789012",
    alias: "acme-production",
    environment: "production",
    regions: ["us-east-1", "eu-west-1"],
  },
  {
    id: "987654321098",
    alias: "acme-staging",
    environment: "staging",
    regions: ["us-east-1"],
  },
];

// --- SERVICES ---------------------------------------------------------------
export type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";
export type Service = {
  id: string;              // Unique service name (used as graph node ID)
  name: string;            // Display name
  repo: string;            // GitHub repo (org/repo)
  team: string;            // Team ID from teams array
  account: string;         // AWS account ID
  port: number;
  language: "java" | "kotlin" | "python" | "typescript" | "go";
  framework: string;
  status: ServiceStatus;
  description: string;
  entryPoints: string[];   // Controller/Listener class names
  dependencies: string[];  // Other service IDs this depends on
  queues: string[];        // SQS queue names
  topics: string[];        // SNS topic names
  databases: string[];     // DB instance names
  s3Buckets: string[];     // S3 bucket names
  podCount: number;
  avgLatencyMs: number;
  requestsPerMin: number;
  errorRate: number;       // 0.0 to 1.0
  lastDeploy: string;      // ISO date string
  coveragePercent: number;
};

export const services: Service[] = [
  {
    id: "order-service",
    name: "Order Service",
    repo: "acme-corp/order-service",
    team: "payments-team",
    account: "123456789012",
    port: 8080,
    language: "java",
    framework: "Spring Boot 3.2",
    status: "healthy",
    description: "Handles order creation, updates, and lifecycle management. Core transactional service.",
    entryPoints: ["OrderController", "OrderEventListener", "OrderScheduler"],
    dependencies: ["payment-gateway", "inventory-service", "notification-service"],
    queues: ["order-processing-queue", "order-fulfillment-queue"],
    topics: ["order-events-topic"],
    databases: ["orders-postgres-prod"],
    s3Buckets: ["order-documents", "order-invoices"],
    podCount: 4,
    avgLatencyMs: 45,
    requestsPerMin: 1200,
    errorRate: 0.002,
    lastDeploy: "2024-12-18T14:30:00Z",
    coveragePercent: 82,
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    repo: "acme-corp/payment-gateway",
    team: "payments-team",
    account: "123456789012",
    port: 8081,
    language: "java",
    framework: "Spring Boot 3.2",
    status: "healthy",
    description: "Processes payments via Stripe/PayPal. Handles refunds and dispute resolution.",
    entryPoints: ["PaymentController", "RefundListener", "DisputeWebhookHandler"],
    dependencies: ["order-service", "notification-service"],
    queues: ["payment-processing-queue", "refund-queue"],
    topics: ["payment-events-topic"],
    databases: ["payments-postgres-prod"],
    s3Buckets: ["payment-receipts"],
    podCount: 3,
    avgLatencyMs: 120,
    requestsPerMin: 800,
    errorRate: 0.001,
    lastDeploy: "2024-12-17T10:15:00Z",
    coveragePercent: 88,
  },
  {
    id: "user-service",
    name: "User Service",
    repo: "acme-corp/user-service",
    team: "platform-team",
    account: "123456789012",
    port: 8082,
    language: "java",
    framework: "Spring Boot 3.2",
    status: "healthy",
    description: "User registration, authentication, profile management. OAuth2 + JWT.",
    entryPoints: ["UserController", "AuthController", "UserEventListener"],
    dependencies: ["notification-service"],
    queues: ["user-verification-queue"],
    topics: ["user-events-topic"],
    databases: ["users-postgres-prod"],
    s3Buckets: ["user-avatars"],
    podCount: 3,
    avgLatencyMs: 25,
    requestsPerMin: 2000,
    errorRate: 0.0005,
    lastDeploy: "2024-12-16T09:00:00Z",
    coveragePercent: 91,
  },
  {
    id: "inventory-service",
    name: "Inventory Service",
    repo: "acme-corp/inventory-service",
    team: "platform-team",
    account: "123456789012",
    port: 8083,
    language: "kotlin",
    framework: "Spring Boot 3.2",
    status: "degraded",
    description: "Tracks product inventory levels across warehouses. Real-time stock updates.",
    entryPoints: ["InventoryController", "StockUpdateListener", "ReorderScheduler"],
    dependencies: ["notification-service"],
    queues: ["stock-update-queue", "reorder-queue"],
    topics: ["inventory-events-topic"],
    databases: ["inventory-postgres-prod"],
    s3Buckets: [],
    podCount: 2,
    avgLatencyMs: 35,
    requestsPerMin: 600,
    errorRate: 0.015,
    lastDeploy: "2024-12-18T16:45:00Z",
    coveragePercent: 76,
  },
  {
    id: "notification-service",
    name: "Notification Service",
    repo: "acme-corp/notification-service",
    team: "platform-team",
    account: "123456789012",
    port: 8084,
    language: "typescript",
    framework: "NestJS",
    status: "healthy",
    description: "Sends emails, SMS, push notifications. Template-based. Multi-channel.",
    entryPoints: ["NotificationController", "NotificationQueueConsumer"],
    dependencies: [],
    queues: ["notification-queue", "notification-dlq"],
    topics: [],
    databases: ["notifications-dynamodb"],
    s3Buckets: ["notification-templates"],
    podCount: 2,
    avgLatencyMs: 15,
    requestsPerMin: 3000,
    errorRate: 0.003,
    lastDeploy: "2024-12-15T11:20:00Z",
    coveragePercent: 85,
  },
  {
    id: "search-service",
    name: "Search Service",
    repo: "acme-corp/search-service",
    team: "growth-team",
    account: "123456789012",
    port: 8085,
    language: "python",
    framework: "FastAPI",
    status: "healthy",
    description: "Product search and recommendations. Elasticsearch-backed. ML-powered ranking.",
    entryPoints: ["search_router", "index_consumer", "recommendation_scheduler"],
    dependencies: ["inventory-service"],
    queues: ["search-index-queue"],
    topics: [],
    databases: ["search-elasticsearch-prod"],
    s3Buckets: ["search-models"],
    podCount: 3,
    avgLatencyMs: 55,
    requestsPerMin: 4500,
    errorRate: 0.001,
    lastDeploy: "2024-12-18T08:00:00Z",
    coveragePercent: 79,
  },
  {
    id: "analytics-service",
    name: "Analytics Service",
    repo: "acme-corp/analytics-service",
    team: "growth-team",
    account: "123456789012",
    port: 8086,
    language: "python",
    framework: "FastAPI",
    status: "healthy",
    description: "Event ingestion, aggregation, and reporting. Powers the admin dashboard.",
    entryPoints: ["analytics_router", "event_consumer", "aggregation_scheduler"],
    dependencies: [],
    queues: ["analytics-events-queue"],
    topics: ["analytics-events-topic"],
    databases: ["analytics-clickhouse-prod"],
    s3Buckets: ["analytics-exports", "analytics-raw-events"],
    podCount: 2,
    avgLatencyMs: 80,
    requestsPerMin: 500,
    errorRate: 0.0,
    lastDeploy: "2024-12-14T15:30:00Z",
    coveragePercent: 72,
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    repo: "acme-corp/api-gateway",
    team: "platform-team",
    account: "123456789012",
    port: 8443,
    language: "go",
    framework: "Kong / Custom",
    status: "healthy",
    description: "Edge gateway. Rate limiting, auth, routing. TLS termination.",
    entryPoints: ["main", "healthHandler", "proxyHandler"],
    dependencies: ["user-service", "order-service", "search-service", "analytics-service"],
    queues: [],
    topics: [],
    databases: [],
    s3Buckets: ["gateway-access-logs"],
    podCount: 6,
    avgLatencyMs: 5,
    requestsPerMin: 12000,
    errorRate: 0.0001,
    lastDeploy: "2024-12-18T12:00:00Z",
    coveragePercent: 95,
  },
];

// --- GRAPH RELATIONSHIPS (what connects to what) ----------------------------
export type GraphEdge = {
  from: string;         // service or resource ID
  to: string;
  type: string;         // relationship type (CALLS_SERVICE, READS_SQS, etc.)
  label?: string;       // optional display label
};

export const graphEdges: GraphEdge[] = [
  // Service-to-service calls
  { from: "api-gateway", to: "order-service", type: "CALLS_SERVICE" },
  { from: "api-gateway", to: "user-service", type: "CALLS_SERVICE" },
  { from: "api-gateway", to: "search-service", type: "CALLS_SERVICE" },
  { from: "api-gateway", to: "analytics-service", type: "CALLS_SERVICE" },
  { from: "order-service", to: "payment-gateway", type: "CALLS_SERVICE" },
  { from: "order-service", to: "inventory-service", type: "CALLS_SERVICE" },
  { from: "order-service", to: "notification-service", type: "CALLS_SERVICE" },
  { from: "payment-gateway", to: "notification-service", type: "CALLS_SERVICE" },
  { from: "user-service", to: "notification-service", type: "CALLS_SERVICE" },
  { from: "inventory-service", to: "notification-service", type: "CALLS_SERVICE" },
  { from: "search-service", to: "inventory-service", type: "CALLS_SERVICE" },

  // Queue relationships
  { from: "order-service", to: "order-processing-queue", type: "WRITES_SQS" },
  { from: "order-service", to: "order-fulfillment-queue", type: "WRITES_SQS" },
  { from: "payment-gateway", to: "payment-processing-queue", type: "READS_SQS" },
  { from: "payment-gateway", to: "refund-queue", type: "READS_SQS" },
  { from: "notification-service", to: "notification-queue", type: "READS_SQS" },
  { from: "search-service", to: "search-index-queue", type: "READS_SQS" },
  { from: "analytics-service", to: "analytics-events-queue", type: "READS_SQS" },

  // Topic relationships
  { from: "order-service", to: "order-events-topic", type: "WRITES_SNS" },
  { from: "payment-gateway", to: "payment-events-topic", type: "WRITES_SNS" },
  { from: "user-service", to: "user-events-topic", type: "WRITES_SNS" },

  // Database relationships
  { from: "order-service", to: "orders-postgres-prod", type: "READS_DB" },
  { from: "order-service", to: "orders-postgres-prod", type: "WRITES_DB" },
  { from: "payment-gateway", to: "payments-postgres-prod", type: "READS_DB" },
  { from: "payment-gateway", to: "payments-postgres-prod", type: "WRITES_DB" },
  { from: "user-service", to: "users-postgres-prod", type: "READS_DB" },
  { from: "user-service", to: "users-postgres-prod", type: "WRITES_DB" },
  { from: "inventory-service", to: "inventory-postgres-prod", type: "READS_DB" },
  { from: "inventory-service", to: "inventory-postgres-prod", type: "WRITES_DB" },

  // S3 relationships
  { from: "order-service", to: "order-documents", type: "WRITES_S3" },
  { from: "order-service", to: "order-invoices", type: "WRITES_S3" },
  { from: "analytics-service", to: "analytics-raw-events", type: "WRITES_S3" },
  { from: "api-gateway", to: "gateway-access-logs", type: "WRITES_S3" },
];

// --- INCIDENTS (recent) -----------------------------------------------------
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

export const incidents: Incident[] = [
  {
    id: "INC-2024-042",
    title: "Order processing queue depth spike",
    severity: "high",
    status: "resolved",
    service: "order-service",
    startedAt: "2024-12-17T14:02:00Z",
    resolvedAt: "2024-12-17T14:45:00Z",
    rootCause: "Missing null check in OrderEventListener#handleMessage caused NullPointerException on malformed events",
    impactSummary: "~200 orders delayed by 43 minutes",
  },
  {
    id: "INC-2024-041",
    title: "Inventory service high error rate",
    severity: "medium",
    status: "monitoring",
    service: "inventory-service",
    startedAt: "2024-12-18T16:30:00Z",
    impactSummary: "Stock levels showing stale data for ~5% of products",
  },
  {
    id: "INC-2024-040",
    title: "Payment gateway timeout to Stripe",
    severity: "critical",
    status: "resolved",
    service: "payment-gateway",
    startedAt: "2024-12-15T09:15:00Z",
    resolvedAt: "2024-12-15T09:35:00Z",
    rootCause: "Stripe API endpoint migration — DNS cache TTL was too aggressive",
    impactSummary: "All payments failed for 20 minutes, ~150 transactions affected",
  },
];

// --- CYPHER RECIPES (for the query playground) ------------------------------
export type CypherRecipe = {
  id: string;
  name: string;
  description: string;
  category: "orientation" | "code" | "blast-radius" | "sql" | "dependencies";
  query: string;
  placeholders: { key: string; example: string; description: string }[];
};

export const cypherRecipes: CypherRecipe[] = [
  {
    id: "orientation-1",
    name: "What does this service touch?",
    description: "Show all resources (queues, DBs, buckets, other services) a service connects to.",
    category: "orientation",
    query: `MATCH (s:Microservice {id:'{{SERVICE_ID}}'})-[r]->(n)
RETURN type(r) AS rel, labels(n)[0] AS kind, n.id AS target
LIMIT 100`,
    placeholders: [
      { key: "SERVICE_ID", example: "order-service", description: "The service name / graph node ID" },
    ],
  },
  {
    id: "orientation-2",
    name: "Find service by partial name",
    description: "Search for services when you only know part of the name.",
    category: "orientation",
    query: `MATCH (s:Microservice) WHERE s.id CONTAINS '{{SEARCH_TERM}}'
RETURN s.id`,
    placeholders: [
      { key: "SEARCH_TERM", example: "order", description: "Partial service name to search for" },
    ],
  },
  {
    id: "code-1",
    name: "Entry points (controllers, listeners)",
    description: "Find where execution starts for a service — HTTP handlers, SQS listeners, schedulers.",
    category: "code",
    query: `MATCH (s:Microservice {id:'{{SERVICE_ID}}'})-[:ENTRY_POINT]->(m:JavaMethod)
RETURN m.name, m.id, m.file, m.line`,
    placeholders: [
      { key: "SERVICE_ID", example: "order-service", description: "Service to inspect" },
    ],
  },
  {
    id: "code-2",
    name: "Call chain from entry point",
    description: "Trace the call chain from a controller/listener method through the code (up to 6 hops).",
    category: "code",
    query: `MATCH path = (e:JavaMethod {id:'{{METHOD_ID}}'})-[:CALLS*1..6]->(m:JavaMethod)
WHERE m.id STARTS WITH '{{PACKAGE_PREFIX}}'
RETURN [n IN nodes(path) | n.name] AS chain
LIMIT 50`,
    placeholders: [
      { key: "METHOD_ID", example: "com.acme.orders.OrderController#placeOrder(1)", description: "Fully qualified method ID" },
      { key: "PACKAGE_PREFIX", example: "com.acme", description: "Package prefix to filter first-party code" },
    ],
  },
  {
    id: "blast-1",
    name: "What breaks if I change this DB?",
    description: "Find all services that read from or write to a specific database.",
    category: "blast-radius",
    query: `MATCH (s:Microservice)-[:READS_DB|WRITES_DB]->(db:RDSInstance {id:'{{DB_ID}}'})
RETURN s.id AS service, type(relationships(s)[0]) AS access_type`,
    placeholders: [
      { key: "DB_ID", example: "orders-postgres-prod", description: "Database instance name" },
    ],
  },
  {
    id: "blast-2",
    name: "Who calls this method? (blast radius)",
    description: "Find every caller of a specific method — what would break if you change it.",
    category: "blast-radius",
    query: `MATCH (caller:JavaMethod)-[:CALLS]->(target:JavaMethod)
WHERE target.id STARTS WITH '{{CLASS_PREFIX}}'
RETURN caller.id, caller.file, caller.line`,
    placeholders: [
      { key: "CLASS_PREFIX", example: "com.acme.orders.OrderRepository#save", description: "Method or class prefix" },
    ],
  },
  {
    id: "sql-1",
    name: "Every SQL query a service runs",
    description: "Find all SQL queries executed by a service's code.",
    category: "sql",
    query: `MATCH (s:Microservice {id:'{{SERVICE_ID}}'})-[:ENTRY_POINT]->()-[:CALLS*0..6]->(m:JavaMethod)
      -[:EXECUTES_QUERY]->(q:SQLQuery)
RETURN q.name, q.runs
LIMIT 50`,
    placeholders: [
      { key: "SERVICE_ID", example: "order-service", description: "Service to inspect" },
    ],
  },
  {
    id: "deps-1",
    name: "Who depends on this library?",
    description: "Find all services that depend on a specific library/SDK.",
    category: "dependencies",
    query: `MATCH (s:Microservice)-[:DEPENDS_ON]->(lib:Library)
WHERE lib.id CONTAINS '{{LIBRARY_NAME}}'
RETURN s.id, lib.id, lib.version`,
    placeholders: [
      { key: "LIBRARY_NAME", example: "spring-boot-starter-web", description: "Library artifact name (partial match)" },
    ],
  },
];

// --- MCP TOOL CONFIG (for the tools page) -----------------------------------
export type McpTool = {
  id: string;
  name: string;
  description: string;
  icon: string;  // lucide icon name
  modes: { name: string; description: string; example: string }[];
  configKey: string;   // what env/config this tool needs
  configExample: string;
};

export const mcpTools: McpTool[] = [
  {
    id: "graph",
    name: "Knowledge Graph",
    description: "Query your Neo4j service graph via Cypher",
    icon: "GitBranch",
    modes: [
      { name: "query", description: "Execute a Cypher query", example: 'graph query="MATCH (s:Microservice) RETURN s.id LIMIT 10"' },
    ],
    configKey: "NEO4J_URI",
    configExample: "bolt://localhost:7687",
  },
  {
    id: "codesearch",
    name: "Code Search",
    description: "Ripgrep across local repo clones",
    icon: "Search",
    modes: [
      { name: "search", description: "Text search across repos", example: 'codesearch mode=search repo=order-service q="placeOrder"' },
      { name: "file", description: "Read a specific file", example: 'codesearch mode=file repo=order-service path=src/main/.../OrderService.java' },
    ],
    configKey: "REPOS_DIR",
    configExample: "~/.service-observatory/repos",
  },
  {
    id: "aws",
    name: "AWS (Live)",
    description: "Read-only access to SQS, CloudWatch, Lambda, RDS, S3",
    icon: "Cloud",
    modes: [
      { name: "depth", description: "Check SQS queue depth", example: 'aws account=production service=sqs mode=depth name=order-processing-queue' },
      { name: "alarms", description: "Check CloudWatch alarms", example: 'aws account=production service=cloudwatch mode=alarms' },
      { name: "errors", description: "Check Lambda errors", example: 'aws account=production service=lambda mode=errors name=order-notification minutes=30' },
    ],
    configKey: "AWS_PROFILE",
    configExample: "acme-prod-readonly",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    description: "Pod status, events, logs from your clusters",
    icon: "Container",
    modes: [
      { name: "contexts", description: "List available k8s contexts", example: "kubernetes mode=contexts" },
      { name: "pods", description: "List pods in a namespace", example: "kubernetes mode=pods context=prod-us-east-1 namespace=orders" },
      { name: "logs", description: "Read pod logs", example: "kubernetes mode=logs context=prod name=order-service-abc123 previous=true" },
      { name: "events", description: "Cluster events (OOM, crashes)", example: "kubernetes mode=events context=prod namespace=orders" },
    ],
    configKey: "KUBECONFIG",
    configExample: "~/.kube/config",
  },
  {
    id: "jenkins",
    name: "CI/CD (Jenkins)",
    description: "Build status, test results, deploy history",
    icon: "Hammer",
    modes: [
      { name: "builds", description: "Recent builds for a job", example: "jenkins mode=builds path=orders/order-service limit=10" },
      { name: "tests", description: "Failed tests for a build", example: "jenkins mode=tests path=orders/order-service build=42" },
      { name: "changes", description: "Commits in a build", example: "jenkins mode=changes path=orders/order-service build=42" },
    ],
    configKey: "JENKINS_URL",
    configExample: "https://jenkins.acme.internal",
  },
  {
    id: "github",
    name: "GitHub",
    description: "PRs, code, CI checks, file contents",
    icon: "Github",
    modes: [
      { name: "prs", description: "List recent PRs", example: "github mode=prs repo=acme-corp/order-service" },
      { name: "checks", description: "CI check status for a PR", example: "github mode=checks repo=acme-corp/order-service pr=123" },
      { name: "file", description: "Read a file from GitHub", example: "github mode=file repo=acme-corp/order-service path=pom.xml" },
    ],
    configKey: "GITHUB_TOKEN",
    configExample: "ghp_xxxxxxxxxxxxxxxxxxxx",
  },
  {
    id: "opensearch",
    name: "Logs (OpenSearch)",
    description: "Search application logs across clusters",
    icon: "FileText",
    modes: [
      { name: "query", description: "Search logs", example: 'opensearch cluster=prod index=app-logs-* service=order-service query="NullPointerException" minutes=30' },
    ],
    configKey: "OPENSEARCH_CLUSTER",
    configExample: "https://logs.acme.internal:9200",
  },
  {
    id: "grafana",
    name: "Grafana",
    description: "Dashboard search, metric queries, panel rendering",
    icon: "BarChart3",
    modes: [
      { name: "search", description: "Find dashboards", example: 'grafana mode=search query="order service"' },
      { name: "query", description: "Run a Prometheus query", example: "grafana mode=query datasource_uid=prometheus expr=\"rate(http_requests_total[5m])\"" },
    ],
    configKey: "GRAFANA_URL",
    configExample: "https://grafana.acme.internal",
  },
  {
    id: "memory",
    name: "Memory",
    description: "Persistent knowledge vault across sessions",
    icon: "Brain",
    modes: [
      { name: "recall", description: "Search memory for a service", example: "memory mode=recall entity=order-service" },
      { name: "remember", description: "Store a verified finding", example: 'memory mode=remember path=profile.md entity=order-service confidence=verified' },
    ],
    configKey: "MEMORY_DIR",
    configExample: "~/.service-observatory/memory",
  },
];

// --- PLACEHOLDER YAML CONFIG (shown on setup page) --------------------------
export const placeholderConfig = `# ============================================================
# Service Observatory Configuration
# ============================================================
# Copy this to config/observatory.yaml and fill in your values.
# Lines starting with # are comments — delete or keep them.
# ============================================================

organization:
  name: "Acme Corp"                          # Your company name
  github_org: "acme-corp"                    # Your GitHub organization
  jira_base_url: "https://acme.atlassian.net" # Your Jira instance URL
  grafana_url: "https://grafana.acme.internal" # Your Grafana URL

# Where Service Observatory stores its data
data_dir: "~/.service-observatory"

# Neo4j graph database connection
neo4j:
  uri: bolt://localhost:7687               # Neo4j bolt URI
  user: neo4j                              # Neo4j username
  password: \${NEO4J_PASSWORD}               # Set via environment variable

# ---- Scanners ----
# Each scanner discovers a different type of data.
# Enable only what you need.

scanners:
  # Code scanner — parses Java/Kotlin/Python into graph nodes
  code:
    enabled: true
    repos:
      - acme-corp/order-service            # GitHub org/repo
      - acme-corp/payment-gateway
      - acme-corp/user-service
      - acme-corp/inventory-service
      - acme-corp/notification-service
      - acme-corp/search-service
      - acme-corp/analytics-service
      - acme-corp/api-gateway
    languages: [java, kotlin, python, typescript]
    annotations_to_track:
      - RestController
      - Service
      - Repository
      - SqsListener
      - KafkaListener
      - Scheduled

  # AWS scanner — discovers SQS, SNS, S3, RDS, Lambda, DynamoDB
  aws:
    enabled: true
    accounts:
      - id: "123456789012"
        alias: acme-production
        profile: acme-prod-readonly        # AWS CLI profile name
        regions: [us-east-1, eu-west-1]
      - id: "987654321098"
        alias: acme-staging
        profile: acme-staging-readonly
        regions: [us-east-1]
    services_to_scan: [sqs, sns, s3, rds, dynamodb, lambda]

  # Service registry — maps services to teams and accounts
  registry:
    enabled: true
    source: file                           # "file", "backstage", or "cortex"
    # If source is "backstage": url: "https://backstage.acme.internal"
    # If source is "cortex":    url: "https://api.cortex.dev"

  # Dependency scanner — Maven/Gradle/npm dependency trees
  dependencies:
    enabled: true

  # Schema scanner — Avro/Protobuf schemas
  schemas:
    enabled: false
    # registry_url: "https://schema-registry.acme.internal"
    # s3_path: "s3://acme-schemas/"

# ---- MCP Server ----
mcp:
  transport: stdio                         # "stdio" or "sse"
  # sse_port: 3001                         # Only if transport is "sse"
  tools:
    - graph
    - codesearch
    - aws
    - kubernetes
    - jenkins
    - github
    - jira
    - opensearch
    - grafana
    - memory

# ---- Memory ----
memory:
  enabled: true
  vault_dir: "~/.service-observatory/memory"
`;
