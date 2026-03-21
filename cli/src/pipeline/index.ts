/**
 * Pipeline module barrel — re-exports all public pipeline symbols.
 */

export { generateSpecs, type GenerateSpecsOptions, type GenerateSpecsResult, type SpecResult } from './generate-specs.js';
export { extractMetadata, type ProjectMetadata } from './extract-metadata.js';
export { generateSingleSpec, type SingleSpecResult } from './generate-single-spec.js';
export { summarizeSpec } from './summarize-spec.js';
export { shouldResumeSpec, addFrontmatter } from './resume.js';
export { validateSpecs, printValidationResults, type ValidationIssue, type ValidationResult } from './validate-specs.js';
