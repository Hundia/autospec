import { describe, it, expect } from 'vitest';
import { encodeMessage, decodeMessages } from '../src/ipc/protocol.js';
import type { DaemonRequest, DaemonResponse } from '../src/daemon/daemon.types.js';

// ---------------------------------------------------------------------------
// encodeMessage
// ---------------------------------------------------------------------------

describe('encodeMessage', () => {
  it('serializes to JSON followed by a newline delimiter', () => {
    const msg: DaemonRequest = { type: 'ping' };
    const encoded = encodeMessage(msg);
    expect(encoded).toBe('{"type":"ping"}\n');
  });

  it('handles nested payloads', () => {
    const msg: DaemonRequest = {
      type: 'session.create',
      payload: { prompt: 'do the thing', cwd: '/tmp', name: 'my-session' },
    };
    const encoded = encodeMessage(msg);
    expect(encoded.endsWith('\n')).toBe(true);
    const parsed = JSON.parse(encoded.trim());
    expect(parsed.type).toBe('session.create');
    expect(parsed.payload.prompt).toBe('do the thing');
    expect(parsed.payload.cwd).toBe('/tmp');
  });

  it('handles a ping request message', () => {
    const msg: DaemonRequest = { type: 'ping' };
    const encoded = encodeMessage(msg);
    const parsed = JSON.parse(encoded.trim());
    expect(parsed.type).toBe('ping');
  });
});

// ---------------------------------------------------------------------------
// decodeMessages
// ---------------------------------------------------------------------------

describe('decodeMessages', () => {
  it('decodes a single complete message', () => {
    const msg: DaemonResponse = { type: 'pong' };
    const buffer = JSON.stringify(msg) + '\n';
    const { messages, remainder } = decodeMessages(buffer);
    expect(messages).toHaveLength(1);
    expect((messages[0] as DaemonResponse).type).toBe('pong');
    expect(remainder).toBe('');
  });

  it('decodes multiple messages in one buffer', () => {
    const m1: DaemonResponse = { type: 'pong' };
    const m2: DaemonRequest = { type: 'ping' };
    const buffer = JSON.stringify(m1) + '\n' + JSON.stringify(m2) + '\n';
    const { messages } = decodeMessages(buffer);
    expect(messages).toHaveLength(2);
    expect((messages[0] as DaemonResponse).type).toBe('pong');
    expect((messages[1] as DaemonRequest).type).toBe('ping');
  });

  it('returns remainder for an incomplete message', () => {
    const partial = '{"type":"pong"';
    const { messages, remainder } = decodeMessages(partial);
    expect(messages).toHaveLength(0);
    expect(remainder).toBe('{"type":"pong"');
  });

  it('returns empty remainder when buffer ends with newline', () => {
    const msg: DaemonResponse = { type: 'pong' };
    const buffer = JSON.stringify(msg) + '\n';
    const { remainder } = decodeMessages(buffer);
    expect(remainder).toBe('');
  });

  it('skips empty lines without throwing', () => {
    const msg: DaemonResponse = { type: 'pong' };
    const buffer = '\n\n' + JSON.stringify(msg) + '\n\n';
    const { messages } = decodeMessages(buffer);
    expect(messages).toHaveLength(1);
    expect((messages[0] as DaemonResponse).type).toBe('pong');
  });

  it('skips malformed JSON without throwing', () => {
    const bad = 'not-valid-json\n';
    const good = JSON.stringify({ type: 'pong' } as DaemonResponse) + '\n';
    const { messages } = decodeMessages(bad + good);
    expect(messages).toHaveLength(1);
    expect((messages[0] as DaemonResponse).type).toBe('pong');
  });

  it('handles empty buffer', () => {
    const { messages, remainder } = decodeMessages('');
    expect(messages).toHaveLength(0);
    expect(remainder).toBe('');
  });

  it('round-trips encode -> decode', () => {
    const original: DaemonRequest = {
      type: 'session.create',
      payload: { prompt: 'hello', cwd: '/home/user', name: 'test' },
    };
    const encoded = encodeMessage(original);
    const { messages } = decodeMessages(encoded);
    expect(messages).toHaveLength(1);
    const decoded = messages[0] as DaemonRequest & { type: 'session.create' };
    expect(decoded.type).toBe('session.create');
    expect(decoded.payload.prompt).toBe('hello');
    expect(decoded.payload.cwd).toBe('/home/user');
  });

  it('handles fragmented message across two calls', () => {
    const msg: DaemonResponse = { type: 'pong' };
    const full = JSON.stringify(msg) + '\n';

    // First fragment: first half, no newline yet
    const half = Math.floor(full.length / 2);
    const fragment1 = full.slice(0, half);
    const fragment2 = full.slice(half);

    const { messages: m1, remainder: r1 } = decodeMessages(fragment1);
    expect(m1).toHaveLength(0);
    expect(r1).toBe(fragment1);

    // Append second fragment
    const { messages: m2, remainder: r2 } = decodeMessages(r1 + fragment2);
    expect(m2).toHaveLength(1);
    expect((m2[0] as DaemonResponse).type).toBe('pong');
    expect(r2).toBe('');
  });
});
