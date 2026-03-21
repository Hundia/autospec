import { describe, it, expect } from 'vitest';
import { parseOutput, classifyRisk } from '../src/session/session-parser.js';

describe('parseOutput', () => {
  it('detects permission prompts', () => {
    const output = `Reading files...
Analyzing code...
Allow Bash: rm -rf node_modules (Y/n)`;

    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('Bash');
    expect(result.permission?.description).toBe('rm -rf node_modules');
  });

  it('detects Edit permission prompts', () => {
    const output = `Working on changes...
Allow Edit: src/index.ts (Y/n)`;

    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('Edit');
  });

  it('detects Write permission prompts', () => {
    const output = `Allow Write: new-file.ts (Y/n)`;

    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('Write');
  });

  it('returns running for normal output', () => {
    const output = `Reading src/components/Header.tsx
Editing line 42...
Build successful`;

    const result = parseOutput(output);
    expect(result.type).toBe('running');
    expect(result.lastLine).toBe('Build successful');
  });

  it('returns idle for empty output', () => {
    expect(parseOutput('').type).toBe('idle');
    expect(parseOutput('  \n  ').type).toBe('idle');
  });

  it('detects errors', () => {
    const output = `Running build...
Error: Cannot find module 'lodash'`;

    const result = parseOutput(output);
    expect(result.type).toBe('error');
  });
});

describe('classifyRisk', () => {
  it('classifies destructive bash as high', () => {
    expect(classifyRisk('Bash', 'rm -rf node_modules')).toBe('high');
    expect(classifyRisk('Bash', 'git push --force origin main')).toBe('high');
    expect(classifyRisk('Bash', 'git reset --hard HEAD~1')).toBe('high');
  });

  it('classifies reads as low', () => {
    expect(classifyRisk('Read', 'src/index.ts')).toBe('low');
    expect(classifyRisk('Glob', '**/*.ts')).toBe('low');
    expect(classifyRisk('Grep', 'function')).toBe('low');
  });

  it('classifies simple bash as low', () => {
    expect(classifyRisk('Bash', 'ls -la')).toBe('low');
    expect(classifyRisk('Bash', 'git status')).toBe('low');
    expect(classifyRisk('Bash', 'git log --oneline')).toBe('low');
  });

  it('classifies writes as medium', () => {
    expect(classifyRisk('Write', 'new-file.ts')).toBe('medium');
    expect(classifyRisk('Edit', 'src/index.ts')).toBe('medium');
  });

  it('classifies installs as medium', () => {
    expect(classifyRisk('Bash', 'npm install lodash')).toBe('medium');
  });
});

// ─── Extended parseOutput tests ────────────────────────────────────────────

describe('parseOutput - extended', () => {
  it('detects WebFetch permission prompt', () => {
    const output = 'Allow WebFetch: https://example.com (Y/n)';
    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('WebFetch');
  });

  it('detects WebSearch permission prompt', () => {
    const output = 'Allow WebSearch: typescript generics (Y/n)';
    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('WebSearch');
  });

  it('detects Agent permission prompt', () => {
    const output = 'Allow Agent: sub-task spawned (Y/n)';
    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('Agent');
  });

  it('detects NotebookEdit permission prompt', () => {
    const output = 'Allow NotebookEdit: notebook.ipynb (Y/n)';
    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('NotebookEdit');
  });

  it('handles multi-line output before prompt', () => {
    const output = [
      'Processing file 1...',
      'Processing file 2...',
      'Almost done...',
      'Allow Bash: git diff (Y/n)',
    ].join('\n');
    const result = parseOutput(output);
    expect(result.type).toBe('permission_prompt');
    expect(result.permission?.tool).toBe('Bash');
  });

  it('detects FATAL errors', () => {
    const output = 'Starting session...\nFATAL: out of memory';
    const result = parseOutput(output);
    expect(result.type).toBe('error');
  });

  it('detects panic errors', () => {
    const output = 'panic: runtime error: index out of range';
    const result = parseOutput(output);
    expect(result.type).toBe('error');
  });

  it('detects Unhandled rejection', () => {
    const output = 'Unhandled rejection at Promise...';
    const result = parseOutput(output);
    expect(result.type).toBe('error');
  });

  it('returns running with lastLine for normal output', () => {
    const output = 'Line 1\nLine 2\nAll done';
    const result = parseOutput(output);
    expect(result.type).toBe('running');
    expect(result.lastLine).toBe('All done');
  });

  it('only checks last 10 lines (prepend 20 lines of noise)', () => {
    // Put a permission prompt in the FIRST 10 lines (before the last 10)
    const noiseLines = Array.from({ length: 20 }, (_, i) => `noise line ${i + 1}`);
    // Inject a fake permission prompt in line 5 (well before the last 10)
    noiseLines[4] = 'Allow Bash: rm -rf / (Y/n)';
    const trailing = Array.from({ length: 10 }, (_, i) => `normal line ${i + 1}`);
    const output = [...noiseLines, ...trailing].join('\n');
    const result = parseOutput(output);
    // The prompt is NOT in the last 10 lines, so it should not be detected
    expect(result.type).not.toBe('permission_prompt');
    expect(result.type).toBe('running');
  });
});

// ─── Extended classifyRisk tests ────────────────────────────────────────────

describe('classifyRisk - extended', () => {
  it('DROP TABLE is high', () => {
    expect(classifyRisk('Bash', 'DROP TABLE users')).toBe('high');
  });

  it('--no-verify is high', () => {
    expect(classifyRisk('Bash', 'git commit --no-verify -m "skip"')).toBe('high');
  });

  it('docker commands are medium', () => {
    expect(classifyRisk('Bash', 'docker run -it ubuntu')).toBe('medium');
  });

  it('apt-get is medium', () => {
    expect(classifyRisk('Bash', 'apt-get install curl')).toBe('medium');
  });

  it('WebFetch is medium', () => {
    expect(classifyRisk('WebFetch', 'https://api.example.com/data')).toBe('medium');
  });

  it('WebSearch is medium', () => {
    expect(classifyRisk('WebSearch', 'vitest mock examples')).toBe('medium');
  });

  it('cat/head/tail is low', () => {
    expect(classifyRisk('Bash', 'cat src/index.ts')).toBe('low');
    expect(classifyRisk('Bash', 'head -20 README.md')).toBe('low');
    expect(classifyRisk('Bash', 'tail -f logs/app.log')).toBe('low');
  });

  it('find is low', () => {
    expect(classifyRisk('Bash', 'find . -name "*.ts"')).toBe('low');
  });

  it('echo/pwd/wc is low', () => {
    expect(classifyRisk('Bash', 'echo hello')).toBe('low');
    expect(classifyRisk('Bash', 'pwd')).toBe('low');
    expect(classifyRisk('Bash', 'wc -l src/index.ts')).toBe('low');
  });

  it('unknown tool defaults to medium', () => {
    expect(classifyRisk('UnknownTool', 'some operation')).toBe('medium');
  });
});
