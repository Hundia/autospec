/**
 * Unit tests for Requirements Parser
 */

import { describe, it, expect } from 'vitest';
import {
  parseRequirements,
  parseMarkdownRequirements,
  parseJSONRequirements,
  parsePlainTextRequirements,
} from '../../src/parsers/requirements.parser.js';

const SAMPLE_MARKDOWN = `# My Project SRS

## Description
A web application for managing tasks.

## Problem Statement
Users struggle to track their daily tasks effectively.

## Success State
Users can easily create, organize, and complete tasks.

## Functional Requirements
- Users can create tasks
- Users can mark tasks as complete
- Users can organize tasks into categories

## Non-Functional Requirements
- Page load time < 2 seconds
- 99.9% uptime

## Tech Stack
- Frontend: React
- Backend: Node.js
- Database: PostgreSQL
- Language: TypeScript

## Constraints
- Must work offline
- Must support mobile

## Assumptions
- Users have internet access
- Users have modern browsers

## Out of Scope
- Calendar integration
- Team collaboration
`;

const SAMPLE_JSON = `{
  "projectName": "Task Manager",
  "description": "A task management application",
  "problemStatement": "Users need better task tracking",
  "successState": "Easy task management",
  "techStack": {
    "frontend": "Vue",
    "backend": "Python",
    "database": "MongoDB"
  },
  "requirements": [
    { "id": "REQ-1", "description": "Create tasks", "priority": "must_have", "type": "functional" },
    { "id": "REQ-2", "description": "Delete tasks", "priority": "should_have", "type": "functional" }
  ],
  "constraints": ["Budget limited"],
  "assumptions": ["Team is available"],
  "outOfScope": ["Mobile app"]
}`;

const SAMPLE_PLAIN = `Task Tracker
- Create new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks complete
- Filter by status
`;

describe('Requirements Parser', () => {
  describe('parseMarkdownRequirements', () => {
    it('should parse project name', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);
      expect(result.projectName).toBe('My Project');
    });

    it('should parse description', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);
      expect(result.description).toBe('A web application for managing tasks.');
    });

    it('should parse problem statement', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);
      expect(result.problemStatement).toBe('Users struggle to track their daily tasks effectively.');
    });

    it('should parse functional requirements', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);
      const functional = result.requirements.filter(r => r.type === 'functional');

      expect(functional.length).toBeGreaterThan(0);
      expect(functional[0].description).toContain('create tasks');
    });

    it('should parse tech stack', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);

      expect(result.techStack.frontend).toBe('React');
      expect(result.techStack.backend).toBe('Node.js');
      expect(result.techStack.database).toBe('PostgreSQL');
    });

    it('should parse constraints', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);

      expect(result.constraints).toContain('Must work offline');
      expect(result.constraints).toContain('Must support mobile');
    });

    it('should parse out of scope', () => {
      const result = parseMarkdownRequirements(SAMPLE_MARKDOWN);

      expect(result.outOfScope).toContain('Calendar integration');
    });
  });

  describe('parseJSONRequirements', () => {
    it('should parse project name', () => {
      const result = parseJSONRequirements(SAMPLE_JSON);
      expect(result.projectName).toBe('Task Manager');
    });

    it('should parse requirements', () => {
      const result = parseJSONRequirements(SAMPLE_JSON);

      expect(result.requirements).toHaveLength(2);
      expect(result.requirements[0].id).toBe('REQ-1');
    });

    it('should parse tech stack', () => {
      const result = parseJSONRequirements(SAMPLE_JSON);

      expect(result.techStack.frontend).toBe('Vue');
      expect(result.techStack.backend).toBe('Python');
      expect(result.techStack.database).toBe('MongoDB');
    });

    it('should throw on invalid JSON', () => {
      expect(() => parseJSONRequirements('not json')).toThrow();
    });
  });

  describe('parsePlainTextRequirements', () => {
    it('should parse project name from first line', () => {
      const result = parsePlainTextRequirements(SAMPLE_PLAIN);
      expect(result.projectName).toBe('Task Tracker');
    });

    it('should parse bullet points as requirements', () => {
      const result = parsePlainTextRequirements(SAMPLE_PLAIN);

      expect(result.requirements.length).toBeGreaterThan(0);
      expect(result.requirements[0].description).toContain('Create new tasks');
    });
  });

  describe('parseRequirements (auto-detect)', () => {
    it('should auto-detect markdown format', () => {
      const result = parseRequirements(SAMPLE_MARKDOWN);
      expect(result.projectName).toBe('My Project');
    });

    it('should auto-detect JSON format', () => {
      const result = parseRequirements(SAMPLE_JSON);
      expect(result.projectName).toBe('Task Manager');
    });

    it('should auto-detect plain text format', () => {
      const result = parseRequirements(SAMPLE_PLAIN);
      expect(result.projectName).toBe('Task Tracker');
    });

    it('should respect explicit format', () => {
      const result = parseRequirements(SAMPLE_MARKDOWN, 'markdown');
      expect(result.projectName).toBe('My Project');
    });
  });
});

describe('Priority Detection', () => {
  it('should detect must have priority', () => {
    const content = `# Project
## Functional Requirements
- Must have user authentication
`;
    const result = parseMarkdownRequirements(content);
    const req = result.requirements.find(r => r.description.includes('authentication'));
    expect(req?.priority).toBe('must_have');
  });

  it('should detect should have priority', () => {
    const content = `# Project
## Functional Requirements
- Should have email notifications
`;
    const result = parseMarkdownRequirements(content);
    const req = result.requirements.find(r => r.description.includes('notifications'));
    expect(req?.priority).toBe('should_have');
  });
});

describe('Tech Stack Detection', () => {
  it('should detect React from content', () => {
    const content = `# Project

## Tech Stack
- Frontend: React
- Language: TypeScript
`;
    const result = parseMarkdownRequirements(content);
    expect(result.techStack.frontend).toBe('React');
    expect(result.techStack.language).toBe('TypeScript');
  });

  it('should detect Vue from content', () => {
    const content = `# Project
Built with Vue.js frontend.
`;
    const result = parseMarkdownRequirements(content);
    expect(result.techStack.frontend).toBe('Vue');
  });

  it('should detect PostgreSQL from content', () => {
    const content = `# Project
Data stored in PostgreSQL database.
`;
    const result = parseMarkdownRequirements(content);
    expect(result.techStack.database).toBe('PostgreSQL');
  });
});
