/**
 * Deterministic spec summarization — no LLM needed.
 * Used for cross-spec coherence: later specs receive summaries of earlier ones
 * as part of their system prompt, so they can reference personas, entities, and
 * decisions already established in prior specs.
 *
 * Algorithm (from docs/cli/03_generate_pipeline.md):
 *   1. All section headers (structural overview)
 *   2. First sentence after each header (content preview)
 *   3. Tables (first 3, for data-heavy specs)
 *
 * Entity-extraction regexes were rejected as too fragile (missed personas in tables,
 * non-standard phrasing, non-English names). Deferred to v0.3.0.
 */

/**
 * Extract a deterministic summary from a generated spec.
 */
export function summarizeSpec(specContent: string): string {
  const sections: string[] = [];

  // 1. All section headers (structural overview)
  const headers = specContent.match(/^#{1,3} .+$/gm) ?? [];
  if (headers.length > 0) {
    sections.push('## Sections\n' + headers.join('\n'));
  }

  // 2. First sentence after each header (content preview)
  const firstSentences = extractFirstSentences(specContent);
  if (firstSentences.length > 0) {
    sections.push('## Key Points\n' + firstSentences.join('\n'));
  }

  // 3. Tables (first 3, for data-heavy specs)
  const tables = extractMarkdownTables(specContent);
  if (tables.length > 0) {
    sections.push('## Key Tables\n' + tables.slice(0, 3).join('\n\n'));
  }

  return sections.join('\n\n');
}

/**
 * Extract the first non-empty sentence after each markdown header.
 * Skips YAML frontmatter, blank lines, and code blocks.
 */
function extractFirstSentences(content: string): string[] {
  const lines = content.split('\n');
  const sentences: string[] = [];

  let inFrontmatter = false;
  let inCodeBlock = false;
  let headerLabel: string | null = null;
  let collectingForHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle YAML frontmatter at the very start
    if (i === 0 && line === '---') {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (line === '---') inFrontmatter = false;
      continue;
    }

    // Track code blocks (don't extract from inside them)
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      collectingForHeader = false;
      continue;
    }
    if (inCodeBlock) continue;

    // Detect section header
    const headerMatch = line.match(/^(#{1,3}) (.+)$/);
    if (headerMatch) {
      headerLabel = headerMatch[2].trim();
      collectingForHeader = true;
      continue;
    }

    // Collect first meaningful sentence after the header
    if (collectingForHeader && headerLabel) {
      const trimmed = line.trim();
      if (!trimmed) continue; // skip blank lines between header and content

      // Skip table rows, list items, and other structural elements at first pass
      if (trimmed.startsWith('|') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        collectingForHeader = false;
        continue;
      }

      // Extract first sentence (up to first period, exclamation, or question mark)
      const sentenceMatch = trimmed.match(/^([^.!?]+[.!?])/);
      const sentence = sentenceMatch ? sentenceMatch[1].trim() : trimmed.slice(0, 120);
      sentences.push(`- **${headerLabel}**: ${sentence}`);
      collectingForHeader = false;
    }
  }

  return sentences;
}

/**
 * Extract complete markdown tables from the content.
 * A table is a sequence of lines starting with '|'.
 */
function extractMarkdownTables(content: string): string[] {
  const lines = content.split('\n');
  const tables: string[] = [];
  let currentTable: string[] = [];
  let inFrontmatter = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle YAML frontmatter
    if (i === 0 && line === '---') { inFrontmatter = true; continue; }
    if (inFrontmatter) {
      if (line === '---') inFrontmatter = false;
      continue;
    }

    // Track code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentTable.length > 0) {
        tables.push(currentTable.join('\n'));
        currentTable = [];
      }
      continue;
    }
    if (inCodeBlock) continue;

    if (line.trimStart().startsWith('|')) {
      currentTable.push(line);
    } else {
      if (currentTable.length >= 2) { // at least header + separator
        tables.push(currentTable.join('\n'));
      }
      currentTable = [];
    }
  }

  // Flush any remaining table
  if (currentTable.length >= 2) {
    tables.push(currentTable.join('\n'));
  }

  return tables;
}
