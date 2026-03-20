/**
 * Unit tests for Spec Generator
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSpec } from '../../src/generators/spec.generator.js';

describe('Spec Generator', () => {
  describe('generateSpec', () => {
    it('should generate product manager spec', async () => {
      const content = await generateSpec('product_manager', {
        projectName: 'Test Project',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# SPEC: Product Manager');
      expect(content).toContain('Test Project');
      expect(content).toContain('## 1. Product Vision');
      expect(content).toContain('## 2. Target Users');
    });

    it('should generate backend lead spec', async () => {
      const content = await generateSpec('backend_lead', {
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# SPEC: Backend Lead');
      expect(content).toContain('## 1. Architecture Overview');
      expect(content).toContain('## 3. API Design Principles');
    });

    it('should generate frontend lead spec', async () => {
      const content = await generateSpec('frontend_lead', {
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# SPEC: Frontend Lead');
      expect(content).toContain('## 3. Design System');
      expect(content).toContain('## 4. Component Patterns');
    });

    it('should generate db architect spec', async () => {
      const content = await generateSpec('db_architect', {
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# SPEC: Database Architect');
      expect(content).toContain('## 2. Schema Design Principles');
      expect(content).toContain('## 3. Tables');
    });

    it('should generate qa lead spec', async () => {
      const content = await generateSpec('qa_lead', {
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# SPEC: QA Lead');
      expect(content).toContain('## 1. Testing Strategy');
      expect(content).toContain('## 3. QA Process');
    });

    it('should generate devops lead spec', async () => {
      const content = await generateSpec('devops_lead', {
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      expect(content).toContain('# SPEC: DevOps Lead');
      expect(content).toContain('## 1. Infrastructure Overview');
      expect(content).toContain('## 3. Docker Configuration');
    });

    it('should include tech stack from requirements', async () => {
      const content = await generateSpec('backend_lead', {
        projectName: 'Test',
        outputDir: '/tmp/test',
        requirements: {
          projectName: 'Test',
          description: '',
          personas: [],
          userFlows: [],
          requirements: [],
          techStack: {
            backend: 'FastAPI',
            database: 'MongoDB',
            language: 'Python',
          },
          constraints: [],
          assumptions: [],
          outOfScope: [],
        },
      });

      expect(content).toContain('FastAPI');
      expect(content).toContain('MongoDB');
    });

    it('should include problem statement in product manager spec', async () => {
      const content = await generateSpec('product_manager', {
        projectName: 'Test',
        outputDir: '/tmp/test',
        requirements: {
          projectName: 'Test',
          description: 'A task management app',
          problemStatement: 'Users cannot track tasks effectively',
          personas: [],
          userFlows: [],
          requirements: [],
          techStack: {},
          constraints: [],
          assumptions: [],
          outOfScope: [],
        },
      });

      expect(content).toContain('Users cannot track tasks effectively');
    });

    it('should include requirements in product manager spec', async () => {
      const content = await generateSpec('product_manager', {
        projectName: 'Test',
        outputDir: '/tmp/test',
        requirements: {
          projectName: 'Test',
          description: '',
          personas: [],
          userFlows: [],
          requirements: [
            { id: 'FR-1', description: 'User authentication', priority: 'must_have', type: 'functional' },
            { id: 'NFR-1', description: 'Page load < 2s', priority: 'must_have', type: 'non_functional' },
          ],
          techStack: {},
          constraints: ['Budget limited'],
          assumptions: ['Team available'],
          outOfScope: ['Mobile app'],
        },
      });

      expect(content).toContain('User authentication');
      expect(content).toContain('Budget limited');
    });

    it('should throw error for unknown template', async () => {
      await expect(
        generateSpec('unknown_template', {
          projectName: 'Test',
          outputDir: '/tmp/test',
        })
      ).rejects.toThrow('Template not found');
    });

    it('should include date in generated spec', async () => {
      const content = await generateSpec('product_manager', {
        projectName: 'Test',
        outputDir: '/tmp/test',
      });

      // Should have a date in YYYY-MM-DD format
      expect(content).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });
});
