/**
 * Backlog Parser
 * Parses backlog.md files to extract sprint and ticket information
 */

export type TicketStatus = 'todo' | 'in_progress' | 'qa_review' | 'done' | 'blocked';

export interface Ticket {
  number: string;
  description: string;
  status: TicketStatus;
  owner: string;
  model: string;
}

export interface Sprint {
  number: number;
  name: string;
  goal: string;
  status: 'active' | 'complete' | 'planned';
  tickets: Ticket[];
  dependencies: string[];
  definitionOfDone: string[];
}

export interface BacklogData {
  projectName: string;
  created: string;
  lastUpdated: string;
  sprints: Sprint[];
  bugs: Ticket[];
}

const STATUS_MAP: Record<string, TicketStatus> = {
  'Todo': 'todo',
  'In Progress': 'in_progress',
  'QA Review': 'qa_review',
  'Done': 'done',
  'Blocked': 'blocked',
};

const STATUS_EMOJI_MAP: Record<string, TicketStatus> = {
  ':white_square_button:': 'todo',
  ':arrows_counterclockwise:': 'in_progress',
  ':test_tube:': 'qa_review',
  ':white_check_mark:': 'done',
  ':pause_button:': 'blocked',
};

/**
 * Parse status from emoji or text
 */
function parseStatus(statusText: string): TicketStatus {
  const cleaned = statusText.trim();

  // Check emoji patterns
  if (cleaned.includes('\u{1F532}') || cleaned.includes('\uD83D\uDD32') || cleaned.match(/^[^\w]*Todo/i)) {
    return 'todo';
  }
  if (cleaned.includes('\u{1F504}') || cleaned.includes('\uD83D\uDD04') || cleaned.match(/In Progress/i)) {
    return 'in_progress';
  }
  if (cleaned.includes('\u{1F9EA}') || cleaned.includes('\uD83E\uDDEA') || cleaned.match(/QA Review/i)) {
    return 'qa_review';
  }
  if (cleaned.includes('\u{2705}') || cleaned.includes('\u2705') || cleaned.match(/Done/i)) {
    return 'done';
  }
  if (cleaned.includes('\u{23F8}') || cleaned.includes('\u23F8') || cleaned.match(/Blocked/i)) {
    return 'blocked';
  }

  // Fallback to checking text content
  for (const [text, status] of Object.entries(STATUS_MAP)) {
    if (cleaned.toLowerCase().includes(text.toLowerCase())) {
      return status;
    }
  }

  return 'todo'; // Default
}

/**
 * Parse a ticket row from markdown table
 */
function parseTicketRow(row: string): Ticket | null {
  // Remove leading/trailing pipes and split by pipe
  const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);

  if (cells.length < 4) return null;

  // Expected format: | # | Ticket | Status | Owner | Model |
  const [number, description, statusText, owner = '', model = ''] = cells;

  // Skip header rows
  if (number === '#' || number.includes('-')) return null;

  return {
    number: number.trim(),
    description: description.trim(),
    status: parseStatus(statusText),
    owner: owner.trim(),
    model: model.trim(),
  };
}

/**
 * Parse sprint section from markdown
 */
