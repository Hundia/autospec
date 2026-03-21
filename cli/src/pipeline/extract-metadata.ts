/**
 * Metadata Extractor — Pipeline Step 1
 * Sends the SRS to the LLM with the extract-metadata prompt, parses and validates the JSON response.
 * This is the only LLM call that returns structured JSON rather than Markdown.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { z } from 'zod';
import { LLMProvider, GenerateOptions } from '../providers/interface.js';
import { readFile } from '../utils/file.js';

// ---------------------------------------------------------------------------
// Zod schema — validated at runtime so downstream code can trust the shape
// ---------------------------------------------------------------------------

const ProjectMetadataSchema = z.object({
  projectName: z.string(),
  projectType: z.enum(['web', 'mobile', 'api', 'desktop', 'cli', 'library']),
  domain: z.string(),
  techStack: z.object({
    frontend: z.string().nullable(),
    backend: z.string().nullable(),
    database: z.string().nullable(),
    language: z.string(),
  }),
  targetUsers: z.array(z.string()),
  coreFeatures: z.array(z.string()),
  constraints: z.array(z.string()),
});

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;

// ---------------------------------------------------------------------------
// Path resolution — templates live in prompts/system/ relative to src/
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// __dirname is src/pipeline/ — step up to src/, then into prompts/system/
const PROMPTS_DIR = path.resolve(__dirname, '..', 'prompts', 'system');

/**
 * Strip markdown code fences that LLMs sometimes wrap JSON in.
 * Handles: ```json...``` and ```...```
 */
function stripCodeFences(text: string): string {
  // Match ```json...``` or ```...``` with optional whitespace
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return text.trim();
}

/**
 * Extract project metadata from an SRS document via LLM.
 *
 * @param srsContent - Full SRS text
 * @param provider - Resolved LLMProvider
 * @param options - GenerateOptions forwarded to the provider
 * @returns Zod-validated ProjectMetadata
 * @throws Error if LLM response cannot be parsed or fails validation
 */
export async function extractMetadata(
  srsContent: string,
  provider: LLMProvider,
  options: GenerateOptions,
): Promise<ProjectMetadata> {
  // Load and compile the Handlebars template
  const templatePath = path.join(PROMPTS_DIR, 'extract-metadata.hbs');
  const templateSource = await readFile(templatePath);
  const template = Handlebars.compile(templateSource, { noEscape: true });
  const prompt = template({ srsContent });

  // Collect the full response from the stream
  let raw = '';
  for await (const chunk of provider.generate(prompt, options)) {
    raw += chunk;
  }

  // Strip code fences and parse JSON
  const cleaned = stripCodeFences(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `extractMetadata: LLM returned non-JSON response.\n` +
        `Raw output (first 500 chars): ${raw.slice(0, 500)}\n` +
        `Parse error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // Validate with Zod
  const result = ProjectMetadataSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `extractMetadata: JSON response failed schema validation.\n` +
        `Issues: ${result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}\n` +
        `Raw JSON: ${JSON.stringify(parsed, null, 2).slice(0, 500)}`,
    );
  }

  return result.data;
}
