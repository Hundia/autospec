import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import type { Server } from 'http';

// Set required env vars for test
process.env.DATABASE_URL = 'postgresql://taskflow:taskflow_dev@localhost:5432/taskflow';
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-at-least-32-chars';
process.env.NODE_ENV = 'test';

let server: Server;

beforeAll(() => {
  server = app.listen(0); // port 0 = random available port
});

afterAll(() => {
  server.close();
});

describe('GET /api/v1/health', () => {
  it('should return 200 with status ok', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('ok');
  });

  it('should return a valid ISO timestamp', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.data.timestamp).toBeDefined();

    const timestamp = new Date(response.body.data.timestamp as string);
    expect(timestamp.toISOString()).toBe(response.body.data.timestamp);
  });

  it('should return correct response shape', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.data).toHaveProperty('status', 'ok');
    expect(response.body.data).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/api/v1/unknown-route');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
