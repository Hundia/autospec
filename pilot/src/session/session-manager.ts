import fs from 'fs-extra';
import path from 'path';
import { nanoid } from 'nanoid';
import { PILOT_HOME } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import type { PilotSession, SessionStatus, ApprovalRequest } from './session.types.js';

const SESSIONS_DIR = path.join(PILOT_HOME, 'sessions');
const APPROVALS_DIR = path.join(PILOT_HOME, 'approvals');

// --- Sessions ---

export async function createSession(opts: {
  name: string;
  prompt: string;
  cwd: string;
  tmuxSession: string;
  permissionMode?: 'default' | 'dontAsk' | 'auto';
  autoApprovePatterns?: string[];
}): Promise<PilotSession> {
  await fs.ensureDir(SESSIONS_DIR);

  const session: PilotSession = {
    id: nanoid(12),
    name: opts.name,
    prompt: opts.prompt,
    cwd: opts.cwd,
    tmuxSession: opts.tmuxSession,
    status: 'launching',
    permissionMode: opts.permissionMode ?? 'default',
    autoApprovePatterns: opts.autoApprovePatterns ?? [],
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    toolCallCount: 0,
    approvalCount: 0,
    errorCount: 0,
    lastOutput: '',
  };

  await saveSession(session);
  logger.info(`Session created: ${session.name} (${session.id})`);
  return session;
}

export async function saveSession(session: PilotSession): Promise<void> {
  await fs.ensureDir(SESSIONS_DIR);
  const filePath = path.join(SESSIONS_DIR, `${session.id}.json`);
  await fs.writeJson(filePath, session, { spaces: 2 });
}

export async function getSession(id: string): Promise<PilotSession | null> {
  const filePath = path.join(SESSIONS_DIR, `${id}.json`);
  if (!(await fs.pathExists(filePath))) return null;
  try {
    return await fs.readJson(filePath);
  } catch {
    return null;
  }
}

export async function getSessionByName(name: string): Promise<PilotSession | null> {
  const sessions = await listSessions();
  return sessions.find(s => s.name === name) ?? null;
}

export async function findSession(nameOrId: string): Promise<PilotSession | null> {
  // Try by ID first
  const byId = await getSession(nameOrId);
  if (byId) return byId;

  // Try by name
  return getSessionByName(nameOrId);
}

export async function listSessions(includeCompleted = false): Promise<PilotSession[]> {
  await fs.ensureDir(SESSIONS_DIR);
  const files = await fs.readdir(SESSIONS_DIR);
  const sessions: PilotSession[] = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const session = await fs.readJson(path.join(SESSIONS_DIR, file));
      if (includeCompleted || !['completed', 'killed', 'error'].includes(session.status)) {
        sessions.push(session);
      }
    } catch {
      // Skip corrupted files
    }
  }

  return sessions.sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateSessionStatus(id: string, status: SessionStatus, extra?: Partial<PilotSession>): Promise<PilotSession | null> {
  const session = await getSession(id);
  if (!session) return null;

  session.status = status;
  session.lastActivityAt = Date.now();

  if (status === 'running' && !session.startedAt) {
    session.startedAt = Date.now();
  }
  if (status === 'completed' || status === 'error' || status === 'killed') {
    session.completedAt = Date.now();
  }

  if (extra) {
    Object.assign(session, extra);
  }

  await saveSession(session);
  logger.info(`Session ${session.name} status: ${status}`);
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  const filePath = path.join(SESSIONS_DIR, `${id}.json`);
  await fs.remove(filePath);
}

// --- Approvals ---

export async function createApproval(opts: {
  sessionId: string;
  sessionName: string;
  tool: string;
  description: string;
  fullPrompt: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeoutMs: number;
}): Promise<ApprovalRequest> {
  await fs.ensureDir(APPROVALS_DIR);

  const approval: ApprovalRequest = {
    id: `apr-${nanoid(8)}`,
    sessionId: opts.sessionId,
    sessionName: opts.sessionName,
    tool: opts.tool,
    description: opts.description,
    fullPrompt: opts.fullPrompt,
    riskLevel: opts.riskLevel,
    status: 'pending',
    createdAt: Date.now(),
    timeoutAt: Date.now() + opts.timeoutMs,
  };

  await fs.writeJson(path.join(APPROVALS_DIR, `${approval.id}.json`), approval, { spaces: 2 });
  logger.info(`Approval created: ${approval.id} (${approval.tool}: ${approval.description})`);
  return approval;
}

export async function getApproval(id: string): Promise<ApprovalRequest | null> {
  const filePath = path.join(APPROVALS_DIR, `${id}.json`);
  if (!(await fs.pathExists(filePath))) return null;
  try {
    return await fs.readJson(filePath);
  } catch {
    return null;
  }
}

export async function listPendingApprovals(): Promise<ApprovalRequest[]> {
  await fs.ensureDir(APPROVALS_DIR);
  const files = await fs.readdir(APPROVALS_DIR);
  const approvals: ApprovalRequest[] = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const approval = await fs.readJson(path.join(APPROVALS_DIR, file));
      if (approval.status === 'pending') {
        approvals.push(approval);
      }
    } catch {
      // Skip
    }
  }

  return approvals.sort((a, b) => a.createdAt - b.createdAt);
}

export async function resolveApproval(
  id: string,
  response: 'Y' | 'N' | 'A',
  resolvedBy: ApprovalRequest['resolvedBy']
): Promise<ApprovalRequest | null> {
  const approval = await getApproval(id);
  if (!approval || approval.status !== 'pending') return null;

  approval.status = response === 'N' ? 'denied' : 'approved';
  approval.response = response;
  approval.resolvedAt = Date.now();
  approval.resolvedBy = resolvedBy;

  await fs.writeJson(path.join(APPROVALS_DIR, `${id}.json`), approval, { spaces: 2 });
  logger.info(`Approval ${id} resolved: ${response} by ${resolvedBy}`);
  return approval;
}
