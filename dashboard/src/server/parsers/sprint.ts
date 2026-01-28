/**
 * Sprint Summary Parser
 * Parses sprint summary markdown files into structured SprintSummary data
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { SprintSummary, AgentSession, PromptRecord, ExecutionLog, ModelTier } from '../../types/index.js';

interface ParsedSprintSummary extends SprintSummary {
  raw: string;
}

function parseAgentTable(content: string): AgentSession[] {
  const sessions: AgentSession[] = [];
  const lines = content.split('\n');

  let inTable = false;
  let headerParsed = false;

  for (const line of lines) {
    if (!line.includes('|')) {
      if (inTable) break;
      continue;
    }

    const cells = line.split('|').map(c => c.trim()).filter(c => c);

    if (cells.every(c => c.match(/^[-:]+$/))) {
      inTable = true;
      continue;
    }

    if (!headerParsed && inTable) {
      headerParsed = true;
      continue;
    }

    if (headerParsed && cells.length >= 3) {
      sessions.push({
        id: cells[0] || `agent-${sessions.length}`,
        name: cells[1] || `Agent ${sessions.length + 1}`,
        role: (cells[2]?.toLowerCase() || 'backend') as AgentSession['role'],
        status: 'completed',
        ticketsCompleted: [],
        model: 'sonnet',
      });
    }
  }

  return sessions;
}

function parseModelDistribution(content: string): SprintSummary['models'] {
  const models = {
    haiku: { count: 0, percentage: 0 },
    sonnet: { count: 0, percentage: 0 },
    opus: { count: 0, percentage: 0 },
  };

  // Look for patterns like "Haiku: 35%" or "haiku (40%)"
  const haikuMatch = content.match(/haiku[:\s]+(\d+)%?/i);
  const sonnetMatch = content.match(/sonnet[:\s]+(\d+)%?/i);
  const opusMatch = content.match(/opus[:\s]+(\d+)%?/i);

  if (haikuMatch) models.haiku.percentage = parseInt(haikuMatch[1], 10);
  if (sonnetMatch) models.sonnet.percentage = parseInt(sonnetMatch[1], 10);
  if (opusMatch) models.opus.percentage = parseInt(opusMatch[1], 10);

  return models;
}

function parseDuration(content: string): SprintSummary['duration'] {
  const duration = {
    startedAt: '',
    completedAt: '',
    totalHours: 0,
  };

  // Look for duration patterns
  const hoursMatch = content.match(/duration[:\s]+(\d+\.?\d*)\s*hours?/i);
  if (hoursMatch) {
    duration.totalHours = parseFloat(hoursMatch[1]);
  }

  // Look for date patterns
  const startMatch = content.match(/started?[:\s]+(\d{4}-\d{2}-\d{2})/i);
  const endMatch = content.match(/completed?[:\s]+(\d{4}-\d{2}-\d{2})/i);

  if (startMatch) duration.startedAt = startMatch[1];
  if (endMatch) duration.completedAt = endMatch[1];

  return duration;
}

function parsePrompts(content: string): PromptRecord[] {
  const prompts: PromptRecord[] = [];

  // Look for prompt sections with <details> tags or ### Prompt: headers
  const promptRegex = /<details>\s*<summary>Prompt:\s*([a-f0-9]+)<\/summary>\s*([\s\S]*?)<\/details>/gi;
  let match;

  while ((match = promptRegex.exec(content)) !== null) {
    prompts.push({
      hash: match[1],
      ticketId: '',
      agentId: '',
      timestamp: '',
      content: match[2].trim(),
      model: 'sonnet',
    });
  }

  return prompts;
}

function parseMetrics(content: string): { parallelization: number; agentCount: number } {
  let parallelization = 0;
  let agentCount = 1;

  const parallelMatch = content.match(/parallelization[:\s]+(\d+)%?/i) ||
    content.match(/(\d+)%\s*time\s*savings/i);
  if (parallelMatch) {
    parallelization = parseInt(parallelMatch[1], 10);
  }

  const agentMatch = content.match(/agents?\s*used[:\s]+(\d+)/i) ||
    content.match(/(\d+)\s*agents?/i);
  if (agentMatch) {
    agentCount = parseInt(agentMatch[1], 10);
  }

  return { parallelization, agentCount };
}

export async function parseSprintSummary(filePath: string): Promise<ParsedSprintSummary | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    // Extract sprint ID from filename or frontmatter
    const filenameMatch = path.basename(filePath).match(/sprint[_-]?(\d+)/i);
    const sprintId = frontmatter.sprint || (filenameMatch ? parseInt(filenameMatch[1], 10) : 0);

    const duration = parseDuration(body);
    const models = parseModelDistribution(body);
    const prompts = parsePrompts(body);
    const { parallelization, agentCount } = parseMetrics(body);

    // Parse ticket counts from content
    const ticketMatch = body.match(/(\d+)\s*tickets?\s*completed/i);
    const pointsMatch = body.match(/(\d+)\s*points?\s*completed/i) ||
      body.match(/velocity[:\s]+(\d+)/i);

    return {
      sprintId,
      duration,
      agents: {
        count: agentCount,
        parallelization,
        sessions: parseAgentTable(body),
      },
      models,
      tickets: {
        total: ticketMatch ? parseInt(ticketMatch[1], 10) : 0,
        completed: ticketMatch ? parseInt(ticketMatch[1], 10) : 0,
        blocked: 0,
      },
      points: {
        planned: 0,
        completed: pointsMatch ? parseInt(pointsMatch[1], 10) : 0,
        velocity: pointsMatch ? parseInt(pointsMatch[1], 10) : 0,
      },
      prompts,
      timeline: [],
      raw: content,
    };
  } catch (error) {
    console.error(`Error parsing sprint summary ${filePath}:`, error);
    return null;
  }
}

export async function findSprintSummaries(projectDir: string): Promise<Map<number, ParsedSprintSummary>> {
  const summaries = new Map<number, ParsedSprintSummary>();

  const sprintsDirs = [
    path.join(projectDir, 'sprints'),
    projectDir,
  ];

  for (const dir of sprintsDirs) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.includes('sprint')) {
          // Look for summary.md in sprint folder
          const summaryPath = path.join(dir, entry.name, 'summary.md');
          try {
            const summary = await parseSprintSummary(summaryPath);
            if (summary) {
              summaries.set(summary.sprintId, summary);
            }
          } catch {
            // No summary file
          }
        } else if (entry.isFile() && entry.name.match(/sprint.*summary\.md/i)) {
          const summary = await parseSprintSummary(path.join(dir, entry.name));
          if (summary) {
            summaries.set(summary.sprintId, summary);
          }
        }
      }
    } catch {
      continue;
    }
  }

  return summaries;
}
