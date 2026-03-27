/**
 * Unit tests for executeWithConcurrency (concurrency limiter)
 * Sprint 36 ticket 36.7
 */

import { describe, it, expect } from 'vitest';
import { executeWithConcurrency } from '../../src/pipeline/generate-specs.js';

describe('executeWithConcurrency', () => {
  it('runs tasks in parallel up to the concurrency limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const task = () =>
      new Promise<void>(resolve => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        setTimeout(() => {
          concurrent--;
          resolve();
        }, 50);
      });

    await executeWithConcurrency([task, task, task, task, task], 3);
    expect(maxConcurrent).toBeLessThanOrEqual(3);
    expect(maxConcurrent).toBeGreaterThanOrEqual(1);
  });

  it('collects all results even when some tasks fail', async () => {
    const successTask = () => Promise.resolve('ok');
    const failTask = () => Promise.reject(new Error('boom'));

    const results = await executeWithConcurrency(
      [successTask, failTask, successTask, failTask, successTask],
      3,
    );

    expect(results).toHaveLength(5);

    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    expect(fulfilled).toHaveLength(3);
    expect(rejected).toHaveLength(2);
  });

  it('runs all tasks when concurrency >= task count', async () => {
    const order: number[] = [];
    const tasks = [0, 1, 2].map(i => () =>
      new Promise<number>(resolve => {
        setTimeout(() => { order.push(i); resolve(i); }, 10 * (3 - i)); // reverse order by delay
      }),
    );

    const results = await executeWithConcurrency(tasks, 10);
    expect(results).toHaveLength(3);
    expect(results.every(r => r.status === 'fulfilled')).toBe(true);
  });

  it('runs tasks sequentially when concurrency = 1', async () => {
    const order: number[] = [];
    const tasks = [0, 1, 2, 3].map(i => () =>
      Promise.resolve(i).then(v => { order.push(v); return v; }),
    );

    const results = await executeWithConcurrency(tasks, 1);
    expect(results).toHaveLength(4);
    expect(order).toEqual([0, 1, 2, 3]);
  });

  it('returns empty array for empty task list', async () => {
    const results = await executeWithConcurrency([], 3);
    expect(results).toEqual([]);
  });

  it('preserves result order matching task order', async () => {
    const tasks = [3, 1, 2].map(delay => () =>
      new Promise<number>(resolve => setTimeout(() => resolve(delay), delay * 10)),
    );

    const results = await executeWithConcurrency(tasks, 3);
    // Results should be in task order [3, 1, 2], not completion order [1, 2, 3]
    expect(results[0]).toMatchObject({ status: 'fulfilled', value: 3 });
    expect(results[1]).toMatchObject({ status: 'fulfilled', value: 1 });
    expect(results[2]).toMatchObject({ status: 'fulfilled', value: 2 });
  });
});
