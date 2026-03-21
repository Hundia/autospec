import fs from 'fs-extra';
import chalk from 'chalk';

export interface ValidationResult {
  valid: boolean;
  warning?: string;
  error?: string;
  wordCount: number;
  byteCount: number;
}

export async function validateSrsInput(filePath: string): Promise<ValidationResult> {
  // Check file exists
  if (!(await fs.pathExists(filePath))) {
    return { valid: false, error: `File not found: ${filePath}`, wordCount: 0, byteCount: 0 };
  }

  const stat = await fs.stat(filePath);

  // Empty file (0 bytes)
  if (stat.size === 0) {
    return {
      valid: false,
      wordCount: 0,
      byteCount: 0,
      error: `${filePath} is empty (0 bytes).\n\n` +
        '  AutoSpec needs a requirements document to generate specs.\n' +
        '    Interactive:  autospec generate --interview\n',
    };
  }

  // Binary file detection — check first 8KB for null bytes
  const buffer = Buffer.alloc(Math.min(8192, stat.size));
  const fd = await fs.open(filePath, 'r');
  await fd.read(buffer, 0, buffer.length, 0);
  await fd.close();

  const isBinary = buffer.includes(0);
  if (isBinary) {
    return {
      valid: false,
      wordCount: 0,
      byteCount: stat.size,
      error: `${filePath} appears to be a binary file.\n\n` +
        '  AutoSpec accepts Markdown (.md), plain text (.txt), or YAML (.yml) files.\n' +
        '  If this is a PDF, convert first: pdftotext requirements.pdf requirements.md\n',
    };
  }

  // Read content for word count
  const content = await fs.readFile(filePath, 'utf-8');
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

  // Short file warning (<50 words)
  if (wordCount < 50) {
    return {
      valid: true,
      wordCount,
      byteCount: stat.size,
      warning: `${filePath} is only ${wordCount} words.\n` +
        '  Generated specs may lack detail. Consider expanding your requirements\n' +
        '  or using: autospec generate --interview',
    };
  }

  return { valid: true, wordCount, byteCount: stat.size };
}

/**
 * Print validation error and exit with code
 */
export function printValidationError(result: ValidationResult): void {
  if (result.error) {
    console.error(chalk.red(`\n  Error: ${result.error}`));
  }
  if (result.warning) {
    console.log(chalk.yellow(`\n  Warning: ${result.warning}`));
  }
}
