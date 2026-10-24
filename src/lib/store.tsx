"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Organization,
  Service,
  Team,
  AwsAccount,
  GraphEdge,
  Incident,
  CypherRecipe,
  McpTool,
  GitHubConnection,
} from "@/lib/types";
import {
  company,
  services as defaultServices,
  teams as defaultTeams,
  awsAccounts as defaultAwsAccounts,
  graphEdges as defaultGraphEdges,
  incidents as defaultIncidents,
  cypherRecipes as defaultCypherRecipes,
  mcpTools as defaultMcpTools,
  placeholderConfig as defaultPlaceholderConfig,
} from "@/data/placeholder";

// ============================================================================
// STATE
// ============================================================================

type StoreState = {
  organization: Organization;
  services: Service[];
  teams: Team[];
  awsAccounts: AwsAccount[];
  graphEdges: GraphEdge[];
  incidents: Incident[];
  connections: GitHubConnection[];
  cypherRecipes: CypherRecipe[];
  mcpTools: McpTool[];
  placeholderConfig: string;
  onboardingDone: boolean;
};

function buildDefaults(): StoreState {
  const uniqueRepos = [...new Set(defaultServices.map((s) => s.repo))];
  return {
    organization: {
      name: company.name,
      logo: company.logo,
      githubOrg: company.githubOrg,
      jiraBaseUrl: company.jiraBaseUrl,
      grafanaUrl: company.grafanaUrl,
      slackWorkspace: company.slackWorkspace,
    },
    services: defaultServices,
    teams: defaultTeams,
    awsAccounts: defaultAwsAccounts,
    graphEdges: defaultGraphEdges,
    incidents: defaultIncidents,
    connections: uniqueRepos.map((repo) => ({
      repo,
      connected: true,
      addedAt: new Date().toISOString(),
    })),
    cypherRecipes: defaultCypherRecipes,
    mcpTools: defaultMcpTools,
    placeholderConfig: defaultPlaceholderConfig,
    onboardingDone: false,
  };
}

const STORAGE_KEY = "service-observatory-store";

function loadFromStorage(): StoreState {
  if (typeof window === "undefined") return buildDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {
    // corrupt data — fall through to defaults
  }
  return buildDefaults();
}

function saveToStorage(state: StoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded — silently ignore
  }
}

// ============================================================================
// ACTIONS
// ============================================================================

type Action =
  | { type: "UPDATE_ORGANIZATION"; payload: Partial<Organization> }
  | { type: "ADD_SERVICE"; payload: Service }
  | { type: "UPDATE_SERVICE"; payload: { id: string; updates: Partial<Service> } }
  | { type: "DELETE_SERVICE"; payload: string }
  | { type: "ADD_TEAM"; payload: Team }
  | { type: "UPDATE_TEAM"; payload: { id: string; updates: Partial<Team> } }
  | { type: "DELETE_TEAM"; payload: string }
  | { type: "ADD_AWS_ACCOUNT"; payload: AwsAccount }
  | { type: "UPDATE_AWS_ACCOUNT"; payload: { id: string; updates: Partial<AwsAccount> } }
  | { type: "DELETE_AWS_ACCOUNT"; payload: string }
  | { type: "ADD_GRAPH_EDGE"; payload: GraphEdge }
  | { type: "DELETE_GRAPH_EDGE"; payload: { from: string; to: string; type: string } }
  | { type: "ADD_INCIDENT"; payload: Incident }
  | { type: "UPDATE_INCIDENT"; payload: { id: string; updates: Partial<Incident> } }
  | { type: "DELETE_INCIDENT"; payload: string }
  | { type: "ADD_CONNECTION"; payload: GitHubConnection }
  | { type: "REMOVE_CONNECTION"; payload: string }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "RESET_TO_DEMO" }
  | { type: "CLEAR_ALL_DATA" }
  | { type: "IMPORT_DATA"; payload: StoreState };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "UPDATE_ORGANIZATION":
      return { ...state, organization: { ...state.organization, ...action.payload } };
    case "ADD_SERVICE":
      return { ...state, services: [...state.services, action.payload] };
    case "UPDATE_SERVICE":
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };
    case "DELETE_SERVICE":
      return { ...state, services: state.services.filter((s) => s.id !== action.payload) };
    case "ADD_TEAM":
      return { ...state, teams: [...state.teams, action.payload] };
    case "UPDATE_TEAM":
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };
    case "DELETE_TEAM":
      return { ...state, teams: state.teams.filter((t) => t.id !== action.payload) };
    case "ADD_AWS_ACCOUNT":
      return { ...state, awsAccounts: [...state.awsAccounts, action.payload] };
    case "UPDATE_AWS_ACCOUNT":
      return {
        ...state,
        awsAccounts: state.awsAccounts.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };
    case "DELETE_AWS_ACCOUNT":
      return { ...state, awsAccounts: state.awsAccounts.filter((a) => a.id !== action.payload) };
    case "ADD_GRAPH_EDGE":
      return { ...state, graphEdges: [...state.graphEdges, action.payload] };
    case "DELETE_GRAPH_EDGE":
      return {
        ...state,
        graphEdges: state.graphEdges.filter(
          (e) =>
            !(e.from === action.payload.from && e.to === action.payload.to && e.type === action.payload.type)
        ),
      };
    case "ADD_INCIDENT":
      return { ...state, incidents: [...state.incidents, action.payload] };
    case "UPDATE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload.updates } : i
        ),
      };
    case "DELETE_INCIDENT":
      return { ...state, incidents: state.incidents.filter((i) => i.id !== action.payload) };
    case "ADD_CONNECTION":
      return { ...state, connections: [...state.connections, action.payload] };
    case "REMOVE_CONNECTION":
      return { ...state, connections: state.connections.filter((c) => c.repo !== action.payload) };
    case "COMPLETE_ONBOARDING":
      return { ...state, onboardingDone: true };
    case "RESET_TO_DEMO":
      return buildDefaults();
    case "CLEAR_ALL_DATA":
      return {
        ...buildDefaults(),
        services: [],
        teams: [],
        awsAccounts: [],
        graphEdges: [],
        incidents: [],
        connections: [],
        onboardingDone: false,
      };
    case "IMPORT_DATA":
      return action.payload;
    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

