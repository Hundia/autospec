/**
 * File Watcher
 * Watches markdown files for changes and emits events
 */

import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';

export type FileChangeType = 'backlog' | 'sprint' | 'spec' | 'prompt';

export interface FileChangeEvent {
  type: FileChangeType;
  path: string;
  event: 'add' | 'change' | 'unlink';
  timestamp: Date;
}

export class ProjectWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;
  private projectDir: string;

  constructor(projectDir: string) {
    super();
    this.projectDir = projectDir;
  }

  private classifyFile(filePath: string): FileChangeType | null {
    const relativePath = path.relative(this.projectDir, filePath);
    const filename = path.basename(filePath).toLowerCase();

    if (filename === 'backlog.md') {
      return 'backlog';
    }

    if (relativePath.includes('sprint') && filename.includes('summary')) {
      return 'sprint';
    }

    if (relativePath.startsWith('specs') && filename.endsWith('.md')) {
      return 'spec';
    }

    if (relativePath.startsWith('prompts') && filename.endsWith('.md')) {
      return 'prompt';
    }

    return null;
  }

  start(): void {
    if (this.watcher) {
      return;
    }

    const watchPaths = [
      path.join(this.projectDir, 'specs', '**', '*.md'),
      path.join(this.projectDir, 'sprints', '**', '*.md'),
      path.join(this.projectDir, 'prompts', '**', '*.md'),
    ];

    this.watcher = chokidar.watch(watchPaths, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    const handleEvent = (event: 'add' | 'change' | 'unlink') => (filePath: string) => {
      const type = this.classifyFile(filePath);
      if (type) {
        const changeEvent: FileChangeEvent = {
          type,
          path: filePath,
          event,
          timestamp: new Date(),
        };
        this.emit('change', changeEvent);
        this.emit(type, changeEvent);
      }
    };

    this.watcher
      .on('add', handleEvent('add'))
      .on('change', handleEvent('change'))
      .on('unlink', handleEvent('unlink'))
      .on('error', (error) => {
        console.error('Watcher error:', error);
        this.emit('error', error);
      })
      .on('ready', () => {
        console.log('File watcher ready');
        this.emit('ready');
      });
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  getProjectDir(): string {
    return this.projectDir;
  }
}

export function createProjectWatcher(projectDir: string): ProjectWatcher {
  return new ProjectWatcher(projectDir);
}
