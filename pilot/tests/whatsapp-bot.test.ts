import { describe, it, expect } from 'vitest';
import { parseCommand } from '../src/whatsapp/whatsapp-bot.js';

describe('parseCommand', () => {
  it('parses approval responses', () => {
    expect(parseCommand('Y')).toEqual({ type: 'approve' });
    expect(parseCommand('y')).toEqual({ type: 'approve' });
    expect(parseCommand('yes')).toEqual({ type: 'approve' });
    expect(parseCommand('approve')).toEqual({ type: 'approve' });
    expect(parseCommand('כן')).toEqual({ type: 'approve' });
  });

  it('parses denial responses', () => {
    expect(parseCommand('N')).toEqual({ type: 'deny' });
    expect(parseCommand('n')).toEqual({ type: 'deny' });
    expect(parseCommand('no')).toEqual({ type: 'deny' });
    expect(parseCommand('deny')).toEqual({ type: 'deny' });
    expect(parseCommand('לא')).toEqual({ type: 'deny' });
  });

  it('parses always responses', () => {
    expect(parseCommand('A')).toEqual({ type: 'always' });
    expect(parseCommand('always')).toEqual({ type: 'always' });
    expect(parseCommand('תמיד')).toEqual({ type: 'always' });
  });

  it('parses targeted approval', () => {
    expect(parseCommand('approve apr-abc123')).toEqual({ type: 'approve', approvalId: 'apr-abc123' });
    expect(parseCommand('deny apr-xyz789')).toEqual({ type: 'deny', approvalId: 'apr-xyz789' });
  });

  it('parses status and list', () => {
    expect(parseCommand('status')).toEqual({ type: 'status' });
    expect(parseCommand('list')).toEqual({ type: 'list' });
    expect(parseCommand('sessions')).toEqual({ type: 'list' });
  });

  it('parses kill and logs', () => {
    expect(parseCommand('kill sprint-42')).toEqual({ type: 'kill', sessionName: 'sprint-42' });
    expect(parseCommand('logs sprint-42')).toEqual({ type: 'logs', sessionName: 'sprint-42' });
  });

  it('parses help', () => {
    expect(parseCommand('help')).toEqual({ type: 'help' });
    expect(parseCommand('?')).toEqual({ type: 'help' });
    expect(parseCommand('עזרה')).toEqual({ type: 'help' });
  });

  it('returns unknown for unrecognized', () => {
    expect(parseCommand('hello world')).toEqual({ type: 'unknown', raw: 'hello world' });
  });
});
