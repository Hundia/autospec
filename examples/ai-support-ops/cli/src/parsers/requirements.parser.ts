/**
 * Requirements Parser
 * Parses SRS, PRD, or plain requirements documents into structured format
 */

import yaml from 'yaml';

export interface Requirement {
  id: string;
  description: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
  type: 'functional' | 'non_functional';
  owner?: string;
}

export interface UserPersona {
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
}

export interface UserFlow {
  name: string;
  steps: string[];
  successCriteria: string[];
}

export interface ParsedRequirements {
  projectName: string;
  description: string;
  problemStatement?: string;
  successState?: string;
  personas: UserPersona[];
  userFlows: UserFlow[];
  requirements: Requirement[];
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
    language?: string;
  };
  constraints: string[];
  assumptions: string[];
  outOfScope: string[];
}

/**
 * Parse priority from text
 */
function parsePriority(text: string): Requirement['priority'] {
  const lower = text.toLowerCase();
  if (lower.includes('must') || lower.includes('critical') || lower.includes('required')) {
    return 'must_have';
  }
  if (lower.includes('should') || lower.includes('high') || lower.includes('important')) {
    return 'should_have';
  }
  return 'nice_to_have';
}

/**
 * Extract sections from markdown
 */
function extractSections(content: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = content.split('\n');

  let currentSection = '';
  let sectionContent: string[] = [];

  for (const line of lines) {
    // Match ## or ### headers
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/);

    if (headerMatch) {
      // Save previous section
      if (currentSection) {
        sections.set(currentSection.toLowerCase(), sectionContent.join('\n').trim());
      }
      currentSection = headerMatch[1].trim();
      sectionContent = [];
    } else {
      sectionContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections.set(currentSection.toLowerCase(), sectionContent.join('\n').trim());
  }

  return sections;
}

/**
 * Extract bullet points from markdown content
 */
function extractBulletPoints(content: string): string[] {
  const lines = content.split('\n');
  const points: string[] = [];

  for (const line of lines) {
    const match = line.match(/^[-*]\s+(.+)$/);
    if (match) {
      points.push(match[1].trim());
    }
  }

  return points;
}

/**
 * Extract requirements from a section
 */
function extractRequirements(content: string, type: 'functional' | 'non_functional'): Requirement[] {
  const requirements: Requirement[] = [];
  const lines = content.split('\n');

  let counter = 1;
  for (const line of lines) {
    // Match lines with requirements (bullet points or table rows)
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const tableMatch = line.match(/\|\s*\w+-\d+\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);

    if (bulletMatch) {
      const text = bulletMatch[1];
      requirements.push({
        id: `${type === 'functional' ? 'FR' : 'NFR'}-${counter++}`,
        description: text,
        priority: parsePriority(text),
        type,
      });
    } else if (tableMatch) {
      requirements.push({
        id: `${type === 'functional' ? 'FR' : 'NFR'}-${counter++}`,
        description: tableMatch[1].trim(),
        priority: parsePriority(tableMatch[2]),
        type,
      });
    }
  }

  return requirements;
}

/**
 * Parse tech stack from content
 */