function parseSprint(content: string, isActive: boolean = false, isComplete: boolean = false): Sprint | null {
  // Match sprint header: ## [emoji] Sprint N: Name
  const headerMatch = content.match(/^##\s*(?:[^\s]+\s+)?Sprint\s+(\d+)(?::\s*(.+?))?(?:\s*[-—]+\s*(.+))?$/m);

  if (!headerMatch) return null;

  const number = parseInt(headerMatch[1], 10);
  const name = headerMatch[2]?.trim() || `Sprint ${number}`;
  const statusIndicator = headerMatch[3]?.trim() || '';

  // Determine sprint status
  let status: Sprint['status'] = 'planned';
  if (isComplete || statusIndicator.toUpperCase().includes('COMPLETE')) {
    status = 'complete';
  } else if (isActive || statusIndicator.toUpperCase().includes('ACTIVE')) {
    status = 'active';
  }

  // Extract goal from **Goal:** line
  const goalMatch = content.match(/\*\*Goal:\*\*\s*(.+)/);
  const goal = goalMatch?.[1]?.trim() || '';

  // Extract tickets from table
  const tickets: Ticket[] = [];
  const tableMatch = content.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]*\|[\s\S]*?(?=\n\n|\n###|\n##|$)/);

  if (tableMatch) {
    const rows = tableMatch[0].split('\n').filter(row => row.trim());
    for (const row of rows) {
      const ticket = parseTicketRow(row);
      if (ticket) {
        tickets.push(ticket);
      }
    }
  }

  // Extract dependencies
  const depsMatch = content.match(/### Dependencies\s*([\s\S]*?)(?=\n###|$)/);
  const dependencies: string[] = [];
  if (depsMatch) {
    const depsLines = depsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
    dependencies.push(...depsLines.map(line => line.replace(/^-\s*/, '').trim()));
  }

  // Extract definition of done
  const dodMatch = content.match(/### Definition of Done\s*([\s\S]*?)(?=\n###|---|\n##|$)/);
  const definitionOfDone: string[] = [];
  if (dodMatch) {
    const dodLines = dodMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
    definitionOfDone.push(...dodLines.map(line => line.replace(/^-\s*\[.\]\s*/, '').trim()));
  }

  return {
    number,
    name,
    goal,
    status,
    tickets,
    dependencies,
    definitionOfDone,
  };
}

/**
 * Parse a complete backlog.md file
 */
export function parseBacklog(content: string): BacklogData {
  const lines = content.split('\n');

  // Extract project name from title
  const titleMatch = content.match(/^#\s+(.+?)\s*(?:Product\s+)?Backlog/mi);
  const projectName = titleMatch?.[1]?.trim() || 'Unknown Project';

  // Extract dates
  const createdMatch = content.match(/\*\*Created:\*\*\s*(.+)/);
  const updatedMatch = content.match(/\*\*Last Updated:\*\*\s*(.+)/);
  const created = createdMatch?.[1]?.trim() || '';
  const lastUpdated = updatedMatch?.[1]?.trim() || created;

  // Split content into sprint sections
  const sprintSections = content.split(/(?=##\s*(?:[^\s]+\s+)?Sprint\s+\d+)/);
  const sprints: Sprint[] = [];

  for (const section of sprintSections) {
    // Check if this section indicates active or complete
    const isComplete = section.includes('COMPLETE') || section.includes('\u2705 Sprint');
    const isActive = section.includes('ACTIVE') || section.includes('\uD83D\uDD04 Sprint');

    const sprint = parseSprint(section, isActive, isComplete);
    if (sprint) {
      sprints.push(sprint);
    }
  }

  // Parse bug backlog
  const bugSectionMatch = content.match(/## Bug Backlog[\s\S]*?\|[\s\S]*?(?=\n##|---\s*$|$)/);
  const bugs: Ticket[] = [];

  if (bugSectionMatch) {
    const rows = bugSectionMatch[0].split('\n').filter(row => row.includes('|'));
    for (const row of rows) {
      const ticket = parseTicketRow(row);
      if (ticket && ticket.number.startsWith('B.')) {
        bugs.push(ticket);
      }
    }
  }

  return {
    projectName,
    created,
    lastUpdated,
    sprints,
    bugs,
  };
}

/**
 * Get statistics from parsed backlog
 */
export function getBacklogStats(backlog: BacklogData): {
  totalTickets: number;
  completedTickets: number;
  inProgressTickets: number;
  todoTickets: number;
  qaTickets: number;
  blockedTickets: number;
  completionPercentage: number;
  currentSprint: Sprint | null;
} {
  let totalTickets = 0;
  let completedTickets = 0;
  let inProgressTickets = 0;
  let todoTickets = 0;
  let qaTickets = 0;
  let blockedTickets = 0;
  let currentSprint: Sprint | null = null;

  for (const sprint of backlog.sprints) {
    if (sprint.status === 'active') {
      currentSprint = sprint;
    }

    for (const ticket of sprint.tickets) {
      totalTickets++;
      switch (ticket.status) {
        case 'done':
          completedTickets++;
          break;
        case 'in_progress':
          inProgressTickets++;
          break;
        case 'todo':
          todoTickets++;
          break;
        case 'qa_review':
          qaTickets++;
          break;
        case 'blocked':
          blockedTickets++;
          break;
      }
    }
  }

  const completionPercentage = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  return {
    totalTickets,
    completedTickets,
    inProgressTickets,
    todoTickets,
    qaTickets,
    blockedTickets,
    completionPercentage,
    currentSprint,
  };
}

/**
 * Get current sprint stats
 */
export function getSprintStats(sprint: Sprint): {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  qa: number;
  blocked: number;
  percentage: number;
} {
  const total = sprint.tickets.length;
  let done = 0;
  let inProgress = 0;
  let todo = 0;
  let qa = 0;
  let blocked = 0;

  for (const ticket of sprint.tickets) {
    switch (ticket.status) {
      case 'done':
        done++;
        break;
      case 'in_progress':
        inProgress++;
        break;
      case 'todo':
        todo++;
        break;
      case 'qa_review':
        qa++;
        break;
      case 'blocked':
        blocked++;
        break;
    }
  }

  return {
    total,
    done,
    inProgress,
    todo,
    qa,
    blocked,
    percentage: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}