type StoreContextValue = StoreState & {
  updateOrganization: (updates: Partial<Organization>) => void;
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addAwsAccount: (account: AwsAccount) => void;
  updateAwsAccount: (id: string, updates: Partial<AwsAccount>) => void;
  deleteAwsAccount: (id: string) => void;
  addGraphEdge: (edge: GraphEdge) => void;
  deleteGraphEdge: (from: string, to: string, type: string) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  addConnection: (connection: GitHubConnection) => void;
  removeConnection: (repo: string) => void;
  completeOnboarding: () => void;
  resetToDemo: () => void;
  clearAllData: () => void;
  exportData: () => string;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);

  // Persist on every state change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const value: StoreContextValue = {
    ...state,
    updateOrganization: (updates) => dispatch({ type: "UPDATE_ORGANIZATION", payload: updates }),
    addService: (service) => dispatch({ type: "ADD_SERVICE", payload: service }),
    updateService: (id, updates) => dispatch({ type: "UPDATE_SERVICE", payload: { id, updates } }),
    deleteService: (id) => dispatch({ type: "DELETE_SERVICE", payload: id }),
    addTeam: (team) => dispatch({ type: "ADD_TEAM", payload: team }),
    updateTeam: (id, updates) => dispatch({ type: "UPDATE_TEAM", payload: { id, updates } }),
    deleteTeam: (id) => dispatch({ type: "DELETE_TEAM", payload: id }),
    addAwsAccount: (account) => dispatch({ type: "ADD_AWS_ACCOUNT", payload: account }),
    updateAwsAccount: (id, updates) => dispatch({ type: "UPDATE_AWS_ACCOUNT", payload: { id, updates } }),
    deleteAwsAccount: (id) => dispatch({ type: "DELETE_AWS_ACCOUNT", payload: id }),
    addGraphEdge: (edge) => dispatch({ type: "ADD_GRAPH_EDGE", payload: edge }),
    deleteGraphEdge: (from, to, type) => dispatch({ type: "DELETE_GRAPH_EDGE", payload: { from, to, type } }),
    addIncident: (incident) => dispatch({ type: "ADD_INCIDENT", payload: incident }),
    updateIncident: (id, updates) => dispatch({ type: "UPDATE_INCIDENT", payload: { id, updates } }),
    deleteIncident: (id) => dispatch({ type: "DELETE_INCIDENT", payload: id }),
    addConnection: (connection) => dispatch({ type: "ADD_CONNECTION", payload: connection }),
    removeConnection: (repo) => dispatch({ type: "REMOVE_CONNECTION", payload: repo }),
    completeOnboarding: () => dispatch({ type: "COMPLETE_ONBOARDING" }),
    resetToDemo: () => dispatch({ type: "RESET_TO_DEMO" }),
    clearAllData: () => dispatch({ type: "CLEAR_ALL_DATA" }),
    exportData: () => JSON.stringify(state, null, 2),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
