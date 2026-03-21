import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import net from 'net';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { encodeMessage, decodeMessages } from '../src/ipc/protocol.js';
import type { DaemonRequest, DaemonResponse } from '../src/daemon/daemon.types.js';

// ---------------------------------------------------------------------------
// Helpers — we build a lightweight server/client using the protocol directly
// rather than importing createSocketServer/sendRequest (which use the
// module-level SOCKET_PATH constant). This gives us full control over the
// socket path and avoids side-effects on the real ~/.claude-pilot directory.
// ---------------------------------------------------------------------------

let tmpDir: string;
let socketPath: string;

function makeSocketPath(): string {
  return path.join(tmpDir, `test-${Date.now()}-${Math.random().toString(36).slice(2)}.sock`);
}

type Handler = (req: DaemonRequest) => Promise<DaemonResponse>;

function startServer(sockPath: string, handler: Handler): Promise<net.Server> {
  return new Promise((resolve, reject) => {
    // Clean up stale socket
    if (fs.existsSync(sockPath)) {
      fs.removeSync(sockPath);
    }

    const server = net.createServer((conn) => {
      let buffer = '';
      conn.on('data', async (data) => {
        buffer += data.toString();
        const { messages, remainder } = decodeMessages(buffer);
        buffer = remainder;
        for (const msg of messages) {
          try {
            const response = await handler(msg as DaemonRequest);
            conn.write(encodeMessage(response));
          } catch (err) {
            conn.write(encodeMessage({
              type: 'error',
              payload: { message: (err as Error).message, code: 'HANDLER_ERROR' },
            }));
          }
        }
      });
      conn.on('error', () => { /* client disconnected */ });
    });

    server.on('error', reject);
    server.listen(sockPath, () => resolve(server));
  });
}

function closeServer(server: net.Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}

