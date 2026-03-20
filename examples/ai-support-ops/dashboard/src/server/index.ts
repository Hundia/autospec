/**
 * AutoSpec Dashboard Server
 * Express + WebSocket server for real-time project monitoring
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import cors from 'cors';

import { parseBacklog } from './parsers/backlog.js';
import { findSprintSummaries } from './parsers/sprint.js';
import { findAllSpecs, parseUIDesignerSpec } from './parsers/specs.js';
import { createProjectWatcher, FileChangeEvent } from './watchers/fileWatcher.js';
import type { ProjectState, WSMessage, BurndownDataPoint } from '../types/index.js';

const DEFAULT_PORT = 3847;

export interface ServerOptions {
  projectDir: string;
  port?: number;
  open?: boolean;
}

export async function createDashboardServer(options: ServerOptions) {
  const { projectDir, port = DEFAULT_PORT } = options;

  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve static files from client build
  const clientPath = path.join(import.meta.dirname, '..', 'client', 'dist');
  app.use(express.static(clientPath));

  // Project state
  let projectState: ProjectState = await loadProjectState(projectDir);

  // WebSocket connections
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // Send initial state
    const message: WSMessage = {
      type: 'state',
      payload: projectState,
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(message));

    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  function broadcast(message: WSMessage) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // File watcher
  const watcher = createProjectWatcher(projectDir);

  watcher.on('change', async (event: FileChangeEvent) => {
    console.log(`File changed: ${event.type} - ${event.path}`);

    // Reload relevant data
    if (event.type === 'backlog') {
      const backlogPath = path.join(projectDir, 'specs', 'backlog.md');
      projectState.sprints = await parseBacklog(backlogPath);
    } else if (event.type === 'sprint') {
      projectState.sprintSummaries = await findSprintSummaries(projectDir);
    } else if (event.type === 'spec') {
      projectState.specs = await findAllSpecs(projectDir);
    }

    // Calculate burndown
    projectState.burndown = calculateBurndown(projectState);

    // Broadcast update
    broadcast({
      type: 'update',
      payload: {
        event: event.type,
        path: event.path,
        state: projectState,
      },
      timestamp: new Date().toISOString(),
    });
  });

  watcher.start();

  // API Routes
  app.get('/api/state', (_req, res) => {
    res.json(projectState);
  });

  app.get('/api/sprints', (_req, res) => {
    res.json(Array.from(projectState.sprints.values()));
  });

  app.get('/api/sprints/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const sprint = projectState.sprints.get(id);
    if (sprint) {
      res.json(sprint);
    } else {
      res.status(404).json({ error: 'Sprint not found' });
    }
  });

  app.get('/api/sprints/:id/summary', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const summary = projectState.sprintSummaries.get(id);
    if (summary) {
      res.json(summary);
    } else {
      res.status(404).json({ error: 'Sprint summary not found' });
    }
  });

  app.get('/api/tickets', (_req, res) => {
    const tickets: any[] = [];
    projectState.sprints.forEach((sprint) => {
      tickets.push(...sprint.tickets);
    });
    res.json(tickets);
  });

  app.get('/api/specs', (_req, res) => {
    res.json(Object.fromEntries(projectState.specs));
  });

  app.get('/api/specs/:role', (req, res) => {
    const spec = projectState.specs.get(req.params.role);
    if (spec) {
      res.json(spec);
    } else {
      res.status(404).json({ error: 'Spec not found' });
    }
  });

  app.get('/api/screens', (_req, res) => {
    const uiSpec = projectState.specs.get('ui_designer');
    if (uiSpec && uiSpec.screens) {
      res.json(uiSpec.screens);
    } else {
      res.json([]);
    }
  });

  app.get('/api/burndown', (_req, res) => {
    res.json(projectState.burndown);
  });

  app.get('/api/metrics', (_req, res) => {
    res.json(calculateMetrics(projectState));
  });

  // Catch-all for SPA
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });

  // Cleanup on exit
  process.on('SIGINT', () => {
    watcher.stop();
    server.close();
    process.exit(0);
  });

  return {
    app,
    server,
    watcher,
    start: () => {
      return new Promise<void>((resolve) => {
        server.listen(port, () => {
          console.log(`\n🚀 AutoSpec Dashboard running at http://localhost:${port}\n`);
          resolve();
        });
      });
    },
    stop: () => {
      watcher.stop();
      return new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    },
  };
}

async function loadProjectState(projectDir: string): Promise<ProjectState> {
  const backlogPath = path.join(projectDir, 'specs', 'backlog.md');

  const sprints = await parseBacklog(backlogPath);
  const sprintSummaries = await findSprintSummaries(projectDir);
  const specs = await findAllSpecs(projectDir);

  const state: ProjectState = {
    projectDir,
    sprints,
    sprintSummaries,
    specs,
    burndown: [],
    lastUpdated: new Date().toISOString(),
  };

  state.burndown = calculateBurndown(state);

  return state;
}

function calculateBurndown(state: ProjectState): BurndownDataPoint[] {
  const burndown: BurndownDataPoint[] = [];
  let totalPoints = 0;
  let completedPoints = 0;

  // Calculate total points across all sprints
  state.sprints.forEach((sprint) => {
    sprint.tickets.forEach((ticket) => {
      totalPoints += ticket.storyPoints;
    });
  });

  // Create daily burndown based on completed tickets
  const completedTickets: Array<{ date: string; points: number }> = [];

  state.sprints.forEach((sprint) => {
    sprint.tickets.forEach((ticket) => {
      if (ticket.status === 'done' && ticket.completedAt) {
        completedTickets.push({
          date: ticket.completedAt.split('T')[0],
          points: ticket.storyPoints,
        });
      }
    });
  });

  // Sort by date
  completedTickets.sort((a, b) => a.date.localeCompare(b.date));

  // Build burndown chart
  let remaining = totalPoints;

  if (completedTickets.length > 0) {
    // Start point
    burndown.push({
      date: completedTickets[0].date,
      remaining: totalPoints,
      completed: 0,
      ideal: totalPoints,
    });

    // Daily points
    const dailyPoints = new Map<string, number>();
    completedTickets.forEach(({ date, points }) => {
      dailyPoints.set(date, (dailyPoints.get(date) || 0) + points);
    });

    let completed = 0;
    dailyPoints.forEach((points, date) => {
      completed += points;
      remaining -= points;
      burndown.push({
        date,
        remaining,
        completed,
        ideal: totalPoints - completed, // Simplified ideal line
      });
    });
  }

  return burndown;
}

function calculateMetrics(state: ProjectState) {
  let totalTickets = 0;
  let completedTickets = 0;
  let totalPoints = 0;
  let completedPoints = 0;
  const modelUsage = { haiku: 0, sonnet: 0, opus: 0 };

  state.sprints.forEach((sprint) => {
    sprint.tickets.forEach((ticket) => {
      totalTickets++;
      totalPoints += ticket.storyPoints;

      if (ticket.status === 'done') {
        completedTickets++;
        completedPoints += ticket.storyPoints;
      }

      if (ticket.model in modelUsage) {
        modelUsage[ticket.model as keyof typeof modelUsage]++;
      }
    });
  });

  const completionRate = totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0;
  const velocity = completedPoints;

  return {
    totalTickets,
    completedTickets,
    totalPoints,
    completedPoints,
    completionRate: Math.round(completionRate * 10) / 10,
    velocity,
    modelUsage,
    sprintCount: state.sprints.size,
  };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectDir = process.argv[2] || process.cwd();
  const port = parseInt(process.argv[3] || String(DEFAULT_PORT), 10);

  createDashboardServer({ projectDir, port })
    .then((server) => server.start())
    .catch(console.error);
}
