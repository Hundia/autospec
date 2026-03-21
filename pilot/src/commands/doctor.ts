import { execSync } from 'child_process';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { PILOT_HOME, loadConfig } from '../utils/config.js';
import * as tmux from '../utils/tmux.js';

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
    name: 'Claude Code CLI',
    check: () => {
      try {
        const version = execSync('claude --version 2>/dev/null || echo "not found"', { stdio: 'pipe' })
          .toString().trim();
        return { ok: !version.includes('not found'), detail: version };
      } catch {
        return { ok: false, detail: 'not found' };
      }
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
        // Check puppeteer cache
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

  // Check config
  try {
    const config = await loadConfig();
    console.log(`  ${chalk.green('✓')} ${'Config'.padEnd(20)} ${chalk.dim('loaded')}`);
    if (config.whatsapp.enabled) {
      console.log(`  ${chalk.blue('ℹ')} ${'WhatsApp'.padEnd(20)} ${chalk.dim('enabled')}`);
    }
  } catch (e) {
    console.log(`  ${chalk.red('✗')} ${'Config'.padEnd(20)} ${chalk.yellow('failed to load')}`);
    allOk = false;
  }

  console.log();
  if (allOk) {
    console.log(chalk.green('  All checks passed. Ready to fly.\n'));
  } else {
    console.log(chalk.yellow('  Some checks failed. Core features (tmux, claude) are required.\n'));
    console.log(chalk.dim('  Install tmux: apt-get install tmux'));
    console.log(chalk.dim('  Install Claude Code: npm install -g @anthropic-ai/claude-code\n'));
  }
}
