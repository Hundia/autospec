/**
 * Unit tests for wave-scheduler.ts
 * Sprint 36 ticket 36.7
 */

import { describe, it, expect } from 'vitest';
import { computeWaves, selectSummaries, DEPENDENCY_GRAPH } from '../../src/pipeline/wave-scheduler.js';
import { SPEC_ROLES } from '../../src/pipeline/generate-specs.js';

describe('computeWaves', () => {
  it('produces waves where each spec comes after all its dependencies', () => {
    const waves = computeWaves(SPEC_ROLES);
    const waveOf = new Map<string, number>();
    for (const wave of waves) {
      for (const spec of wave.specs) {
        waveOf.set(spec.id, wave.index);
      }
    }

    for (const [specId, deps] of Object.entries(DEPENDENCY_GRAPH)) {
      for (const dep of deps) {
        // Only check specs that exist in SPEC_ROLES
        if (waveOf.has(specId) && waveOf.has(dep)) {
          expect(waveOf.get(dep)!).toBeLessThan(
            waveOf.get(specId)!,
            `${dep} (wave ${waveOf.get(dep)}) must come before ${specId} (wave ${waveOf.get(specId)})`,
          );
        }
      }
    }
  });

  it('assigns PM to the first wave (no dependencies)', () => {
    const waves = computeWaves(SPEC_ROLES);
    const waveOf = new Map<string, number>();
    for (const wave of waves) {
      for (const spec of wave.specs) {
        waveOf.set(spec.id, wave.index);
      }
    }
    expect(waveOf.get('01_product_manager')).toBe(0);
  });

  it('assigns Backend and Marketing to the same wave (both depend only on PM)', () => {
    const waves = computeWaves(SPEC_ROLES);
    const waveOf = new Map<string, number>();
    for (const wave of waves) {
      for (const spec of wave.specs) {
        waveOf.set(spec.id, wave.index);
      }
    }
    expect(waveOf.get('02_backend_lead')).toBe(waveOf.get('07_marketing_lead'));
  });

  it('assigns Frontend and DB to the same wave (both depend on PM + Backend)', () => {
    const waves = computeWaves(SPEC_ROLES);
    const waveOf = new Map<string, number>();
    for (const wave of waves) {
      for (const spec of wave.specs) {
        waveOf.set(spec.id, wave.index);
      }
    }
    expect(waveOf.get('03_frontend_lead')).toBe(waveOf.get('04_db_architect'));
  });

  it('produces exactly 4 waves for the default 11 specs', () => {
    // Wave 0: PM
    // Wave 1: Backend, Marketing
    // Wave 2: Frontend, DB, Finance, Business
    // Wave 3: QA, DevOps, UI Designer, Backlog
    // (Backlog deps: PM+BE+FE+DB → max wave 2 → wave 3, same as QA/devops/designer)
    const waves = computeWaves(SPEC_ROLES);
    expect(waves).toHaveLength(4);
  });

  it('covers all 11 specs across all waves', () => {
    const waves = computeWaves(SPEC_ROLES);
    const allSpecIds = waves.flatMap(w => w.specs.map(s => s.id));
    expect(allSpecIds).toHaveLength(SPEC_ROLES.length);
    for (const spec of SPEC_ROLES) {
      expect(allSpecIds).toContain(spec.id);
    }
  });

  it('puts backlog in the last wave', () => {
    const waves = computeWaves(SPEC_ROLES);
    const lastWave = waves[waves.length - 1];
    expect(lastWave.specs.map(s => s.id)).toContain('backlog');
  });

  it('wave indices are sequential from 0', () => {
    const waves = computeWaves(SPEC_ROLES);
    waves.forEach((wave, i) => {
      expect(wave.index).toBe(i);
    });
  });

  it('each wave includes correct dependency metadata', () => {
    const waves = computeWaves(SPEC_ROLES);
    for (const wave of waves) {
      for (const spec of wave.specs) {
        expect(wave.dependencies[spec.id]).toEqual(DEPENDENCY_GRAPH[spec.id] ?? []);
      }
    }
  });
});

describe('selectSummaries', () => {
  const mockSummaries: Record<string, string> = {
    '01_product_manager': 'PM summary',
    '02_backend_lead': 'Backend summary',
    '03_frontend_lead': 'Frontend summary',
    '04_db_architect': 'DB summary',
    '07_marketing_lead': 'Marketing summary',
  };

  it('returns empty object for PM (no dependencies)', () => {
    const result = selectSummaries(mockSummaries, '01_product_manager');
    expect(result).toEqual({});
  });

  it('returns only PM summary for Backend Lead', () => {
    const result = selectSummaries(mockSummaries, '02_backend_lead');
    expect(Object.keys(result)).toEqual(['01_product_manager']);
    expect(result['01_product_manager']).toBe('PM summary');
  });

  it('returns PM + Backend + Frontend for QA Lead', () => {
    const result = selectSummaries(mockSummaries, '05_qa_lead');
    expect(Object.keys(result)).toHaveLength(3);
    expect(result).toHaveProperty('01_product_manager');
    expect(result).toHaveProperty('02_backend_lead');
    expect(result).toHaveProperty('03_frontend_lead');
  });

  it('returns PM + Marketing for Finance Lead', () => {
    const result = selectSummaries(mockSummaries, '08_finance_lead');
    expect(Object.keys(result).sort()).toEqual(
      ['01_product_manager', '07_marketing_lead'].sort(),
    );
  });

  it('returns PM + Marketing for Business Lead', () => {
    const result = selectSummaries(mockSummaries, '09_business_lead');
    expect(Object.keys(result).sort()).toEqual(
      ['01_product_manager', '07_marketing_lead'].sort(),
    );
  });

  it('returns PM + Backend + Frontend + DB for backlog', () => {
    const result = selectSummaries(mockSummaries, 'backlog');
    expect(Object.keys(result)).toHaveLength(4);
    expect(result).toHaveProperty('01_product_manager');
    expect(result).toHaveProperty('02_backend_lead');
    expect(result).toHaveProperty('03_frontend_lead');
    expect(result).toHaveProperty('04_db_architect');
  });

  it('does not include summaries for deps that are not yet available', () => {
    const partialSummaries = { '01_product_manager': 'PM summary' };
    // Backend needs PM only — both present
    const backendResult = selectSummaries(partialSummaries, '02_backend_lead');
    expect(Object.keys(backendResult)).toHaveLength(1);

    // QA needs PM + Backend + Frontend — only PM present
    const qaResult = selectSummaries(partialSummaries, '05_qa_lead');
    expect(Object.keys(qaResult)).toHaveLength(1);
    expect(qaResult).toHaveProperty('01_product_manager');
  });

  it('returns empty object for unknown spec id', () => {
    const result = selectSummaries(mockSummaries, 'unknown_spec');
    expect(result).toEqual({});
  });
});

describe('DEPENDENCY_GRAPH', () => {
  it('has entries for all 11 specs', () => {
    const expectedIds = SPEC_ROLES.map(s => s.id);
    for (const id of expectedIds) {
      expect(DEPENDENCY_GRAPH).toHaveProperty(id);
    }
  });

  it('all referenced dependencies exist as spec ids', () => {
    const knownIds = new Set(SPEC_ROLES.map(s => s.id));
    for (const [, deps] of Object.entries(DEPENDENCY_GRAPH)) {
      for (const dep of deps) {
        expect(knownIds).toContain(dep);
      }
    }
  });
});
