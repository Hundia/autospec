export type SessionStatus =
  | 'launching'
  | 'running'
  | 'waiting_approval'
  | 'completed'
  | 'error'
  | 'killed';

export interface PilotSession {
  id: string;
  name: string;
  prompt: string;
  cwd: string;
  claudeSessionId?: string;
  tmuxSession: string;

  status: SessionStatus;

  permissionMode: 'default' | 'dontAsk' | 'auto';
  autoApprovePatterns: string[];

  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  lastActivityAt: number;

  toolCallCount: number;
  approvalCount: number;
  errorCount: number;
  lastOutput: string;

  summary?: string;
  filesModified?: string[];
  exitCode?: number;
}

export interface ApprovalRequest {
  id: string;
  sessionId: string;
  sessionName: string;

  tool: string;
  description: string;
  fullPrompt: string;
  riskLevel: 'low' | 'medium' | 'high';

  status: 'pending' | 'approved' | 'denied' | 'timeout' | 'auto_approved';

  createdAt: number;
  timeoutAt: number;
  resolvedAt?: number;
  resolvedBy?: 'whatsapp' | 'tui' | 'cli' | 'auto' | 'timeout';

  response?: 'Y' | 'N' | 'A';
}
