/**
 * Unit tests for Backlog Generator
 */

import { describe, it, expect } from 'vitest';
import { generateBacklogContent } from '../../src/generators/backlog.generator.js';

describe('Backlog Generator', () => {
  describe('generateBacklogContent', () => {
    it('should include project name', () => {
      const content = generateBacklogContent({
        projectName: 'Test Project',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# Test Project Product Backlog');
    });

    it('should include status legend', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('## Status Legend');
      expect(content).toContain('| Todo | Not started |');
      expect(content).toContain('| In Progress |');
      expect(content).toContain('| QA Review |');
      expect(content).toContain('| Done |');
      expect(content).toContain('| Blocked |');
    });

    it('should include Sprint 0 as active', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('Sprint 0: Foundation & Setup');
      expect(content).toContain('ACTIVE');
    });

    it('should include Sprint 0 foundation tickets', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('Initialize git repository');
      expect(content).toContain('Create Docker development environment');
      expect(content).toContain('Set up testing frameworks');
    });

    it('should include tech stack from options', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
        requirements: {
          projectName: 'Test',
          description: 'Test project',
          personas: [],
          userFlows: [],
          requirements: [],
          techStack: {
            frontend: 'Vue',
            backend: 'Python',
            database: 'MongoDB',
            language: 'Python',
          },
          constraints: [],
          assumptions: [],
          outOfScope: [],
        },
      });

      expect(content).toContain('Vue');
      expect(content).toContain('Python');
      expect(content).toContain('MongoDB');
    });

    it('should include team specs reference', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('## Team Specs Reference');
      expect(content).toContain('product_manager.md');
      expect(content).toContain('backend_lead.md');
      expect(content).toContain('frontend_lead.md');
    });

    it('should include architecture diagram', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('## Architecture Vision');
      expect(content).toContain('Frontend');
      expect(content).toContain('Backend');
      expect(content).toContain('Database');
    });

    it('should include Sprint 1 placeholder', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('Sprint 1:');
      expect(content).toContain('PLANNED');
    });

    it('should include future sprints', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('## Future Sprints');
    });

    it('should include bug backlog section', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('## Bug Backlog');
    });

    it('should include definition of done', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('### Definition of Done');
      expect(content).toContain('docker-compose up');
    });

    it('should generate tickets from requirements', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
        requirements: {
          projectName: 'Test',
          description: 'Test project',
          personas: [],
          userFlows: [],
          requirements: [
            { id: 'FR-1', description: 'Create user API endpoint', priority: 'must_have', type: 'functional' },
            { id: 'FR-2', description: 'Build user profile UI component', priority: 'must_have', type: 'functional' },
          ],
          techStack: {},
          constraints: [],
          assumptions: [],
          outOfScope: [],
        },
      });

      expect(content).toContain('Create user API endpoint');
      expect(content).toContain('Build user profile UI component');
    });

    it('should assign owners based on ticket content', () => {
      const content = generateBacklogContent({
        projectName: 'Test',
        outputDir: '/tmp/test',
        requirements: {
          projectName: 'Test',
          description: '',
          personas: [],
          userFlows: [],
          requirements: [
            { id: 'FR-1', description: 'Create API endpoint', priority: 'must_have', type: 'functional' },
            { id: 'FR-2', description: 'Build UI component', priority: 'must_have', type: 'functional' },
          ],
          techStack: {},
          constraints: [],
          assumptions: [],
          outOfScope: [],
        },
      });

      // API should be assigned to Backend
      expect(content).toMatch(/API endpoint.*Backend/s);
      // UI should be assigned to Frontend
      expect(content).toMatch(/UI component.*Frontend/s);
    });
  });
});
