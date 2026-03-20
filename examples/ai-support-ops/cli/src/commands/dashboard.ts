/**
 * Dashboard Command
 * Launch the AutoSpec monitoring dashboard
 */

import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export interface DashboardOptions {
  port?: string;
}

export async function dashboardCommand(options: DashboardOptions): Promise<void> {
  const cwd = process.cwd();
  const port = options.port || '3847';

  // Check if this is an AutoSpec project
  const specsDir = path.join(cwd, 'specs');
  if (!fs.existsSync(specsDir)) {
    console.error(chalk.red('\n  Error: No specs/ directory found'));
    console.error(chalk.dim('  Make sure you\'re in an AutoSpec project directory\n'));
    throw new Error('Not an AutoSpec project');
  }

  console.log(chalk.cyan('\n  Starting AutoSpec Dashboard...\n'));
  console.log(chalk.dim(`  Project: ${cwd}`));
  console.log(chalk.dim(`  Port: ${port}\n`));

  // Try to find the dashboard package
  const dashboardPath = path.resolve(
    fileURLToPath(import.meta.url),
    '..', '..', '..', '..', 'dashboard'
  );

  if (!fs.existsSync(dashboardPath)) {
    console.error(chalk.red('  Error: Dashboard package not found'));
    console.error(chalk.dim('  Expected at: ' + dashboardPath));
    console.log(chalk.yellow('\n  To install the dashboard:\n'));
    console.log(chalk.cyan('    cd ' + dashboardPath));
    console.log(chalk.cyan('    npm install'));
    console.log(chalk.cyan('    npm run build\n'));
    throw new Error('Dashboard not installed');
  }

  // Check if dashboard is built
  const distPath = path.join(dashboardPath, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log(chalk.yellow('  Dashboard not built. Building now...\n'));

    const buildProcess = spawn('npm', ['run', 'build'], {
      cwd: dashboardPath,
      stdio: 'inherit',
      shell: true,
    });

    await new Promise<void>((resolve, reject) => {
      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
  }

  // Start the dashboard server
  const serverScript = path.join(dashboardPath, 'dist', 'server', 'index.js');

  if (!fs.existsSync(serverScript)) {
    console.error(chalk.red('  Error: Dashboard server not found'));
    console.log(chalk.yellow('\n  Try rebuilding the dashboard:\n'));
    console.log(chalk.cyan(`    cd ${dashboardPath}`));
    console.log(chalk.cyan('    npm run build\n'));
    throw new Error('Dashboard server not built');
  }

  const dashboardProcess = spawn('node', [serverScript, cwd, port], {
    stdio: 'inherit',
    shell: true,
  });

  // Handle cleanup
  process.on('SIGINT', () => {
    dashboardProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    dashboardProcess.kill('SIGTERM');
    process.exit(0);
  });

  await new Promise<void>((resolve, reject) => {
    dashboardProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Dashboard exited with code ${code}`));
      }
    });
  });
}
