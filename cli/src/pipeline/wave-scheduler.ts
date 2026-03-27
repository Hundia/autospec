/**
 * Wave Scheduler — Dependency graph + topological wave grouping.
 * Enables parallel generation by grouping independent specs into waves.
 *
 * Sprint 36 ticket 36.1
 */

import { SPEC_ROLES } from './generate-specs.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpecDependency {
  specId: string;
  dependsOn: string[];
}

export interface Wave {
  index: number;
  specs: typeof SPEC_ROLES[number][];
  dependencies: Record<string, string[]>; // specId → dependency IDs for selective summaries
}

// ---------------------------------------------------------------------------
// Static dependency graph
// ---------------------------------------------------------------------------

export const DEPENDENCY_GRAPH: Record<string, string[]> = {
  '01_product_manager': [],
  '02_backend_lead':    ['01_product_manager'],
  '03_frontend_lead':   ['01_product_manager', '02_backend_lead'],
  '04_db_architect':    ['01_product_manager', '02_backend_lead'],
  '05_qa_lead':         ['01_product_manager', '02_backend_lead', '03_frontend_lead'],
  '06_devops_lead':     ['02_backend_lead', '04_db_architect'],
  '07_marketing_lead':  ['01_product_manager'],
  '08_finance_lead':    ['01_product_manager', '07_marketing_lead'],
  '09_business_lead':   ['01_product_manager', '07_marketing_lead'],
  '10_ui_designer':     ['01_product_manager', '03_frontend_lead'],
  'backlog':            ['01_product_manager', '02_backend_lead', '03_frontend_lead', '04_db_architect'],
};

// ---------------------------------------------------------------------------
// computeWaves
// ---------------------------------------------------------------------------

/**
 * Compute generation waves from the dependency graph using topological grouping.
 * A spec goes in the earliest wave where all its dependencies are satisfied.
 * Wave index starts at 0 (first spec group after metadata extraction).
 *
 * Results in 5 waves (indices 0-4) for the default 11 specs:
 *   Wave 0: [01_product_manager]
 *   Wave 1: [02_backend_lead, 07_marketing_lead]
 *   Wave 2: [03_frontend_lead, 04_db_architect, 08_finance_lead, 09_business_lead]
 *   Wave 3: [05_qa_lead, 06_devops_lead, 10_ui_designer]
 *   Wave 4: [backlog]
 */
export function computeWaves(specRoles: typeof SPEC_ROLES): Wave[] {
  // Map specId → wave index
  const waveOf = new Map<string, number>();

  // BFS / Kahn's-style: for each spec, wave = max(wave of deps) + 1
  // Process in order of SPEC_ROLES so we respect the declared order
  for (const spec of specRoles) {
    const deps = DEPENDENCY_GRAPH[spec.id] ?? [];
    if (deps.length === 0) {
      waveOf.set(spec.id, 0);
    } else {
      let maxDepWave = -1;
      for (const dep of deps) {
        const depWave = waveOf.get(dep);
        if (depWave === undefined) {
          // Dependency not in specRoles or not yet processed; default to 0
          maxDepWave = Math.max(maxDepWave, 0);
        } else {
          maxDepWave = Math.max(maxDepWave, depWave);
        }
      }
      waveOf.set(spec.id, maxDepWave + 1);
    }
  }

  // Determine total number of waves
  const maxWave = Math.max(...waveOf.values());
  const waves: Wave[] = [];

  for (let w = 0; w <= maxWave; w++) {
    const specsInWave = specRoles.filter(s => waveOf.get(s.id) === w);
    if (specsInWave.length === 0) continue;

    const dependencies: Record<string, string[]> = {};
    for (const spec of specsInWave) {
      dependencies[spec.id] = DEPENDENCY_GRAPH[spec.id] ?? [];
    }

    waves.push({
      index: waves.length, // re-index sequentially (no gaps)
      specs: specsInWave as typeof SPEC_ROLES[number][],
      dependencies,
    });
  }

  return waves;
}

// ---------------------------------------------------------------------------
// selectSummaries
// ---------------------------------------------------------------------------

/**
 * Filter the summaries map to only those a given spec actually depends on.
 * Pure function — safe to call concurrently.
 */
export function selectSummaries(
  allSummaries: Record<string, string>,
  specId: string,
): Record<string, string> {
  const deps = DEPENDENCY_GRAPH[specId] ?? [];
  const selected: Record<string, string> = {};
  for (const dep of deps) {
    if (allSummaries[dep]) {
      selected[dep] = allSummaries[dep];
    }
  }
  return selected;
}
