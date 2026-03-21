import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockSession, createMockApproval, createMockConfig } from './helpers/test-utils.js';

// ─── Mock all external modules before importing WhatsAppNotifier ──────────

vi.mock('../src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Mock the WhatsAppClient so we never spin up puppeteer
const mockSendMessage = vi.fn().mockResolvedValue(undefined);
const mockInitialize = vi.fn().mockResolvedValue(undefined);
const mockOnMessage = vi.fn();
const mockGetStatus = vi.fn().mockReturnValue({ connected: true, mock: true });
const mockDestroy = vi.fn().mockResolvedValue(undefined);

vi.mock('../src/whatsapp/whatsapp-client.js', () => ({
  WhatsAppClient: vi.fn().mockImplementation(() => ({
    initialize: mockInitialize,
    onMessage: mockOnMessage,
    sendMessage: mockSendMessage,
    getStatus: mockGetStatus,
    destroy: mockDestroy,
  })),
}));

vi.mock('../src/session/session-manager.js', () => ({
  listSessions: vi.fn(),
  listPendingApprovals: vi.fn(),
  updateSessionStatus: vi.fn(),
  findSession: vi.fn(),
}));

vi.mock('../src/daemon/approval-engine.js', () => ({
  respondToApproval: vi.fn(),
}));

vi.mock('../src/utils/tmux.js', () => ({
  sessionExists: vi.fn(),
  capturePaneOutput: vi.fn(),
  destroySession: vi.fn(),
}));

import { WhatsAppNotifier } from '../src/whatsapp/whatsapp-notifier.js';
import * as sessionManager from '../src/session/session-manager.js';
import { respondToApproval } from '../src/daemon/approval-engine.js';
import * as tmux from '../src/utils/tmux.js';

// Helper: grab the message handler that was registered with onMessage
function getMessageHandler(): (body: string) => Promise<string | null> {
  // mockOnMessage.mock.calls[0][0] is the handler passed to client.onMessage(handler)
  return mockOnMessage.mock.calls[0][0] as (body: string) => Promise<string | null>;
}

describe('WhatsAppNotifier notifications', () => {
  let notifier: WhatsAppNotifier;
  const session = createMockSession({
    startedAt: Date.now() - 60_000,
    completedAt: Date.now(),
    toolCallCount: 5,
    lastOutput: 'All done.',
  });
  const approval = createMockApproval();

  beforeEach(async () => {
    vi.clearAllMocks();
    const config = createMockConfig({
      whatsapp: {
        enabled: true,
        mock: true,
        selfChatOnly: true,
        notifyOnStart: true,
        notifyOnComplete: true,
        notifyOnError: true,
        approvalViaWhatsApp: true,
      },
    });
    notifier = new WhatsAppNotifier(config as never);
    await notifier.initialize();
  });

  afterEach(async () => {
    await notifier.destroy();
    vi.clearAllMocks();
  });

  it('sends session_started when notifyOnStart=true', async () => {
    await notifier.notifySessionStarted(session);
    expect(mockSendMessage).toHaveBeenCalledOnce();
    expect(mockSendMessage.mock.calls[0][0]).toContain(session.name);
  });

  it('skips when notifyOnStart=false', async () => {
    const cfg = createMockConfig({
      whatsapp: {
        enabled: true,
        mock: true,
        selfChatOnly: true,
        notifyOnStart: false,
        notifyOnComplete: true,
        notifyOnError: true,
        approvalViaWhatsApp: true,
      },
    });
    const n2 = new WhatsAppNotifier(cfg as never);
    await n2.initialize();
    await n2.notifySessionStarted(session);
    expect(mockSendMessage).not.toHaveBeenCalled();
    await n2.destroy();
  });

  it('sends session_completed with duration', async () => {
    const completedSession = createMockSession({
      startedAt: Date.now() - 120_000,
      completedAt: Date.now(),
      toolCallCount: 7,
      summary: 'Refactored auth module',
    });
    await notifier.notifySessionCompleted(completedSession);
    expect(mockSendMessage).toHaveBeenCalledOnce();
    const msg = mockSendMessage.mock.calls[0][0] as string;
    expect(msg).toContain(completedSession.name);
    expect(msg).toMatch(/\d+m/); // duration formatted
  });

  it('sends session_error with error text', async () => {
    const errorSession = createMockSession({ lastOutput: 'Something exploded.' });
    await notifier.notifySessionError(errorSession);
    expect(mockSendMessage).toHaveBeenCalledOnce();
    const msg = mockSendMessage.mock.calls[0][0] as string;
    expect(msg).toContain('Something exploded.');
  });

  it('sends approval_request with tool/command', async () => {
    await notifier.notifyApprovalNeeded(approval, session);
    expect(mockSendMessage).toHaveBeenCalledOnce();
    const msg = mockSendMessage.mock.calls[0][0] as string;
    expect(msg).toContain(approval.tool);
    expect(msg).toContain(approval.description);
  });

  it('truncates long text', async () => {
    const longPrompt = 'x'.repeat(500);
    const s = createMockSession({ prompt: longPrompt });
    await notifier.notifySessionStarted(s);
    const msg = mockSendMessage.mock.calls[0][0] as string;
    // prompt is substring(0, 100) — message should not contain the full 500-char prompt
    expect(msg.length).toBeLessThan(400);
  });
});

describe('WhatsAppNotifier incoming messages', () => {
  let notifier: WhatsAppNotifier;
  const session = createMockSession();
  const approval = createMockApproval({ status: 'pending' });

  beforeEach(async () => {
    vi.clearAllMocks();
    const config = createMockConfig({
      whatsapp: {
        enabled: true,
        mock: true,
        selfChatOnly: true,
        notifyOnStart: true,
        notifyOnComplete: true,
        notifyOnError: true,
        approvalViaWhatsApp: true,
      },
    });
    notifier = new WhatsAppNotifier(config as never);
    await notifier.initialize();

    vi.mocked(sessionManager.listPendingApprovals).mockResolvedValue([approval]);
    vi.mocked(sessionManager.listSessions).mockResolvedValue([session]);
    vi.mocked(sessionManager.findSession).mockResolvedValue(session);
    vi.mocked(respondToApproval).mockResolvedValue({ ...approval, status: 'approved', response: 'Y' });
    vi.mocked(tmux.sessionExists).mockReturnValue(true);
    vi.mocked(tmux.capturePaneOutput).mockReturnValue('last 10 lines of output');
    vi.mocked(sessionManager.updateSessionStatus).mockResolvedValue(null);
  });

  afterEach(async () => {
    await notifier.destroy();
    vi.clearAllMocks();
  });

  it('Y response approves latest pending', async () => {
    const handler = getMessageHandler();
    const reply = await handler('Y');
    expect(vi.mocked(respondToApproval)).toHaveBeenCalledWith(approval.id, 'Y', 'whatsapp');
    expect(reply).toContain('Approved');
  });

  it('N response denies latest', async () => {
    vi.mocked(respondToApproval).mockResolvedValue({ ...approval, status: 'denied', response: 'N' });
    const handler = getMessageHandler();
    const reply = await handler('N');
    expect(vi.mocked(respondToApproval)).toHaveBeenCalledWith(approval.id, 'N', 'whatsapp');
    expect(reply).toContain('Denied');
  });

  it('A response always-approves', async () => {
    vi.mocked(respondToApproval).mockResolvedValue({ ...approval, status: 'approved', response: 'A' });
    const handler = getMessageHandler();
    const reply = await handler('A');
    expect(vi.mocked(respondToApproval)).toHaveBeenCalledWith(approval.id, 'A', 'whatsapp');
    expect(reply).toContain('Always approved');
  });

  it('targeted approve with apr-xxx ID', async () => {
    const specific = createMockApproval({ id: 'apr-specific', status: 'pending' });
    vi.mocked(sessionManager.listPendingApprovals).mockResolvedValue([approval, specific]);
    vi.mocked(respondToApproval).mockResolvedValue({ ...specific, status: 'approved', response: 'Y' });

    const handler = getMessageHandler();
    const reply = await handler('approve apr-specific');
    expect(vi.mocked(respondToApproval)).toHaveBeenCalledWith('apr-specific', 'Y', 'whatsapp');
    expect(reply).not.toBeNull();
  });

  it('status returns session count', async () => {
    vi.mocked(sessionManager.listPendingApprovals).mockResolvedValue([]);
    const handler = getMessageHandler();
    const reply = await handler('status');
    expect(reply).toContain('Status');
    expect(reply).toContain('Active sessions');
    expect(reply).toContain('Pending approvals');
  });

  it('list returns session names', async () => {
    const handler = getMessageHandler();
    const reply = await handler('list');
    expect(reply).toContain(session.name);
  });

  it('kill command kills session', async () => {
    const handler = getMessageHandler();
    const reply = await handler(`kill ${session.name}`);
    expect(vi.mocked(sessionManager.updateSessionStatus)).toHaveBeenCalledWith(session.id, 'killed');
    expect(reply).toContain('Killed');
  });

  it('logs command returns pane output', async () => {
    const handler = getMessageHandler();
    const reply = await handler(`logs ${session.name}`);
    expect(vi.mocked(tmux.capturePaneOutput)).toHaveBeenCalled();
    expect(reply).toContain('last 10 lines of output');
  });

  it('help returns help text', async () => {
    const handler = getMessageHandler();
    const reply = await handler('help');
    expect(reply).not.toBeNull();
    expect(reply).toContain('Claude Pilot');
  });

  it('unknown returns null', async () => {
    const handler = getMessageHandler();
    const reply = await handler('gibberish xyz 123');
    expect(reply).toBeNull();
  });

  it('no pending approvals message', async () => {
    vi.mocked(sessionManager.listPendingApprovals).mockResolvedValue([]);
    const handler = getMessageHandler();
    const reply = await handler('Y');
    expect(reply).toBe('No pending approvals.');
  });
});
