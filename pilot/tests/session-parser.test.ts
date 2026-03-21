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
