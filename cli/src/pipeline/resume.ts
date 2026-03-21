/**
 * Resume Logic — Hash-based spec skip detection.
 * Default behavior: re-running `autospec generate` skips specs whose SRS hash hasn't changed.
 * Use --force to regenerate all specs regardless.
 */

import { parse as parseYaml } from 'yaml';
import { readFile, exists } from '../utils/file.js';

/**
 * Check if a spec file should be skipped (resume).
 * Reads the YAML frontmatter from an existing spec file and compares source_hash.
 * Returns true if the spec should be SKIPPED (already up to date).
 */
export async function shouldResumeSpec(
  specPath: string,
  currentSrsHash: string,
  force: boolean,
): Promise<boolean> {
  if (force) return false;
  if (!(await exists(specPath))) return false;

  try {
    const content = await readFile(specPath);
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return false;

    const frontmatter = parseYaml(frontmatterMatch[1]) as Record<string, unknown>;
    return frontmatter.source_hash === `sha256:${currentSrsHash}`;
  } catch {
    return false;
  }
}

/**
 * Add YAML frontmatter to a generated spec.
 * Called after each spec is generated, before writing to disk.
 */
export function addFrontmatter(
  content: string,
  metadata: {
    role: string;
    model: string;
    provider: string;
    sourceSrs: string;
    sourceHash: string;
  },
): string {
  const frontmatter = `---
role: ${metadata.role}
spec_version: "1.0"
generated_by: autospec v0.2.0
model: ${metadata.model}
provider: ${metadata.provider}
source_srs: ${metadata.sourceSrs}
source_hash: "sha256:${metadata.sourceHash}"
generated_at: ${new Date().toISOString()}
---

`;
  return frontmatter + content;
}
