/**
 * Backlog Parser
 * Parses backlog.md files into structured Sprint and Ticket data
 */

import fs from 'fs/promises';
import matter from 'gray-matter';
import type { Sprint, Ticket, TicketStatus, ModelTier, AgentRole } from '../../types/index.js';

interface ParsedBacklog {
  projectName?: string;
  sprints: Sprint[];
  totalTickets: number;
  totalPoints: number;
}

const STATUS_MAP: Record<string, TicketStatus> = {
  'todo': 'todo',
  '🔲': 'todo',
  'in-progress': 'in-progress',
  '🔄': 'in-progress',
  'qa-review': 'qa-review',
  '🧪': 'qa-review',
  'done': 'done',
  '✅': 'done',
  'blocked': 'blocked',
  '⏸️': 'blocked',
};

const OWNER_MAP: Record<string, AgentRole> = {
  'db': 'db',
  'database': 'db',
  'backend': 'backend',
  'frontend': 'frontend',
  'qa': 'qa',
  'devops': 'devops',
  'fullstack': 'fullstack',
  'full stack': 'fullstack',
};

function parseStatus(status: string): TicketStatus {
  const normalized = status.toLowerCase().trim();
  return STATUS_MAP[normalized] || STATUS_MAP[status.trim()] || 'todo';
}

function parseOwner(owner: string): AgentRole {
  const normalized = owner.toLowerCase().trim();
  return OWNER_MAP[normalized] || 'backend';
}

function parseModel(model: string): ModelTier {
  const normalized = model.toLowerCase().trim();
  if (normalized.includes('haiku')) return 'haiku';
  if (normalized.includes('opus')) return 'opus';
  return 'sonnet';
}

function parsePoints(points: string): number {
  const num = parseInt(points, 10);
  return isNaN(num) ? 2 : num;
}

function parseDependencies(deps: string): string[] {
  if (!deps || deps === '-' || deps === 'none' || deps === '') return [];
  return deps.split(/[,\s]+/).filter(d => d && d !== '-');
}

function parseTableRow(row: string): string[] {
  return row
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell !== '');
}

function parseTicketTable(lines: string[], sprintId: number): Ticket[] {
  const tickets: Ticket[] = [];
  let headerParsed = false;
  let columnMap: Record<string, number> = {};

  for (const line of lines) {
    if (!line.includes('|')) continue;

    const cells = parseTableRow(line);

    // Skip separator rows
    if (cells.every(c => c.match(/^[-:]+$/))) continue;

    // Parse header row
    if (!headerParsed) {
      cells.forEach((cell, index) => {
        const lower = cell.toLowerCase();
        if (lower.includes('id') || lower === '#') columnMap['id'] = index;
        else if (lower.includes('title') || lower.includes('ticket')) columnMap['title'] = index;
        else if (lower.includes('status')) columnMap['status'] = index;
        else if (lower.includes('owner')) columnMap['owner'] = index;
        else if (lower.includes('model')) columnMap['model'] = index;
        else if (lower.includes('point')) columnMap['points'] = index;
        else if (lower.includes('depend')) columnMap['dependencies'] = index;
        else if (lower.includes('agent')) columnMap['agent'] = index;
        else if (lower.includes('start')) columnMap['startedAt'] = index;
        else if (lower.includes('complet') || lower.includes('end')) columnMap['completedAt'] = index;
      });
      headerParsed = true;
      continue;
    }

    // Parse data row
    if (cells.length >= 2) {
      const ticket: Ticket = {
        id: cells[columnMap['id'] ?? 0] || `${sprintId}.${tickets.length + 1}`,
        sprintId,
        title: cells[columnMap['title'] ?? 1] || 'Untitled',
        status: parseStatus(cells[columnMap['status'] ?? 2] || 'todo'),
        owner: parseOwner(cells[columnMap['owner'] ?? 3] || 'backend'),
        model: parseModel(cells[columnMap['model'] ?? 4] || 'sonnet'),
        storyPoints: parsePoints(cells[columnMap['points'] ?? 5] || '2'),
        dependencies: parseDependencies(cells[columnMap['dependencies'] ?? 6] || ''),
        agent: cells[columnMap['agent']] || undefined,
        startedAt: cells[columnMap['startedAt']] || undefined,
        completedAt: cells[columnMap['completedAt']] || undefined,
      };

      if (ticket.startedAt && ticket.completedAt) {
        const start = new Date(ticket.startedAt).getTime();
        const end = new Date(ticket.completedAt).getTime();
        ticket.duration = Math.round((end - start) / 60000);
      }

      tickets.push(ticket);
    }
  }

  return tickets;
}

