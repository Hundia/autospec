/**
 * Validate Specs — Pipeline Step 13
 *
 * Local validation only — no LLM calls.
 * Checks:
 *   - All 11 expected spec files exist
 *   - YAML frontmatter is present and parses cleanly
 *   - Required "role" and "source_hash" frontmatter fields are present
 *   - Per-role minimum line counts are met (warning only)
 *   - Required section headings are present (warning only)
 */

import { parse as parseYaml } from 'yaml';
import chalk from 'chalk';
import { readFile, exists } from '../utils/file.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ValidationIssue {
  specId: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  issues: ValidationIssue[];
}

// ---------------------------------------------------------------------------
// Per-role thresholds (from docs/cli/03_generate_pipeline.md Step 13 table)
// ---------------------------------------------------------------------------

const MIN_LINES: Record<string, number> = {
  '01_product_manager': 200,
  '02_backend_lead':    300,
  '03_frontend_lead':   250,
  '04_db_architect':    250,
  '05_qa_lead':         250,
  '06_devops_lead':     200,
  '07_marketing_lead':  150,
  '08_finance_lead':    150,
  '09_business_lead':   150,
  '10_ui_designer':     200,
  'backlog':            100,
};

// ---------------------------------------------------------------------------
// Required section headings per role (primary validation check)
// Section matching is case-insensitive substring match against heading text.
// ---------------------------------------------------------------------------

const REQUIRED_SECTIONS: Record<string, string[]> = {
  '01_product_manager': ['Vision', 'Personas', 'User Flows', 'MVP', 'Success Metrics'],
  '02_backend_lead':    ['API', 'Services', 'Auth', 'Data Model'],
  '03_frontend_lead':   ['Components', 'State', 'Routing', 'Design System'],
  '04_db_architect':    ['Schema', 'Migration', 'Index', 'Relationship'],
  '05_qa_lead':         ['Test Strategy', 'Coverage', 'E2E'],
  '06_devops_lead':     ['Infrastructure', 'CI/CD', 'Deploy', 'Monitor'],
  '07_marketing_lead':  ['Positioning', 'Go-to-Market', 'Channel'],
  '08_finance_lead':    ['Pricing', 'Unit Economics', 'Revenue'],
  '09_business_lead':   ['Strategy', 'Competition', 'Risk'],
  '10_ui_designer':     ['Screen', 'Wireframe', 'Accessibility', 'Design Token'],
  'backlog':            ['Sprint', 'Ticket'],
};

// ---------------------------------------------------------------------------
// Main validation function
// ---------------------------------------------------------------------------

/**
 * Validate all spec files in an output directory.
 *
 * @param outputDir - Directory that contains the generated spec .md files
 * @returns ValidationResult with passed flag and list of issues
 */
export async function validateSpecs(outputDir: string): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  for (const [specId, minLines] of Object.entries(MIN_LINES)) {
    const specPath = `${outputDir}/${specId}.md`;

    // ----- Existence check (hard error — no further checks if missing) -----
    if (!(await exists(specPath))) {
      issues.push({
        specId,
        severity: 'error',
        message: `File missing: ${specPath}`,
      });
      continue;
    }

    const content = await readFile(specPath);
    const lines = content.split('\n').length;

    // ----- YAML frontmatter checks -----
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) {
      issues.push({
        specId,
        severity: 'warning',
        message: 'Missing YAML frontmatter',
      });
    } else {
      try {
        const fm = parseYaml(fmMatch[1]) as Record<string, unknown>;

        if (!fm['role']) {
          issues.push({
            specId,
            severity: 'warning',
            message: 'Frontmatter missing "role" field',
          });
        }

        if (!fm['source_hash']) {
          issues.push({
            specId,
            severity: 'warning',
            message: 'Frontmatter missing "source_hash" field',
          });
        }
      } catch {
        issues.push({
          specId,
          severity: 'warning',
          message: 'Frontmatter YAML parse error',
        });
      }
    }

    // ----- Minimum line count (secondary — warning only) -----
    if (lines < minLines) {
      issues.push({
        specId,
        severity: 'warning',
        message: `Only ${lines} lines (minimum: ${minLines})`,
      });
    }

    // ----- Required section headings (primary — warning only) -----
    const requiredSections = REQUIRED_SECTIONS[specId] ?? [];
    const headings = content.match(/^#{1,3}\s+.+$/gm) ?? [];
    const headingTexts = headings.map(h => h.replace(/^#+\s+/, '').toLowerCase());

    for (const section of requiredSections) {
      const found = headingTexts.some(h => h.includes(section.toLowerCase()));
      if (!found) {
        issues.push({
          specId,
          severity: 'warning',
          message: `Missing required section: "${section}"`,
        });
      }
    }
  }

  // A run passes when there are no hard errors (missing files).
  // Warnings do not block the pipeline.
  const hasErrors = issues.some(i => i.severity === 'error');
  return { passed: !hasErrors, issues };
}

// ---------------------------------------------------------------------------
// Print helper
// ---------------------------------------------------------------------------

/**
 * Print a human-readable summary of validation results to stdout.
 *
 * @param result - The ValidationResult to display
 * @param quiet  - When true, suppress output if all specs passed
 */
export function printValidationResults(result: ValidationResult, quiet = false): void {
  if (quiet && result.passed) return;

  if (result.issues.length === 0) {
    if (!quiet) {
      console.log(chalk.green('\n  Validation: All specs passed ✓\n'));
    }
    return;
  }

  console.log(chalk.bold('\n  Validation Results:\n'));

  const errors   = result.issues.filter(i => i.severity === 'error');
  const warnings = result.issues.filter(i => i.severity === 'warning');

  if (errors.length > 0) {
    console.log(chalk.red(`  ${errors.length} error(s):`));
    for (const e of errors) {
      console.log(chalk.red(`    ✗ [${e.specId}] ${e.message}`));
    }
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow(`  ${warnings.length} warning(s):`));
    for (const w of warnings) {
      console.log(chalk.yellow(`    ! [${w.specId}] ${w.message}`));
    }
  }

  console.log('');
}