function extractTechStack(content: string): ParsedRequirements['techStack'] {
  const stack: ParsedRequirements['techStack'] = {};

  // Look for common patterns
  const frontendMatch = content.match(/frontend[:\s]+([^\n,]+)/i);
  const backendMatch = content.match(/backend[:\s]+([^\n,]+)/i);
  const databaseMatch = content.match(/database[:\s]+([^\n,]+)/i);
  const languageMatch = content.match(/language[:\s]+([^\n,]+)/i);

  if (frontendMatch) stack.frontend = frontendMatch[1].trim();
  if (backendMatch) stack.backend = backendMatch[1].trim();
  if (databaseMatch) stack.database = databaseMatch[1].trim();
  if (languageMatch) stack.language = languageMatch[1].trim();

  // Also check for common framework mentions
  if (!stack.frontend) {
    if (content.match(/react/i)) stack.frontend = 'React';
    else if (content.match(/vue/i)) stack.frontend = 'Vue';
    else if (content.match(/angular/i)) stack.frontend = 'Angular';
    else if (content.match(/next\.?js/i)) stack.frontend = 'Next.js';
  }

  if (!stack.backend) {
    if (content.match(/node\.?js|express/i)) stack.backend = 'Node.js';
    else if (content.match(/python|django|flask|fastapi/i)) stack.backend = 'Python';
    else if (content.match(/rails|ruby/i)) stack.backend = 'Ruby on Rails';
    else if (content.match(/\.net|c#/i)) stack.backend = '.NET';
  }

  if (!stack.database) {
    if (content.match(/postgres/i)) stack.database = 'PostgreSQL';
    else if (content.match(/mysql/i)) stack.database = 'MySQL';
    else if (content.match(/mongo/i)) stack.database = 'MongoDB';
    else if (content.match(/sqlite/i)) stack.database = 'SQLite';
  }

  if (!stack.language) {
    if (content.match(/typescript/i)) stack.language = 'TypeScript';
    else if (content.match(/javascript/i)) stack.language = 'JavaScript';
    else if (content.match(/python/i)) stack.language = 'Python';
  }

  return stack;
}

/**
 * Parse personas from content
 */
function extractPersonas(content: string): UserPersona[] {
  const personas: UserPersona[] = [];

  // Look for persona sections
  const personaMatches = content.matchAll(/(?:###?\s*)?(?:Primary|Secondary)?\s*Persona[:\s]+(.+?)(?=###|Persona|$)/gis);

  for (const match of personaMatches) {
    const personaContent = match[1];
    const nameMatch = personaContent.match(/^([^\n]+)/);

    if (nameMatch) {
      const persona: UserPersona = {
        name: nameMatch[1].trim(),
        description: '',
        goals: [],
        painPoints: [],
      };

      // Extract goals
      const goalsMatch = personaContent.match(/goals?[:\s]*([\s\S]*?)(?=pain|$)/i);
      if (goalsMatch) {
        persona.goals = extractBulletPoints(goalsMatch[1]);
      }

      // Extract pain points
      const painMatch = personaContent.match(/pain\s*points?[:\s]*([\s\S]*?)(?=goals?|$)/i);
      if (painMatch) {
        persona.painPoints = extractBulletPoints(painMatch[1]);
      }

      if (persona.name && persona.name !== 'Persona') {
        personas.push(persona);
      }
    }
  }

  return personas;
}

/**
 * Parse user flows from content
 */
function extractUserFlows(content: string): UserFlow[] {
  const flows: UserFlow[] = [];

  // Look for flow sections
  const flowMatches = content.matchAll(/(?:###?\s*)?Flow\s*\d*[:\s]+(.+?)(?=###|Flow|$)/gis);

  for (const match of flowMatches) {
    const flowContent = match[1];
    const nameMatch = flowContent.match(/^([^\n]+)/);

    if (nameMatch) {
      const flow: UserFlow = {
        name: nameMatch[1].trim(),
        steps: [],
        successCriteria: [],
      };

      // Extract steps
      const stepsMatch = flowContent.match(/steps?[:\s]*([\s\S]*?)(?=success|criteria|$)/i);
      if (stepsMatch) {
        flow.steps = extractBulletPoints(stepsMatch[1]);
      }

      // Also check numbered steps
      const numberedSteps = flowContent.match(/\d+\.\s+(.+)/g);
      if (numberedSteps) {
        flow.steps.push(...numberedSteps.map(s => s.replace(/^\d+\.\s+/, '')));
      }

      // Extract success criteria
      const criteriaMatch = flowContent.match(/(?:success\s*)?criteria[:\s]*([\s\S]*?)$/i);
      if (criteriaMatch) {
        flow.successCriteria = extractBulletPoints(criteriaMatch[1]);
      }

      if (flow.name && flow.steps.length > 0) {
        flows.push(flow);
      }
    }
  }

  return flows;
}

/**
 * Parse markdown requirements document
 */
export function parseMarkdownRequirements(content: string): ParsedRequirements {
  const sections = extractSections(content);

  // Extract project name from title
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const projectName = titleMatch?.[1]?.replace(/SRS|PRD|Requirements/gi, '').trim() || 'Unknown Project';

  // Extract description
  let description = '';
  const descSection = sections.get('description') || sections.get('overview') || sections.get('product vision');
  if (descSection) {
    description = descSection.split('\n')[0]?.trim() || '';
  }

  // Extract problem statement
  const problemSection = sections.get('problem statement') || sections.get('problem');
  const problemStatement = problemSection?.split('\n').filter(l => l.trim())[0]?.trim();

  // Extract success state
  const successSection = sections.get('success state') || sections.get('goals');
  const successState = successSection?.split('\n').filter(l => l.trim())[0]?.trim();

  // Extract requirements
  const functionalSection = sections.get('functional requirements') || sections.get('features') || '';
  const nonFunctionalSection = sections.get('non-functional requirements') || sections.get('nfr') || '';

  const functionalReqs = extractRequirements(functionalSection, 'functional');
  const nonFunctionalReqs = extractRequirements(nonFunctionalSection, 'non_functional');

  // If no structured requirements found, try to extract from full content
  if (functionalReqs.length === 0) {
    // Look for any bullet point lists that might be requirements
    const allBullets = extractBulletPoints(content);
    allBullets.slice(0, 10).forEach((bullet, i) => {
      functionalReqs.push({
        id: `FR-${i + 1}`,
        description: bullet,
        priority: 'should_have',
        type: 'functional',
      });
    });
  }

  // Extract other sections
  const constraintsSection = sections.get('constraints') || '';
  const assumptionsSection = sections.get('assumptions') || '';
  const outOfScopeSection = sections.get('out of scope') || sections.get('scope exclusions') || '';

  return {
    projectName,
    description,
    problemStatement,
    successState,
    personas: extractPersonas(content),
    userFlows: extractUserFlows(content),
    requirements: [...functionalReqs, ...nonFunctionalReqs],
    techStack: extractTechStack(content),
    constraints: extractBulletPoints(constraintsSection),
    assumptions: extractBulletPoints(assumptionsSection),
    outOfScope: extractBulletPoints(outOfScopeSection),
  };
}

/**
 * Parse JSON requirements document
 */
export function parseJSONRequirements(content: string): ParsedRequirements {
  try {
    const data = JSON.parse(content);

    return {
      projectName: data.projectName || data.name || 'Unknown Project',
      description: data.description || '',
      problemStatement: data.problemStatement || data.problem,
      successState: data.successState || data.goals,
      personas: data.personas || [],
      userFlows: data.userFlows || data.flows || [],
      requirements: (data.requirements || []).map((r: any, i: number) => ({
        id: r.id || `REQ-${i + 1}`,
        description: r.description || r.text || '',
        priority: parsePriority(r.priority || 'should_have'),
        type: r.type || 'functional',
      })),
      techStack: data.techStack || {},
      constraints: data.constraints || [],
      assumptions: data.assumptions || [],
      outOfScope: data.outOfScope || [],
    };
  } catch (error) {
    throw new Error(`Failed to parse JSON requirements: ${error}`);
  }
}

/**
 * Parse YAML requirements document
 */
export function parseYAMLRequirements(content: string): ParsedRequirements {
  try {
    const data = yaml.parse(content);
    return parseJSONRequirements(JSON.stringify(data));
  } catch (error) {
    throw new Error(`Failed to parse YAML requirements: ${error}`);
  }
}

/**
 * Parse plain text requirements (simple bullet list)
 */
export function parsePlainTextRequirements(content: string): ParsedRequirements {
  const lines = content.split('\n').filter(l => l.trim());

  // First non-empty line is project name
  const projectName = lines[0]?.replace(/^[#-*]\s*/, '').trim() || 'Unknown Project';

  // Rest are requirements
  const requirements: Requirement[] = [];
  let counter = 1;

  for (const line of lines.slice(1)) {
    const text = line.replace(/^[-*\d.]+\s*/, '').trim();
    if (text) {
      requirements.push({
        id: `FR-${counter++}`,
        description: text,
        priority: parsePriority(text),
        type: 'functional',
      });
    }
  }

  return {
    projectName,
    description: '',
    personas: [],
    userFlows: [],
    requirements,
    techStack: extractTechStack(content),
    constraints: [],
    assumptions: [],
    outOfScope: [],
  };
}

/**
 * Auto-detect format and parse requirements
 */
export function parseRequirements(content: string, format?: 'markdown' | 'json' | 'yaml' | 'text'): ParsedRequirements {
  // Auto-detect format if not specified
  if (!format) {
    const trimmed = content.trim();
    if (trimmed.startsWith('{')) {
      format = 'json';
    } else if (trimmed.match(/^[\w-]+:\s/m)) {
      format = 'yaml';
    } else if (trimmed.includes('#')) {
      format = 'markdown';
    } else {
      format = 'text';
    }
  }

  switch (format) {
    case 'json':
      return parseJSONRequirements(content);
    case 'yaml':
      return parseYAMLRequirements(content);
    case 'markdown':
      return parseMarkdownRequirements(content);
    case 'text':
    default:
      return parsePlainTextRequirements(content);
  }
}
