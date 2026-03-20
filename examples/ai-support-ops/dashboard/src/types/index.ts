// Core data types for AutoSpec Dashboard

export type TicketStatus = 'todo' | 'in-progress' | 'qa-review' | 'done' | 'blocked';
export type ModelTier = 'haiku' | 'sonnet' | 'opus';
export type AgentRole = 'backend' | 'frontend' | 'db' | 'qa' | 'devops' | 'fullstack';

export interface Ticket {
  id: string;
  sprintId: number;
  title: string;
  description?: string;
  status: TicketStatus;
  owner: AgentRole;
  model: ModelTier;
  storyPoints: number;
  dependencies: string[];
  // Execution tracking
  agent?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // minutes
  promptHash?: string;
  // Visualization
  relatedScreens?: string[];
  relatedSpecs?: string[];
}

export interface Sprint {
  id: number;
  name: string;
  goal: string;
  status: 'planning' | 'active' | 'completed';
  startDate?: string;
  endDate?: string;
  tickets: Ticket[];
  // Metrics
  totalPoints: number;
  completedPoints: number;
  velocity?: number;
}

export interface AgentSession {
  id: string;
  name: string;
  role: AgentRole;
  status: 'idle' | 'running' | 'completed' | 'error';
  currentTicket?: string;
  startedAt?: string;
  ticketsCompleted: string[];
  model: ModelTier;
}

export interface ExecutionLog {
  timestamp: string;
  event: 'ticket_started' | 'ticket_completed' | 'agent_started' | 'agent_stopped' | 'sync_point';
  ticketId?: string;
  agentId?: string;
  details?: Record<string, unknown>;
}

export interface SprintSummary {
  sprintId: number;
  duration: {
    startedAt: string;
    completedAt: string;
    totalHours: number;
  };
  agents: {
    count: number;
    parallelization: number; // percentage time savings
    sessions: AgentSession[];
  };
  models: {
    haiku: { count: number; percentage: number };
    sonnet: { count: number; percentage: number };
    opus: { count: number; percentage: number };
  };
  tickets: {
    total: number;
    completed: number;
    blocked: number;
  };
  points: {
    planned: number;
    completed: number;
    velocity: number;
  };
  prompts: PromptRecord[];
  timeline: ExecutionLog[];
}

export interface PromptRecord {
  hash: string;
  ticketId: string;
  agentId: string;
  timestamp: string;
  content: string;
  model: ModelTier;
}

export interface BurndownDataPoint {
  date: string;
  remaining: number;
  ideal: number;
  completed: number;
}

export interface ScreenSpec {
  id: string;
  name: string;
  route?: string;
  wireframe?: string;
  description?: string;
  relatedTickets: string[];
}

export interface ProjectState {
  name: string;
  currentSprint: number;
  sprints: Sprint[];
  agents: AgentSession[];
  screens: ScreenSpec[];
  recentActivity: ExecutionLog[];
}

// WebSocket message types
export type WSMessageType =
  | 'state_update'
  | 'ticket_update'
  | 'agent_update'
  | 'sprint_update'
  | 'log_entry';

export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
  timestamp: string;
}
