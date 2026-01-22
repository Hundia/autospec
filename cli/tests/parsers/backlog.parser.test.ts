/**
 * Unit tests for Backlog Parser
 */

import { describe, it, expect } from 'vitest';
import {
  parseBacklog,
  getBacklogStats,
  getSprintStats,
} from '../../src/parsers/backlog.parser.js';

const SAMPLE_BACKLOG = `# Test Project Product Backlog

**Created:** 2026-01-21
**Last Updated:** 2026-01-21

---

## Status Legend

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Currently being worked on |
| 🧪 | QA Review | Implementation complete, needs testing |
| ✅ | Done | Tested and verified |
| ⏸️ | Blocked | Cannot proceed |

---

## ✅ Sprint 0: Foundation & Setup — COMPLETE

**Goal:** Set up project infrastructure.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize git repository | ✅ Done | DevOps | haiku |
| 0.2 | Create Docker environment | ✅ Done | DevOps | sonnet |
| 0.3 | Set up database | ✅ Done | Backend | haiku |

### Dependencies
- None

### Definition of Done
- [ ] Docker runs successfully
- [ ] Backend responds to health check

---

## 🔄 Sprint 1: Core Features — ACTIVE

**Goal:** Implement core features.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 1.1 | Create user API | ✅ Done | Backend | sonnet |
| 1.2 | Create user UI | 🔄 In Progress | Frontend | sonnet |
| 1.3 | Add validation | 🧪 QA Review | Backend | haiku |
| 1.4 | Write tests | 🔲 Todo | QA | sonnet |
| 1.5 | Add auth | 🔲 Todo | Backend | opus |

### Dependencies
- Sprint 0 complete

### Definition of Done
- [ ] All user features work
- [ ] Tests pass

---

## 🔲 Sprint 2: Advanced Features — PLANNED

**Goal:** Add advanced features.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 2.1 | Feature A | 🔲 Todo | Backend | sonnet |
| 2.2 | Feature B | 🔲 Todo | Frontend | sonnet |

### Dependencies
- Sprint 1 complete

---

## Bug Backlog

| # | Bug | Status | Severity | Sprint |
|---|-----|--------|----------|--------|
| B.1 | Fix login issue | 🔄 In Progress | High | 1 |

---

*Last updated: 2026-01-21*
`;

describe('Backlog Parser', () => {
  describe('parseBacklog', () => {
    it('should parse project name', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      expect(result.projectName).toBe('Test Project');
    });

    it('should parse dates', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      expect(result.created).toBe('2026-01-21');
      expect(result.lastUpdated).toBe('2026-01-21');
    });

    it('should parse all sprints', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      expect(result.sprints).toHaveLength(3);
    });

    it('should parse sprint status correctly', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);

      expect(result.sprints[0].status).toBe('complete');
      expect(result.sprints[1].status).toBe('active');
      expect(result.sprints[2].status).toBe('planned');
    });

    it('should parse sprint goals', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      expect(result.sprints[0].goal).toBe('Set up project infrastructure.');
      expect(result.sprints[1].goal).toBe('Implement core features.');
    });

    it('should parse tickets in each sprint', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);

      expect(result.sprints[0].tickets).toHaveLength(3);
      expect(result.sprints[1].tickets).toHaveLength(5);
      expect(result.sprints[2].tickets).toHaveLength(2);
    });

    it('should parse ticket details correctly', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      const ticket = result.sprints[1].tickets[0];

      expect(ticket.number).toBe('1.1');
      expect(ticket.description).toBe('Create user API');
      expect(ticket.status).toBe('done');
      expect(ticket.owner).toBe('Backend');
      expect(ticket.model).toBe('sonnet');
    });

    it('should parse various ticket statuses', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      const sprint1 = result.sprints[1];

      expect(sprint1.tickets[0].status).toBe('done');
      expect(sprint1.tickets[1].status).toBe('in_progress');
      expect(sprint1.tickets[2].status).toBe('qa_review');
      expect(sprint1.tickets[3].status).toBe('todo');
    });

    it('should parse definition of done', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      expect(result.sprints[0].definitionOfDone).toContain('Docker runs successfully');
    });

    it('should parse bugs', () => {
      const result = parseBacklog(SAMPLE_BACKLOG);
      expect(result.bugs).toHaveLength(1);
      expect(result.bugs[0].number).toBe('B.1');
    });
  });

  describe('getBacklogStats', () => {
    it('should calculate total tickets', () => {
      const backlog = parseBacklog(SAMPLE_BACKLOG);
      const stats = getBacklogStats(backlog);

      expect(stats.totalTickets).toBe(10); // 3 + 5 + 2
    });

    it('should calculate completed tickets', () => {
      const backlog = parseBacklog(SAMPLE_BACKLOG);
      const stats = getBacklogStats(backlog);

      expect(stats.completedTickets).toBe(4); // 3 from sprint 0 + 1 from sprint 1
    });

    it('should identify current sprint', () => {
      const backlog = parseBacklog(SAMPLE_BACKLOG);
      const stats = getBacklogStats(backlog);

      expect(stats.currentSprint).not.toBeNull();
      expect(stats.currentSprint?.number).toBe(1);
    });

    it('should calculate completion percentage', () => {
      const backlog = parseBacklog(SAMPLE_BACKLOG);
      const stats = getBacklogStats(backlog);

      expect(stats.completionPercentage).toBe(40); // 4/10 = 40%
    });
  });

  describe('getSprintStats', () => {
    it('should calculate sprint statistics', () => {
      const backlog = parseBacklog(SAMPLE_BACKLOG);
      const sprint1 = backlog.sprints[1];
      const stats = getSprintStats(sprint1);

      expect(stats.total).toBe(5);
      expect(stats.done).toBe(1);
      expect(stats.inProgress).toBe(1);
      expect(stats.qa).toBe(1);
      expect(stats.todo).toBe(2);
      expect(stats.blocked).toBe(0);
      expect(stats.percentage).toBe(20); // 1/5 = 20%
    });
  });
});

describe('Edge Cases', () => {
  it('should handle empty backlog', () => {
    const result = parseBacklog('# Empty Project Backlog\n\n');
    expect(result.sprints).toHaveLength(0);
  });

  it('should handle backlog without dates', () => {
    const result = parseBacklog('# Project\n## Sprint 0: Setup\n');
    expect(result.created).toBe('');
  });

  it('should handle malformed ticket rows', () => {
    const content = `# Project
## Sprint 0: Setup
| # | Ticket |
| 0.1 | Test |
`;
    const result = parseBacklog(content);
    // Should not crash, may or may not parse the malformed row
    expect(result).toBeDefined();
  });
});
