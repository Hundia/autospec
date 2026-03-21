import type { FlowStep, FlowConnection } from '../components/diagrams/FlowDiagram'
import type { Actor, Message, ActivationBar } from '../components/diagrams/SequenceDiagram'

// ── A. System Architecture (FlowDiagram, vertical) ──────────────────────────

export const architectureSteps: FlowStep[] = [
  { id: 'cli', label: 'CLI Commands', type: 'start', status: 'active', description: 'pilot start | list | attach | logs | kill' },
  { id: 'socket', label: 'Unix Socket IPC', type: 'process', status: 'complete', description: 'daemon.sock — newline-delimited JSON' },
  { id: 'daemon', label: 'Daemon Server', type: 'parallel', status: 'active', description: 'Background process — monitors, routes, notifies' },
  { id: 'monitor', label: 'Session Monitor', type: 'process', status: 'active', description: 'Polls tmux capture-pane every 2s' },
  { id: 'approval', label: 'Approval Engine', type: 'decision', status: 'active', description: 'Auto-approve or route to WhatsApp' },
  { id: 'whatsapp', label: 'WhatsApp Bot', type: 'process', status: 'complete', description: 'wwebjs self-chat — send/receive' },
  { id: 'tmux', label: 'tmux Sessions', type: 'parallel', status: 'active', description: 'Survive SSH disconnect' },
  { id: 'claude', label: 'Claude / Gemini / Copilot', type: 'end', status: 'active', description: 'AI provider running in tmux' },
]

export const architectureConnections: FlowConnection[] = [
  { from: 'cli', to: 'socket' },
  { from: 'socket', to: 'daemon' },
  { from: 'daemon', to: 'monitor' },
  { from: 'monitor', to: 'approval' },
  { from: 'approval', to: 'whatsapp', label: 'manual' },
  { from: 'approval', to: 'tmux', label: 'auto', condition: 'yes' },
  { from: 'whatsapp', to: 'tmux', label: 'Y/N/A' },
  { from: 'tmux', to: 'claude' },
]

// ── B. Approval Flow (SequenceDiagram) ──────────────────────────────────────

export const approvalActors: Actor[] = [
  { id: 'user', label: 'User', icon: '👤' },
  { id: 'pilot', label: 'Pilot CLI', icon: '✈️' },
  { id: 'daemon', label: 'Daemon', icon: '🔧' },
  { id: 'wa', label: 'WhatsApp', icon: '📱' },
  { id: 'tmux', label: 'tmux/Claude', icon: '🤖' },
]

export const approvalMessages: Message[] = [
  { from: 'user', to: 'pilot', label: 'pilot start task', type: 'sync' },
  { from: 'pilot', to: 'tmux', label: 'tmux new-session + claude ...', type: 'sync' },
  { from: 'tmux', to: 'tmux', label: 'Claude hits permission check', type: 'self' },
  { from: 'daemon', to: 'tmux', label: 'capture-pane detects prompt', type: 'sync' },
  { from: 'daemon', to: 'daemon', label: 'Classify risk: low/med/high', type: 'self' },
  { from: 'daemon', to: 'wa', label: '🔐 Permission Request', type: 'async' },
  { from: 'wa', to: 'user', label: 'Approve? Y/N/A', type: 'async', description: 'User sees notification on phone' },
  { from: 'user', to: 'wa', label: 'Y', type: 'sync' },
  { from: 'wa', to: 'daemon', label: 'approve', type: 'sync' },
  { from: 'daemon', to: 'tmux', label: 'send-keys "Y"', type: 'sync' },
  { from: 'tmux', to: 'tmux', label: 'Claude continues', type: 'self' },
  { from: 'daemon', to: 'wa', label: '✅ Approved', type: 'return' },
]

export const approvalActivations: ActivationBar[] = [
  { actor: 'daemon', startMsg: 3, endMsg: 11 },
  { actor: 'tmux', startMsg: 1, endMsg: 11 },
]

// ── C. Session Lifecycle (FlowDiagram, horizontal) ───────────────────────────

export const lifecycleSteps: FlowStep[] = [
  { id: 'launch', label: 'Launching', type: 'start', status: 'complete' },
  { id: 'running', label: 'Running', type: 'process', status: 'active' },
  { id: 'waiting', label: 'Waiting Approval', type: 'decision', status: 'pending' },
  { id: 'completed', label: 'Completed', type: 'end', status: 'complete' },
  { id: 'error', label: 'Error', type: 'end', status: 'error' },
  { id: 'killed', label: 'Killed', type: 'end', status: 'error' },
]

export const lifecycleConnections: FlowConnection[] = [
  { from: 'launch', to: 'running' },
  { from: 'running', to: 'waiting', label: 'permission prompt' },
  { from: 'waiting', to: 'running', label: 'approved', condition: 'yes' },
  { from: 'waiting', to: 'error', label: 'denied', condition: 'no' },
  { from: 'running', to: 'completed', label: 'done' },
  { from: 'running', to: 'error', label: 'crash' },
  { from: 'running', to: 'killed', label: 'user kill' },
]

// ── D. Provider Compatibility Matrix ────────────────────────────────────────

export interface ProviderRow {
  provider: string
  sessionId: boolean
  resume: boolean
  autoApprove: boolean
  skills: boolean
  model: boolean
  status: 'primary' | 'supported' | 'experimental'
}

export const providerMatrix: ProviderRow[] = [
  { provider: 'Claude Code', sessionId: true, resume: true, autoApprove: true, skills: true, model: true, status: 'primary' },
  { provider: 'Gemini CLI', sessionId: false, resume: false, autoApprove: false, skills: true, model: true, status: 'supported' },
  { provider: 'GitHub Copilot', sessionId: false, resume: false, autoApprove: false, skills: true, model: false, status: 'experimental' },
]
