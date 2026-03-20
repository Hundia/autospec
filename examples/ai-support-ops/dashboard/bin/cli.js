#!/usr/bin/env node

/**
 * AutoSpec Dashboard CLI
 * Launch the monitoring dashboard for your AutoSpec project
 */

import { createDashboardServer } from '../dist/server/index.js';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);
const projectDir = args[0] || process.cwd();
const port = parseInt(args[1] || process.env.PORT || '3847', 10);

// Check if project has specs directory
const specsDir = path.join(projectDir, 'specs');
if (!fs.existsSync(specsDir)) {
  console.error('Error: No specs/ directory found in', projectDir);
  console.error('Make sure you run this from an AutoSpec project directory.');
  process.exit(1);
}

// Check if backlog.md exists
const backlogPath = path.join(specsDir, 'backlog.md');
if (!fs.existsSync(backlogPath)) {
  console.warn('Warning: No backlog.md found in specs/');
  console.warn('The dashboard will have limited functionality.');
}

console.log(`
   _         _        ____
  / \\  _   _| |_ ___ / ___| _ __   ___  ___
 / _ \\| | | | __/ _ \\\\___ \\| '_ \\ / _ \\/ __|
/ ___ \\ |_| | || (_) |___) | |_) |  __/ (__
/_/   \\_\\__,_|\\__\\___/|____/| .__/ \\___|\\___| Dashboard
                            |_|
`);

console.log('Starting AutoSpec Dashboard...');
console.log(`Project: ${projectDir}`);
console.log(`Port: ${port}`);
console.log('');

// Try to open browser
function openBrowser(url) {
  const platform = process.platform;
  try {
    if (platform === 'darwin') {
      execSync(`open ${url}`);
    } else if (platform === 'win32') {
      execSync(`start ${url}`);
    } else {
      execSync(`xdg-open ${url}`);
    }
  } catch (e) {
    // Ignore errors opening browser
  }
}

createDashboardServer({ projectDir, port })
  .then((server) => server.start())
  .then(() => {
    setTimeout(() => {
      openBrowser(`http://localhost:${port}`);
    }, 500);
  })
  .catch((error) => {
    console.error('Failed to start dashboard:', error);
    process.exit(1);
  });
