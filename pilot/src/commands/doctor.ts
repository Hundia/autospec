import { execSync } from 'child_process';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { PILOT_HOME, loadConfig } from '../utils/config.js';
import * as tmux from '../utils/tmux.js';
import { getAllProviders, resolveProvider } from '../providers/resolver.js';

interface Check {
  name: string;
  check: () => { ok: boolean; detail: string };
}

const checks: Check[] = [
  {
    name: 'Node.js',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1));
      return { ok: major >= 18, detail: version };
    },
  },
  {
    name: 'tmux',
    check: () => {
      const installed = tmux.isTmuxInstalled();
      const version = tmux.getTmuxVersion();
      return { ok: installed, detail: version ?? 'not installed' };
    },
  },
  {
    name: 'Redis',
    check: () => {
      try {
        const pong = execSync('redis-cli ping 2>/dev/null', { stdio: 'pipe' }).toString().trim();
        return { ok: pong === 'PONG', detail: pong === 'PONG' ? 'connected' : 'not responding' };
      } catch {
        return { ok: false, detail: 'not available (optional — file fallback will be used)' };
      }
    },
  },
  {
    name: 'Chrome/Chromium',
    check: () => {
      try {
        const paths = [
          'google-chrome --version',
          'google-chrome-stable --version',
          'chromium --version',
          'chromium-browser --version',
        ];
        for (const cmd of paths) {
          try {
            const version = execSync(`${cmd} 2>/dev/null`, { stdio: 'pipe' }).toString().trim();
            if (version) return { ok: true, detail: version };
          } catch { /* try next */ }
        }
        const puppeteerPath = execSync('find ~/.cache/puppeteer -name "chrome" -type f 2>/dev/null | head -1', { stdio: 'pipe' })
          .toString().trim();
        if (puppeteerPath) return { ok: true, detail: `puppeteer: ${puppeteerPath}` };
        return { ok: false, detail: 'not found (needed for WhatsApp)' };
      } catch {
        return { ok: false, detail: 'not found (needed for WhatsApp)' };
      }
    },
  },
  {
    name: 'Pilot Home',
    check: () => {
      const exists = existsSync(PILOT_HOME);
      return { ok: exists, detail: exists ? PILOT_HOME : `${PILOT_HOME} (will be created on first use)` };
    },
  },
];

export async function runDoctor(): Promise<void> {
  console.log(chalk.bold('\n  Claude Pilot — System Check\n'));

  let allOk = true;

  for (const { name, check } of checks) {
    const { ok, detail } = check();
    const icon = ok ? chalk.green('✓') : chalk.red('✗');
    const detailStr = ok ? chalk.dim(detail) : chalk.yellow(detail);
    console.log(`  ${icon} ${name.padEnd(20)} ${detailStr}`);
    if (!ok) allOk = false;
  }

  // LLM Providers
  console.log(chalk.bold('\n  LLM Providers\n'));
  const providers = getAllProviders();
  let anyProvider = false;

  for (const provider of providers) {
    const available = await provider.isAvailable();
    const icon = available ? chalk.green('✓') : chalk.red('✗');
    const detail = available ? chalk.dim('available') : chalk.yellow(provider.installInstructions());
    console.log(`  ${icon} ${provider.displayName.padEnd(20)} ${detail}`);
    if (available) anyProvider = true;
  }

  // Show active provider
  const config = await loadConfig();
  try {
    const active = await resolveProvider(config.provider.default || undefined, config);
    console.log(chalk.dim(`\n  Active provider: ${chalk.white(active.displayName)}`));
  } catch {
    console.log(chalk.yellow('\n  No provider available — install Claude Code, Gemini CLI, or GitHub Copilot'));
    allOk = false;
  }

  // Config
  console.log();
  try {
    console.log(`  ${chalk.green('✓')} ${'Config'.padEnd(20)} ${chalk.dim('loaded')}`);
    if (config.whatsapp.enabled) {
      console.log(`  ${chalk.blue('ℹ')} ${'WhatsApp'.padEnd(20)} ${chalk.dim('enabled')}`);
    }
  } catch {
    console.log(`  ${chalk.red('✗')} ${'Config'.padEnd(20)} ${chalk.yellow('failed to load')}`);
    allOk = false;
  }

  if (!anyProvider) allOk = false;

  console.log();
  if (allOk) {
    console.log(chalk.green('  All checks passed. Ready to fly.\n'));
  } else {
    console.log(chalk.yellow('  Some checks failed.\n'));
    console.log(chalk.dim('  Install tmux: apt-get install tmux'));
    console.log(chalk.dim('  Install Claude Code: npm install -g @anthropic-ai/claude-code'));
    console.log(chalk.dim('  Install Gemini CLI: npm install -g @anthropic-ai/gemini-cli'));
    console.log(chalk.dim('  Install Copilot: gh extension install github/gh-copilot\n'));
  }
}
