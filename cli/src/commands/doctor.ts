/**
 * Doctor Command
 * System readiness diagnostics — follows `brew doctor` / `flutter doctor` convention.
 * Checks Node.js version and all registered LLM providers.
 */

import chalk from 'chalk';
import { getAllProviders } from '../providers/resolver.js';

export async function doctorCommand(): Promise<void> {
  console.log(chalk.bold('\n  autospec doctor\n'));

  // 1. Check environment
  console.log(chalk.dim('  Environment:'));

  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1), 10);
  const isNodeOk = nodeMajor >= 18;
  const nodeStatus = isNodeOk ? chalk.green('✓') : chalk.red('✗');
  console.log(`    Node.js         ${nodeVersion.padEnd(12)} ${nodeStatus} (>=18.0.0)`);

  // npm version (best-effort)
  try {
    const { execa } = await import('execa');
    const { stdout: npmVersion } = await execa('npm', ['--version'], { reject: false });
    if (npmVersion) {
      console.log(`    npm             v${npmVersion.trim().padEnd(11)} ${chalk.green('✓')}`);
    }
  } catch {
    // npm check is informational — skip silently
  }

  // 2. Check providers
  console.log(chalk.dim('\n  LLM Providers:'));
  const providers = getAllProviders();
  let anyAvailable = false;

  for (const provider of providers) {
    const available = await provider.isAvailable();
    if (available) anyAvailable = true;

    const icon = available ? chalk.green('✓') : chalk.red('✗');

    // Build display name and detail based on provider
    let displayName: string;
    let detail: string;

    if (provider.name === 'claude-code') {
      displayName = 'Claude Code';
      if (available) {
        detail = 'authenticated';
      } else {
        detail = chalk.dim('not installed or not authenticated');
      }
    } else if (provider.name === 'anthropic-api') {
      displayName = 'Anthropic API';
      const key = process.env.ANTHROPIC_API_KEY;
      if (available && key) {
        const masked = `${key.slice(0, 7)}...${key.slice(-4)}`;
        detail = `ANTHROPIC_API_KEY set (${chalk.dim(masked)})`;
      } else {
        detail = chalk.dim('ANTHROPIC_API_KEY not set');
      }
    } else if (provider.name === 'gemini-cli') {
      displayName = 'Gemini CLI';
      detail = available ? 'authenticated' : chalk.dim('not installed');
    } else {
      displayName = provider.name;
      detail = available ? 'available' : chalk.dim('not available');
    }

    const paddedName = displayName.padEnd(16);
    console.log(`    ${icon} ${paddedName} ${detail}`);
  }

  // 3. Summary
  if (anyAvailable) {
    console.log(
      chalk.green('\n  Ready to generate specs.') + ' Run: autospec generate <file>\n',
    );
  } else {
    console.log(chalk.red('\n  No LLM provider available.') + ' Install one:');
    console.log('    npm i -g @anthropic-ai/claude-code && claude auth login');
    console.log('    export ANTHROPIC_API_KEY=sk-ant-...\n');
  }
}