export async function parseBacklog(filePath: string): Promise<ParsedBacklog> {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  const sprints: Sprint[] = [];
  const lines = body.split('\n');

  let currentSprint: Partial<Sprint> | null = null;
  let currentTableLines: string[] = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect sprint header (## Sprint N: Name or ### Sprint N)
    const sprintMatch = line.match(/^#{2,3}\s*Sprint\s*(\d+)[:\s]*(.*)$/i);
    if (sprintMatch) {
      // Save previous sprint
      if (currentSprint && currentTableLines.length > 0) {
        const tickets = parseTicketTable(currentTableLines, currentSprint.id!);
        currentSprint.tickets = tickets;
        currentSprint.totalPoints = tickets.reduce((sum, t) => sum + t.storyPoints, 0);
        currentSprint.completedPoints = tickets
          .filter(t => t.status === 'done')
          .reduce((sum, t) => sum + t.storyPoints, 0);
        sprints.push(currentSprint as Sprint);
      }

      currentSprint = {
        id: parseInt(sprintMatch[1], 10),
        name: sprintMatch[2].trim() || `Sprint ${sprintMatch[1]}`,
        goal: '',
        status: 'planning',
        tickets: [],
        totalPoints: 0,
        completedPoints: 0,
      };
      currentTableLines = [];
      inTable = false;
      continue;
    }

    // Detect goal line
    if (currentSprint && line.toLowerCase().includes('goal:')) {
      currentSprint.goal = line.replace(/^.*goal:\s*/i, '').trim();
      continue;
    }

    // Collect table lines
    if (currentSprint && line.includes('|')) {
      inTable = true;
      currentTableLines.push(line);
    } else if (inTable && !line.trim()) {
      // Empty line after table - might continue or end
    }
  }

  // Save last sprint
  if (currentSprint && currentTableLines.length > 0) {
    const tickets = parseTicketTable(currentTableLines, currentSprint.id!);
    currentSprint.tickets = tickets;
    currentSprint.totalPoints = tickets.reduce((sum, t) => sum + t.storyPoints, 0);
    currentSprint.completedPoints = tickets
      .filter(t => t.status === 'done')
      .reduce((sum, t) => sum + t.storyPoints, 0);
    sprints.push(currentSprint as Sprint);
  }

  // Determine sprint statuses
  sprints.forEach(sprint => {
    const allDone = sprint.tickets.every(t => t.status === 'done');
    const anyInProgress = sprint.tickets.some(t => t.status === 'in-progress' || t.status === 'qa-review');

    if (allDone && sprint.tickets.length > 0) {
      sprint.status = 'completed';
    } else if (anyInProgress) {
      sprint.status = 'active';
    } else {
      sprint.status = 'planning';
    }
  });

  return {
    projectName: frontmatter.project || frontmatter.name,
    sprints,
    totalTickets: sprints.reduce((sum, s) => sum + s.tickets.length, 0),
    totalPoints: sprints.reduce((sum, s) => sum + s.totalPoints, 0),
  };
}

export async function parseBacklogIfExists(projectDir: string): Promise<ParsedBacklog | null> {
  const possiblePaths = [
    `${projectDir}/specs/backlog.md`,
    `${projectDir}/backlog.md`,
  ];

  for (const path of possiblePaths) {
    try {
      await fs.access(path);
      return await parseBacklog(path);
    } catch {
      continue;
    }
  }

  return null;
}
