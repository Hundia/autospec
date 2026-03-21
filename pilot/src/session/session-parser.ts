/**
 * Parses Claude Code terminal output for permission prompts, completion signals, and errors.
 */

export interface ParsedPermission {
  tool: string;
  description: string;
  fullPrompt: string;
}

export interface ParseResult {
  type: 'permission_prompt' | 'running' | 'completed' | 'error' | 'idle';
  permission?: ParsedPermission;
  error?: string;
  lastLine?: string;
}

// Claude Code permission prompt patterns
const PERMISSION_PATTERNS = [
  // "Allow Bash: rm -rf node_modules (Y/n)"
  /Allow\s+(Bash|Edit|Write|Read|Glob|Grep|WebFetch|WebSearch|Agent|NotebookEdit)(?:\(([^)]*)\))?:\s*(.+?)(?:\s*\([Yy]\/[Nn]\))?\s*$/m,
  // "Allow Bash(npm install)? (Y/n)"
  /Allow\s+(Bash|Edit|Write|Read|Glob|Grep|WebFetch|WebSearch)\(([^)]+)\)\?\s*\([Yy]\/[Nn]\)/m,
];

// Completion patterns
const COMPLETION_PATTERNS = [
  /Session ended/i,
  /Goodbye/i,
  /^\s*\$\s*$/m, // Shell prompt returned
];

// Error patterns
const ERROR_PATTERNS = [
  /Error:\s*(.+)/i,
  /FATAL:\s*(.+)/i,
  /panic:\s*(.+)/i,
  /Unhandled\s+rejection/i,
];

export function parseOutput(output: string): ParseResult {
  if (!output.trim()) {
    return { type: 'idle' };
  }

  // Check last few lines for permission prompts (always at bottom)
  const lastLines = output.split('\n').slice(-10).join('\n');

  for (const pattern of PERMISSION_PATTERNS) {
    const match = lastLines.match(pattern);
    if (match) {
      return {
        type: 'permission_prompt',
        permission: {
          tool: match[1],
          description: match[3] || match[2] || '',
          fullPrompt: match[0].trim(),
        },
      };
    }
  }

  // Check for errors
  for (const pattern of ERROR_PATTERNS) {
    const match = lastLines.match(pattern);
    if (match) {
      return {
        type: 'error',
        error: match[1] || match[0],
        lastLine: lastLines.split('\n').pop()?.trim(),
      };
    }
  }

  // Check for completion
  for (const pattern of COMPLETION_PATTERNS) {
    if (pattern.test(lastLines)) {
      return { type: 'completed' };
    }
  }

  return {
    type: 'running',
    lastLine: lastLines.split('\n').filter(l => l.trim()).pop()?.trim(),
  };
}

export function classifyRisk(tool: string, description: string): 'low' | 'medium' | 'high' {
  // High risk: destructive operations
  if (/rm\s+-rf|git\s+push\s+--force|git\s+reset\s+--hard|DROP\s+TABLE|--no-verify/i.test(description)) {
    return 'high';
  }

  // Medium risk: writes, network, installs
  if (tool === 'Bash' && /npm\s+install|pip\s+install|curl|wget|docker|apt-get/i.test(description)) {
    return 'medium';
  }
  if (tool === 'Write' || tool === 'Edit') {
    return 'medium';
  }
  if (tool === 'WebFetch' || tool === 'WebSearch') {
    return 'medium';
  }

  // Low risk: reads, searches
  if (tool === 'Read' || tool === 'Glob' || tool === 'Grep') {
    return 'low';
  }
  if (tool === 'Bash' && /^(ls|cat|head|tail|git\s+(status|log|diff|branch)|find|echo|pwd|wc)/i.test(description)) {
    return 'low';
  }

  return 'medium';
}
