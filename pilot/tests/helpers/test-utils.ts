import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import type { PilotSession, ApprovalRequest } from '../../src/session/session.types.js';

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const TMUX_TEST_PREFIX = 'pilot-test-';

export function validUUID(): string {
  return crypto.randomUUID();
}

export async function createTempPilotHome(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-test-'));
  await fs.ensureDir(path.join(dir, 'sessions'));
  await fs.ensureDir(path.join(dir, 'approvals'));
  await fs.ensureDir(path.join(dir, 'logs'));
  await fs.ensureDir(path.join(dir, 'whatsapp'));

  return {
    dir,
    cleanup: async () => {
      await fs.remove(dir);
    },
  };
}

export function createMockSession(overrides: Partial<PilotSession> = {}): PilotSession {
  return {
    id: 'test-session-id',
    name: 'test-session',
    prompt: 'test prompt',
    cwd: '/tmp/test',
    tmuxSession: `${TMUX_TEST_PREFIX}test-session`,
    status: 'running',
    permissionMode: 'default',
    autoApprovePatterns: [],
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    toolCallCount: 0,
    approvalCount: 0,
    errorCount: 0,
    lastOutput: '',
    ...overrides,
  };
}

export function createMockApproval(overrides: Partial<ApprovalRequest> = {}): ApprovalRequest {
  return {
    id: 'apr-test1234',
    sessionId: 'test-session-id',
    sessionName: 'test-session',
    tool: 'Bash',
    description: 'npm install lodash',
    fullPrompt: 'Allow Bash: npm install lodash (Y/n)',
    riskLevel: 'medium',
    status: 'pending',
    createdAt: Date.now(),
    timeoutAt: Date.now() + 300_000,
    ...overrides,
  };
}

export function createMockConfig(overrides: Record<string, unknown> = {}) {
  return {
    defaultPermissionMode: 'default' as const,
    approvalTimeoutMs: 300_000,
    defaultTimeoutAction: 'deny' as const,
    autoApprovePatterns: [] as string[],
    autoApproveLowRisk: false,
    maxConcurrentSessions: 5,
    claudePath: 'claude',
    defaultModel: '',
    fallbackModel: '',
    provider: { default: '', claudePath: 'claude', geminiPath: 'gemini' },
    tmuxSessionPrefix: TMUX_TEST_PREFIX,
    scrollbackLimit: 100_000,
    whatsapp: {
      enabled: false,
      mock: false,
      selfChatOnly: true,
      notifyOnStart: true,
      notifyOnComplete: true,
      notifyOnError: true,
      approvalViaWhatsApp: true,
    },
    redis: { url: 'redis://localhost:6379', keyPrefix: 'pilot:', db: 2 },
    logRetentionDays: 7,
    logLevel: 'info' as const,
    tui: { refreshIntervalMs: 2_000, logLines: 15 },
    ...overrides,
  };
}