function sendRawRequest(sockPath: string, request: DaemonRequest, timeoutMs = 5_000): Promise<DaemonResponse> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(sockPath)) {
      return reject(new Error('No socket file found'));
    }

    const client = net.createConnection(sockPath);
    let buffer = '';
    let done = false;

    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        client.destroy();
        reject(new Error('Request timed out'));
      }
    }, timeoutMs);

    client.on('connect', () => {
      client.write(encodeMessage(request));
    });

    client.on('data', (data) => {
      buffer += data.toString();
      const { messages } = decodeMessages(buffer);
      if (messages.length > 0 && !done) {
        done = true;
        clearTimeout(timer);
        client.destroy();
        resolve(messages[0] as DaemonResponse);
      }
    });

    client.on('error', (err) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        reject(new Error(`Connection error: ${err.message}`));
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('socket transport (integration)', () => {
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pilot-sock-test-'));
    socketPath = makeSocketPath();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('creates server and socket file exists', async () => {
    const server = await startServer(socketPath, async () => ({ type: 'pong' }));
    expect(fs.existsSync(socketPath)).toBe(true);
    await closeServer(server);
  });

  it('cleans up stale socket before binding', async () => {
    // Write a fake stale socket file
    await fs.writeFile(socketPath, 'stale');
    expect(fs.existsSync(socketPath)).toBe(true);

    // Starting the server should replace it
    const server = await startServer(socketPath, async () => ({ type: 'pong' }));
    expect(fs.existsSync(socketPath)).toBe(true);
    await closeServer(server);
  });

  it('handles ping -> pong', async () => {
    const server = await startServer(socketPath, async (req) => {
      if (req.type === 'ping') return { type: 'pong' };
      return { type: 'error', payload: { message: 'unknown', code: 'UNKNOWN' } };
    });

    const response = await sendRawRequest(socketPath, { type: 'ping' });
    expect(response.type).toBe('pong');

    await closeServer(server);
  });

  it('handles multiple sequential requests', async () => {
    let count = 0;
    const server = await startServer(socketPath, async (req) => {
      if (req.type === 'ping') {
        count++;
        return { type: 'pong' };
      }
      return { type: 'error', payload: { message: 'unknown', code: 'UNKNOWN' } };
    });

    await sendRawRequest(socketPath, { type: 'ping' });
    await sendRawRequest(socketPath, { type: 'ping' });
    await sendRawRequest(socketPath, { type: 'ping' });

    expect(count).toBe(3);
    await closeServer(server);
  });

  it('returns error response when handler throws', async () => {
    const server = await startServer(socketPath, async () => {
      throw new Error('handler exploded');
    });

    const response = await sendRawRequest(socketPath, { type: 'ping' });
    expect(response.type).toBe('error');
    const err = response as Extract<DaemonResponse, { type: 'error' }>;
    expect(err.payload.message).toBe('handler exploded');
    expect(err.payload.code).toBe('HANDLER_ERROR');

    await closeServer(server);
  });

  it('sendRawRequest rejects when no server is running', async () => {
    await expect(sendRawRequest(socketPath, { type: 'ping' }, 2_000)).rejects.toThrow();
  });

  it('sendRawRequest times out when server accepts connection but never replies', async () => {
    // Server that accepts but never writes back
    const connections: net.Socket[] = [];
    const silentServer = net.createServer((conn) => {
      connections.push(conn);
      // Intentionally silent — accept connection, never write
    });
    await new Promise<void>((resolve) => silentServer.listen(socketPath, resolve));

    // Use a 200ms timeout
    await expect(sendRawRequest(socketPath, { type: 'ping' }, 200)).rejects.toThrow('timed out');

    // Force-destroy all open connections so server.close() doesn't hang
    for (const conn of connections) {
      conn.destroy();
    }
    await closeServer(silentServer);
  }, 10_000);

  it('isDaemonRunning equivalent returns true when server is running', async () => {
    const server = await startServer(socketPath, async (req) => {
      if (req.type === 'ping') return { type: 'pong' };
      return { type: 'error', payload: { message: 'unknown', code: 'UNKNOWN' } };
    });

    // Replicate isDaemonRunning logic
    let running = false;
    try {
      const response = await sendRawRequest(socketPath, { type: 'ping' }, 3_000);
      running = response.type === 'pong';
    } catch {
      running = false;
    }

    expect(running).toBe(true);
    await closeServer(server);
  });

  it('isDaemonRunning equivalent returns false when no server', async () => {
    let running = false;
    try {
      const response = await sendRawRequest(socketPath, { type: 'ping' }, 1_000);
      running = response.type === 'pong';
    } catch {
      running = false;
    }

    expect(running).toBe(false);
  });

  it('server delivers correct status response', async () => {
    const server = await startServer(socketPath, async (req) => {
      if (req.type === 'status') {
        return {
          type: 'status',
          payload: {
            pid: process.pid,
            uptime: 42,
            activeSessions: 0,
            pendingApprovals: 0,
            whatsappConnected: false,
          },
        };
      }
      return { type: 'error', payload: { message: 'unknown', code: 'UNKNOWN' } };
    });

    const response = await sendRawRequest(socketPath, { type: 'status' });
    expect(response.type).toBe('status');
    const status = response as Extract<DaemonResponse, { type: 'status' }>;
    expect(status.payload.pid).toBe(process.pid);
    expect(status.payload.uptime).toBe(42);

    await closeServer(server);
  });

  it('handles large payload round-trip', async () => {
    const bigPrompt = 'x'.repeat(10_000);
    const server = await startServer(socketPath, async (req) => {
      if (req.type === 'session.create') {
        // Echo back the prompt length
        return {
          type: 'error',
          payload: { message: `received:${req.payload.prompt.length}`, code: 'ECHO' },
        };
      }
      return { type: 'error', payload: { message: 'unknown', code: 'UNKNOWN' } };
    });

    const response = await sendRawRequest(socketPath, {
      type: 'session.create',
      payload: { prompt: bigPrompt, cwd: '/tmp', name: 'big' },
    });
    expect(response.type).toBe('error');
    const err = response as Extract<DaemonResponse, { type: 'error' }>;
    expect(err.payload.message).toBe(`received:${bigPrompt.length}`);

    await closeServer(server);
  });
});
