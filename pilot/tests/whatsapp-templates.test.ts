import { describe, it, expect } from 'vitest';
import { renderTemplate, formatDuration } from '../src/whatsapp/whatsapp-templates.js';

describe('renderTemplate', () => {
  it('renders session_started', () => {
    const msg = renderTemplate('session_started', {
      name: 'sprint-42',
      prompt: '/sprint-run 7',
      cwd: '/opt/project',
    });
    expect(msg).toContain('sprint-42');
    expect(msg).toContain('/sprint-run 7');
    expect(msg).toContain('Session Started');
  });

  it('renders approval_request', () => {
    const msg = renderTemplate('approval_request', {
      name: 'sprint-42',
      tool: 'Bash',
      command: 'npm install lodash',
      risk: 'medium',
    });
    expect(msg).toContain('Bash');
    expect(msg).toContain('npm install lodash');
    expect(msg).toContain('Y approve');
  });

  it('preserves unmatched variables', () => {
    const msg = renderTemplate('session_completed', {
      name: 'test',
    });
    expect(msg).toContain('{duration}');
  });

  it('returns error for unknown template', () => {
    const msg = renderTemplate('nonexistent', {});
    expect(msg).toContain('Unknown template');
  });
});

describe('formatDuration', () => {
  it('formats minutes', () => {
    expect(formatDuration(300_000)).toBe('5m');
    expect(formatDuration(2_400_000)).toBe('40m');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3_720_000)).toBe('1h 2m');
    expect(formatDuration(7_200_000)).toBe('2h 0m');
  });
});
