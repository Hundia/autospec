import type { PilotSession, ApprovalRequest } from '../session/session.types.js';

// Client → Daemon requests
export type DaemonRequest =
  | { type: 'session.create'; payload: { name?: string; prompt: string; cwd: string; autoApprove?: boolean; approveReads?: boolean; skill?: string; resume?: string; model?: string } }
  | { type: 'session.kill'; payload: { nameOrId: string; force?: boolean } }
  | { type: 'session.list'; payload?: { all?: boolean } }
  | { type: 'approval.respond'; payload: { approvalId: string; response: 'Y' | 'N' | 'A' } }
  | { type: 'status' }
  | { type: 'ping' };

// Daemon → Client responses
export type DaemonResponse =
  | { type: 'session.created'; payload: PilotSession }
  | { type: 'session.killed'; payload: { sessionId: string } }
  | { type: 'session.list'; payload: PilotSession[] }
  | { type: 'approval.responded'; payload: ApprovalRequest }
  | { type: 'status'; payload: DaemonStatus }
  | { type: 'pong' }
  | { type: 'error'; payload: { message: string; code: string } };

// Push events (daemon → connected clients)
export type DaemonEvent =
  | { type: 'session.updated'; payload: PilotSession }
  | { type: 'approval.new'; payload: ApprovalRequest }
  | { type: 'approval.resolved'; payload: ApprovalRequest }
  | { type: 'whatsapp.status'; payload: { connected: boolean } };

export interface DaemonStatus {
  pid: number;
  uptime: number;
  activeSessions: number;
  pendingApprovals: number;
  whatsappConnected: boolean;
}
