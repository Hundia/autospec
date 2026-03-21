/**
 * File System Utilities
 * Common file operations for the AutoSpec CLI
 */

import fs from 'fs-extra';
import path from 'path';
import { rename, writeFile as fsWriteFile, rm, readdir } from 'fs/promises';
import { createHash } from 'crypto';

const AUTOSPEC_TMP_SUFFIX = '.autospec-tmp';

/**
 * Atomic file write — write to tmp, then rename.
 * Prevents corruption on Ctrl+C, OOM, or power loss.
 */
export async function atomicWriteFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  const tmpPath = filePath + AUTOSPEC_TMP_SUFFIX;
  await fsWriteFile(tmpPath, content, 'utf-8');
  await rename(tmpPath, filePath);  // atomic on same filesystem
}

/**
 * Clean orphaned .autospec-tmp files from a directory
 */
export async function cleanOrphanedTmpFiles(dir: string): Promise<number> {
  if (!(await fs.pathExists(dir))) return 0;
  const files = await readdir(dir);
  const tmpFiles = files.filter(f => f.endsWith(AUTOSPEC_TMP_SUFFIX));
  for (const f of tmpFiles) {
    await rm(path.join(dir, f), { force: true });
  }
  return tmpFiles.length;
}

/**
 * Compute SHA-256 hash of file content
 */
export function computeHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Ensure a directory exists, creating it if necessary
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Create multiple directories
 */
export async function ensureDirs(dirs: string[]): Promise<void> {
  await Promise.all(dirs.map(dir => fs.ensureDir(dir)));
}

/**
 * Write content to a file, creating parent directories if needed
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Read file content
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Check if a path exists
 */
export async function exists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

/**
 * Copy a file
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  await fs.ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

/**
 * List files in a directory
 */
export async function listFiles(dirPath: string): Promise<string[]> {
  if (!(await fs.pathExists(dirPath))) {
    return [];
  }
  return fs.readdir(dirPath);
}

/**
 * Get the path to the templates directory (relative to CLI package)
 */
export function getTemplatesDir(): string {
  // In development, templates are in ../templates relative to cli/
  // We'll use the parent sdd_for_all/templates directory
  const cliDir = path.dirname(path.dirname(import.meta.url.replace('file://', '')));
  return path.join(cliDir, '..', 'templates');
}

/**
 * Get the path to a specific template
 */
export function getTemplatePath(category: string, filename: string): string {
  return path.join(getTemplatesDir(), category, filename);
}

/**
 * Find project root by looking for specific markers
 */
export async function findProjectRoot(startDir: string = process.cwd()): Promise<string | null> {
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    // Look for common project markers
    const markers = ['.autospecrc.json', 'package.json', '.git'];

    for (const marker of markers) {
      if (await fs.pathExists(path.join(currentDir, marker))) {
        return currentDir;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Get relative path from base
 */
export function getRelativePath(from: string, to: string): string {
  return path.relative(from, to);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}
