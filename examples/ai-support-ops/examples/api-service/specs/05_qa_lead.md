# DataHub API Gateway - QA & Testing Strategy

## Overview

This document defines the comprehensive testing strategy for DataHub API Gateway. As an API-only service, testing focuses on endpoint validation, authentication, rate limiting, data integrity, and performance under load.

**Testing Frameworks:**

- Unit Tests: Jest
- Integration Tests: Jest + Supertest
- API Tests: Jest + Supertest / Postman/Newman
- Load Tests: k6
- Contract Tests: OpenAPI validation

---

## Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  (5%)
                    │   Full flows    │
                    └────────┬────────┘
               ┌─────────────┴─────────────┐
               │    Integration Tests      │  (25%)
               │    API endpoints          │
               └─────────────┬─────────────┘
          ┌──────────────────┴──────────────────┐
          │          Unit Tests                  │  (70%)
          │   Services, Utils, Validators        │
          └──────────────────────────────────────┘
```

### Test Distribution Goals

| Test Type         | Coverage       | Execution Time |
| ----------------- | -------------- | -------------- |
| Unit Tests        | 80%+           | < 30 seconds   |
| Integration Tests | 70%+           | < 2 minutes    |
| E2E Tests         | Critical paths | < 5 minutes    |
| Load Tests        | Performance    | < 10 minutes   |

---

## Unit Testing Strategy

### Service Layer Tests

#### API Key Service Tests

```typescript
// tests/unit/services/keyService.test.ts

describe('KeyService', () => {
  describe('generateApiKey', () => {
    it('should generate key with correct prefix for live environment', () => {
      const key = keyService.generateApiKey('live');
      expect(key).toMatch(/^dh_live_[A-Za-z0-9_-]{32}$/);
    });

    it('should generate key with correct prefix for test environment', () => {
      const key = keyService.generateApiKey('test');
      expect(key).toMatch(/^dh_test_[A-Za-z0-9_-]{32}$/);
    });

    it('should generate unique keys on each call', () => {
      const keys = new Set(Array.from({ length: 100 }, () => keyService.generateApiKey('live')));
      expect(keys.size).toBe(100);
    });
  });

  describe('hashApiKey', () => {
    it('should produce consistent hash for same input', () => {
      const key = 'dh_live_test123';
      const hash1 = keyService.hashApiKey(key);
      const hash2 = keyService.hashApiKey(key);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = keyService.hashApiKey('dh_live_key1');
      const hash2 = keyService.hashApiKey('dh_live_key2');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce 64 character hex hash', () => {
      const hash = keyService.hashApiKey('dh_live_test');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('validateKeyFormat', () => {
    it('should accept valid live key format', () => {
      expect(keyService.validateKeyFormat('dh_live_abc123xyz789')).toBe(true);
    });

    it('should accept valid test key format', () => {
      expect(keyService.validateKeyFormat('dh_test_abc123xyz789')).toBe(true);
    });

    it('should reject key without prefix', () => {
      expect(keyService.validateKeyFormat('abc123xyz789')).toBe(false);
    });

    it('should reject key with wrong prefix', () => {
      expect(keyService.validateKeyFormat('xx_live_abc123xyz789')).toBe(false);
    });
  });

  describe('createKey', () => {
    it('should create key with default rate limits', async () => {
      const key = await keyService.createKey({
        name: 'Test Key',
        scopes: ['read:requests'],
      });

      expect(key.rateLimit.requestsPerMinute).toBe(100);
      expect(key.rateLimit.requestsPerHour).toBe(5000);
    });

    it('should create key with custom rate limits', async () => {
      const key = await keyService.createKey({
        name: 'Custom Key',
        scopes: ['read:requests'],
        rateLimit: { requestsPerMinute: 500 },
      });

      expect(key.rateLimit.requestsPerMinute).toBe(500);
    });

    it('should throw on invalid scope', async () => {
      await expect(
        keyService.createKey({
          name: 'Invalid',
          scopes: ['invalid:scope'],
        }),
      ).rejects.toThrow('Invalid scope');
    });
  });
});
```

#### Rate Limit Service Tests

```typescript
// tests/unit/services/rateLimitService.test.ts

describe('RateLimitService', () => {
  let mockRedis: MockRedis;

  beforeEach(() => {
    mockRedis = new MockRedis();
    rateLimitService = new RateLimitService(mockRedis);
  });

  describe('checkLimit', () => {
    it('should allow request when under limit', async () => {
      mockRedis.setZCard(0);

      const result = await rateLimitService.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
    });

    it('should deny request when at limit', async () => {
      mockRedis.setZCard(100);

      const result = await rateLimitService.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should include correct reset time', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const result = await rateLimitService.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.resetAt.getTime()).toBe(now + 60000);
    });
  });

  describe('getRemainingRequests', () => {
    it('should return correct remaining count', async () => {
      mockRedis.setZCard(25);

      const remaining = await rateLimitService.getRemainingRequests('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(remaining).toBe(75);
    });
  });

  describe('resetLimit', () => {
    it('should clear rate limit counters', async () => {
      await rateLimitService.resetLimit('key_123');

      expect(mockRedis.del).toHaveBeenCalledWith('rl:min:key_123');
      expect(mockRedis.del).toHaveBeenCalledWith('rl:hour:key_123');
      expect(mockRedis.del).toHaveBeenCalledWith('rl:day:key_123');
    });
  });
});
```

#### Webhook Service Tests

```typescript
// tests/unit/services/webhookService.test.ts

describe('WebhookService', () => {
  describe('signPayload', () => {
    it('should generate valid HMAC signature', () => {
      const payload = { event: 'test', data: {} };
      const secret = 'whsec_test123';
      const timestamp = 1705315200000;

      const signature = webhookService.signPayload(payload, secret, timestamp);

      expect(signature).toMatch(/^t=\d+,v1=[a-f0-9]{64}$/);
    });

    it('should produce different signatures for different payloads', () => {
      const secret = 'whsec_test123';
      const timestamp = Date.now();

      const sig1 = webhookService.signPayload({ a: 1 }, secret, timestamp);
      const sig2 = webhookService.signPayload({ b: 2 }, secret, timestamp);

      expect(sig1).not.toBe(sig2);
    });
  });

  describe('verifySignature', () => {
    it('should verify valid signature', () => {
      const payload = { event: 'test' };
      const secret = 'whsec_test123';
      const timestamp = Date.now();
      const signature = webhookService.signPayload(payload, secret, timestamp);

      const isValid = webhookService.verifySignature(payload, signature, secret);

      expect(isValid).toBe(true);
    });

    it('should reject tampered payload', () => {
      const secret = 'whsec_test123';
      const timestamp = Date.now();
      const signature = webhookService.signPayload({ original: true }, secret, timestamp);

      const isValid = webhookService.verifySignature({ tampered: true }, signature, secret);

      expect(isValid).toBe(false);
    });
  });

  describe('calculateRetryDelay', () => {
    it('should apply exponential backoff', () => {
      expect(webhookService.calculateRetryDelay(1, 1000, 2)).toBe(1000);
      expect(webhookService.calculateRetryDelay(2, 1000, 2)).toBe(2000);
      expect(webhookService.calculateRetryDelay(3, 1000, 2)).toBe(4000);
      expect(webhookService.calculateRetryDelay(4, 1000, 2)).toBe(8000);
    });

    it('should cap at maximum delay', () => {
      const delay = webhookService.calculateRetryDelay(10, 1000, 2);
      expect(delay).toBeLessThanOrEqual(300000); // 5 minutes max
    });
  });
});
```

### Validation Tests

```typescript
// tests/unit/validation/schemas.test.ts

describe('Validation Schemas', () => {
  describe('createKeySchema', () => {
    it('should validate correct input', () => {
      const input = {
        name: 'My API Key',
        scopes: ['read:requests'],
      };

      const result = createKeySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require name', () => {
      const input = { scopes: ['read:requests'] };

      const result = createKeySchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toContain('name');
    });

    it('should reject name under 3 characters', () => {
      const input = { name: 'AB', scopes: ['read:requests'] };

      const result = createKeySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name over 100 characters', () => {
      const input = {
        name: 'A'.repeat(101),
        scopes: ['read:requests'],
      };

      const result = createKeySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should require at least one scope', () => {
      const input = { name: 'Test', scopes: [] };

      const result = createKeySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should validate rate limit bounds', () => {
      const input = {
        name: 'Test',
        scopes: ['read:requests'],
        rateLimit: { requestsPerMinute: 0 },
      };

      const result = createKeySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('webhookUrlSchema', () => {
    it('should accept valid HTTPS URL', () => {
      const result = webhookUrlSchema.safeParse('https://example.com/webhook');
      expect(result.success).toBe(true);
    });

    it('should reject HTTP URL', () => {
      const result = webhookUrlSchema.safeParse('http://example.com/webhook');
      expect(result.success).toBe(false);
    });

    it('should reject invalid URL', () => {
      const result = webhookUrlSchema.safeParse('not-a-url');
      expect(result.success).toBe(false);
    });
  });
});
```

---

## Integration Testing Strategy

### API Endpoint Tests

#### Authentication Tests

```typescript
// tests/integration/auth.test.ts

describe('Authentication', () => {
  let adminKey: string;
  let userKey: string;

  beforeAll(async () => {
    adminKey = await createTestKey({ scopes: ['admin'] });
    userKey = await createTestKey({ scopes: ['read:requests'] });
  });

  describe('API Key Validation', () => {
    it('should reject request without API key', async () => {
      const response = await request(app).get('/api/v1/keys').expect(401);

      expect(response.body.error.code).toBe('MISSING_API_KEY');
    });

    it('should reject request with invalid API key', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .set('X-API-Key', 'dh_live_invalid123')
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_API_KEY');
    });

    it('should accept request with valid API key in header', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should accept request with Bearer token', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .set('Authorization', `Bearer ${adminKey}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject revoked API key', async () => {
      const revokedKey = await createTestKey({ scopes: ['read:requests'] });
      await revokeTestKey(revokedKey);

      const response = await request(app)
        .get('/api/v1/requests')
        .set('X-API-Key', revokedKey)
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_API_KEY');
    });

    it('should reject expired API key', async () => {
      const expiredKey = await createTestKey({
        scopes: ['read:requests'],
        expiresAt: new Date(Date.now() - 1000),
      });

      const response = await request(app)
        .get('/api/v1/requests')
        .set('X-API-Key', expiredKey)
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_API_KEY');
    });
  });

  describe('Scope Authorization', () => {
    it('should allow access with sufficient scope', async () => {
      const response = await request(app)
        .get('/api/v1/requests')
        .set('X-API-Key', userKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should deny access with insufficient scope', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', userKey)
        .send({ name: 'Test', scopes: ['read:requests'] })
        .expect(403);

      expect(response.body.error.code).toBe('INSUFFICIENT_SCOPE');
    });

    it('should allow admin scope to access everything', async () => {
      const responses = await Promise.all([
        request(app).get('/api/v1/keys').set('X-API-Key', adminKey),
        request(app).get('/api/v1/requests').set('X-API-Key', adminKey),
        request(app).get('/api/v1/webhooks').set('X-API-Key', adminKey),
      ]);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });
});
```

#### API Key Endpoint Tests

```typescript
// tests/integration/keys.test.ts

describe('API Keys Endpoints', () => {
  let adminKey: string;

  beforeAll(async () => {
    adminKey = await createTestKey({ scopes: ['admin'] });
  });

  describe('POST /api/v1/keys', () => {
    it('should create API key with valid input', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({
          name: 'Test Key',
          description: 'A test API key',
          scopes: ['read:requests', 'write:requests'],
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toMatch(/^key_/);
      expect(response.body.data.apiKey).toMatch(/^dh_live_/);
      expect(response.body.data.name).toBe('Test Key');
      expect(response.body.data.scopes).toEqual(['read:requests', 'write:requests']);
    });

    it('should create key with custom rate limits', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({
          name: 'High Volume Key',
          scopes: ['read:requests'],
          rateLimit: {
            requestsPerMinute: 5000,
            requestsPerHour: 250000,
          },
        })
        .expect(201);

      expect(response.body.data.rateLimit.requestsPerMinute).toBe(5000);
      expect(response.body.data.rateLimit.requestsPerHour).toBe(250000);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({
          name: 'AB', // Too short
          scopes: [], // Empty
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toHaveLength(2);
    });

    it('should only show full API key once at creation', async () => {
      const createResponse = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({
          name: 'One-time Key',
          scopes: ['read:requests'],
        })
        .expect(201);

      const keyId = createResponse.body.data.id;
      expect(createResponse.body.data.apiKey).toBeDefined();

      const getResponse = await request(app)
        .get(`/api/v1/keys/${keyId}`)
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(getResponse.body.data.apiKey).toBeUndefined();
      expect(getResponse.body.data.keyPrefix).toBeDefined();
    });
  });

  describe('GET /api/v1/keys', () => {
    it('should list all keys with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/v1/keys?status=active')
        .set('X-API-Key', adminKey)
        .expect(200);

      response.body.data.forEach((key) => {
        expect(key.status).toBe('active');
      });
    });

    it('should search by name', async () => {
      await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({ name: 'Searchable Key', scopes: ['read:requests'] });

      const response = await request(app)
        .get('/api/v1/keys?search=Searchable')
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(response.body.data.some((k) => k.name === 'Searchable Key')).toBe(true);
    });

    it('should respect pageSize limit', async () => {
      const response = await request(app)
        .get('/api/v1/keys?pageSize=5')
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('PUT /api/v1/keys/:id', () => {
    it('should update key properties', async () => {
      const createResponse = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({ name: 'Original Name', scopes: ['read:requests'] });

      const keyId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/v1/keys/${keyId}`)
        .set('X-API-Key', adminKey)
        .send({ name: 'Updated Name', description: 'New description' })
        .expect(200);

      expect(updateResponse.body.data.name).toBe('Updated Name');
    });

    it('should return 404 for non-existent key', async () => {
      const response = await request(app)
        .put('/api/v1/keys/key_nonexistent123')
        .set('X-API-Key', adminKey)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('DELETE /api/v1/keys/:id', () => {
    it('should revoke key (soft delete)', async () => {
      const createResponse = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({ name: 'To Delete', scopes: ['read:requests'] });

      const keyId = createResponse.body.data.id;

      const deleteResponse = await request(app)
        .delete(`/api/v1/keys/${keyId}`)
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(deleteResponse.body.data.status).toBe('revoked');

      // Verify key is revoked
      const getResponse = await request(app)
        .get(`/api/v1/keys/${keyId}`)
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(getResponse.body.data.status).toBe('revoked');
    });
  });

  describe('POST /api/v1/keys/:id/rotate', () => {
    it('should rotate key and return new key', async () => {
      const createResponse = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({ name: 'Rotatable Key', scopes: ['read:requests'] });

      const oldKeyId = createResponse.body.data.id;
      const oldApiKey = createResponse.body.data.apiKey;

      const rotateResponse = await request(app)
        .post(`/api/v1/keys/${oldKeyId}/rotate`)
        .set('X-API-Key', adminKey)
        .send({ deprecationPeriod: 3600 })
        .expect(200);

      expect(rotateResponse.body.data.newKey.apiKey).toBeDefined();
      expect(rotateResponse.body.data.newKey.apiKey).not.toBe(oldApiKey);
      expect(rotateResponse.body.data.oldKey.status).toBe('deprecated');
    });
  });
});
```

#### Rate Limiting Tests

```typescript
// tests/integration/rateLimit.test.ts

describe('Rate Limiting', () => {
  let limitedKey: string;

  beforeEach(async () => {
    limitedKey = await createTestKey({
      scopes: ['read:requests'],
      rateLimit: { requestsPerMinute: 5 },
    });
    await clearRateLimits(limitedKey);
  });

  describe('Request Throttling', () => {
    it('should allow requests under limit', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/api/v1/requests')
          .set('X-API-Key', limitedKey)
          .expect(200);

        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      }
    });

    it('should return 429 when limit exceeded', async () => {
      // Make requests up to limit
      for (let i = 0; i < 5; i++) {
        await request(app).get('/api/v1/requests').set('X-API-Key', limitedKey);
      }

      // Next request should fail
      const response = await request(app)
        .get('/api/v1/requests')
        .set('X-API-Key', limitedKey)
        .expect(429);

      expect(response.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(response.headers['retry-after']).toBeDefined();
    });

    it('should include correct rate limit headers', async () => {
      const response = await request(app)
        .get('/api/v1/requests')
        .set('X-API-Key', limitedKey)
        .expect(200);

      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBe('4');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });

    it('should reset after window expires', async () => {
      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        await request(app).get('/api/v1/requests').set('X-API-Key', limitedKey);
      }

      // Wait for window to reset (use time mocking in real tests)
      await advanceTime(61000);

      const response = await request(app)
        .get('/api/v1/requests')
        .set('X-API-Key', limitedKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Rate Limit Status Endpoint', () => {
    it('should return current rate limit status', async () => {
      // Make some requests
      for (let i = 0; i < 3; i++) {
        await request(app).get('/api/v1/requests').set('X-API-Key', limitedKey);
      }

      const response = await request(app)
        .get('/api/v1/rate-limits/status')
        .set('X-API-Key', limitedKey)
        .expect(200);

      expect(response.body.data.limits.perMinute.limit).toBe(5);
      expect(response.body.data.limits.perMinute.remaining).toBe(1);
    });
  });
});
```

#### Webhook Tests

```typescript
// tests/integration/webhooks.test.ts

describe('Webhooks', () => {
  let webhookKey: string;
  let webhookServer: MockWebhookServer;

  beforeAll(async () => {
    webhookKey = await createTestKey({ scopes: ['read:webhooks', 'write:webhooks'] });
    webhookServer = await startMockWebhookServer(4567);
  });

  afterAll(async () => {
    await webhookServer.close();
  });

  describe('POST /api/v1/webhooks', () => {
    it('should create webhook subscription', async () => {
      const response = await request(app)
        .post('/api/v1/webhooks')
        .set('X-API-Key', webhookKey)
        .send({
          name: 'Test Webhook',
          url: 'https://localhost:4567/webhook',
          events: ['key.created', 'key.revoked'],
        })
        .expect(201);

      expect(response.body.data.id).toMatch(/^whk_/);
      expect(response.body.data.events).toEqual(['key.created', 'key.revoked']);
    });

    it('should require HTTPS URL', async () => {
      const response = await request(app)
        .post('/api/v1/webhooks')
        .set('X-API-Key', webhookKey)
        .send({
          name: 'HTTP Webhook',
          url: 'http://example.com/webhook',
          events: ['key.created'],
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/webhooks/:id/test', () => {
    it('should send test webhook delivery', async () => {
      const webhook = await createTestWebhook(webhookKey, {
        url: 'https://localhost:4567/webhook',
      });

      webhookServer.expectRequest();

      const response = await request(app)
        .post(`/api/v1/webhooks/${webhook.id}/test`)
        .set('X-API-Key', webhookKey)
        .send({
          event: 'test.ping',
          payload: { test: true },
        })
        .expect(200);

      expect(response.body.data.status).toBe('success');
      expect(webhookServer.receivedRequests).toHaveLength(1);
    });

    it('should handle webhook delivery failure', async () => {
      const webhook = await createTestWebhook(webhookKey, {
        url: 'https://localhost:4567/webhook',
      });

      webhookServer.respondWith(500);

      const response = await request(app)
        .post(`/api/v1/webhooks/${webhook.id}/test`)
        .set('X-API-Key', webhookKey)
        .send({ event: 'test.ping' })
        .expect(200);

      expect(response.body.data.status).toBe('failed');
      expect(response.body.data.statusCode).toBe(500);
    });
  });

  describe('GET /api/v1/webhooks/:id/deliveries', () => {
    it('should list webhook delivery history', async () => {
      const webhook = await createTestWebhook(webhookKey, {
        url: 'https://localhost:4567/webhook',
      });

      // Trigger some deliveries
      await triggerWebhookEvent('key.created', { keyId: 'key_123' });

      const response = await request(app)
        .get(`/api/v1/webhooks/${webhook.id}/deliveries`)
        .set('X-API-Key', webhookKey)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
```

#### Health Check Tests

```typescript
// tests/integration/health.test.ts

describe('Health Checks', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should not require authentication', async () => {
      await request(app).get('/health').expect(200);
    });
  });

  describe('GET /health/ready', () => {
    it('should check database connection', async () => {
      const response = await request(app).get('/health/ready').expect(200);

      expect(response.body.checks.database).toBe('connected');
    });

    it('should check Redis connection', async () => {
      const response = await request(app).get('/health/ready').expect(200);

      expect(response.body.checks.redis).toBe('connected');
    });

    it('should return 503 if database disconnected', async () => {
      await disconnectDatabase();

      const response = await request(app).get('/health/ready').expect(503);

      expect(response.body.status).toBe('not_ready');
      expect(response.body.checks.database).toBe('disconnected');

      await reconnectDatabase();
    });
  });

  describe('GET /health/live', () => {
    it('should return alive with uptime', async () => {
      const response = await request(app).get('/health/live').expect(200);

      expect(response.body.status).toBe('alive');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
```

---

## Load Testing Strategy

### k6 Load Test Scenarios

#### Basic Load Test

```javascript
// tests/load/basic.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up
    { duration: '3m', target: 50 }, // Steady state
    { duration: '1m', target: 100 }, // Peak load
    { duration: '2m', target: 100 }, // Sustained peak
    { duration: '1m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    errors: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

const API_KEY = __ENV.API_KEY;
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };

  // Mix of read operations
  const responses = http.batch([
    ['GET', `${BASE_URL}/api/v1/requests?pageSize=10`, null, { headers }],
    ['GET', `${BASE_URL}/api/v1/rate-limits/status`, null, { headers }],
  ]);

  responses.forEach((res) => {
    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!success);
  });

  sleep(1);
}
```

#### Rate Limit Stress Test

```javascript
// tests/load/rate-limit-stress.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const rateLimited = new Counter('rate_limited_requests');
const successful = new Counter('successful_requests');

export const options = {
  scenarios: {
    burst: {
      executor: 'constant-arrival-rate',
      rate: 200, // 200 requests per second
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

export default function () {
  const response = http.get(`${__ENV.BASE_URL}/api/v1/requests`, {
    headers: { 'X-API-Key': __ENV.API_KEY },
  });

  if (response.status === 429) {
    rateLimited.add(1);
    check(response, {
      'rate limit response has retry-after': (r) => r.headers['Retry-After'] !== undefined,
    });
  } else if (response.status === 200) {
    successful.add(1);
  }
}
```

#### Webhook Delivery Load Test

```javascript
// tests/load/webhook-delivery.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    webhooks: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '2m', target: 20 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Webhook delivery can be slower
  },
};

export default function () {
  const payload = JSON.stringify({
    event: 'test.load',
    payload: { timestamp: Date.now() },
  });

  const response = http.post(
    `${__ENV.BASE_URL}/api/v1/webhooks/${__ENV.WEBHOOK_ID}/test`,
    payload,
    {
      headers: {
        'X-API-Key': __ENV.API_KEY,
        'Content-Type': 'application/json',
      },
    },
  );

  check(response, {
    'webhook test succeeded': (r) => r.status === 200,
    'delivery was successful': (r) => JSON.parse(r.body).data.status === 'success',
  });
}
```

### Performance Targets

| Metric      | Target     | Critical  |
| ----------- | ---------- | --------- |
| p50 Latency | < 20ms     | < 50ms    |
| p95 Latency | < 100ms    | < 200ms   |
| p99 Latency | < 250ms    | < 500ms   |
| Error Rate  | < 0.1%     | < 1%      |
| Throughput  | > 1000 RPS | > 500 RPS |

---

## Test Data Management

### Test Fixtures

```typescript
// tests/fixtures/keys.ts

export const testKeys = {
  adminKey: {
    name: 'Test Admin Key',
    scopes: ['admin'],
    rateLimit: { requestsPerMinute: 10000 },
  },
  readOnlyKey: {
    name: 'Read Only Key',
    scopes: ['read:requests', 'read:webhooks'],
    rateLimit: { requestsPerMinute: 100 },
  },
  limitedKey: {
    name: 'Limited Key',
    scopes: ['read:requests'],
    rateLimit: { requestsPerMinute: 5 },
  },
};

export const testWebhooks = {
  basicWebhook: {
    name: 'Basic Webhook',
    url: 'https://httpbin.org/post',
    events: ['key.created'],
  },
  fullWebhook: {
    name: 'Full Webhook',
    url: 'https://httpbin.org/post',
    events: ['key.created', 'key.updated', 'key.revoked'],
    headers: { 'X-Custom': 'value' },
  },
};
```

### Database Seeding

```typescript
// tests/setup/seed.ts

export async function seedTestDatabase() {
  await db.query('TRUNCATE api_keys, request_logs, webhooks CASCADE');

  // Create base test keys
  for (const [name, config] of Object.entries(testKeys)) {
    await keyService.createKey(config);
  }
}

export async function cleanupTestDatabase() {
  await db.query('TRUNCATE api_keys, request_logs, webhooks CASCADE');
  await redis.flushdb();
}
```

---

## CI/CD Integration

### Test Execution Pipeline

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run db:migrate
      - run: npm run test:integration

  load-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load/basic.js
        env:
          API_KEY: ${{ secrets.TEST_API_KEY }}
          BASE_URL: ${{ secrets.TEST_URL }}
```

### Test Coverage Requirements

| Component  | Minimum Coverage |
| ---------- | ---------------- |
| Services   | 85%              |
| Middleware | 80%              |
| Routes     | 75%              |
| Utils      | 90%              |
| Overall    | 80%              |

---

## Quality Gates

### Pre-Merge Checklist

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] No decrease in code coverage
- [ ] No new linting errors
- [ ] API contract validation passing
- [ ] Performance regression check

### Release Checklist

- [ ] Full test suite green
- [ ] Load tests within thresholds
- [ ] Security scan clean
- [ ] Documentation updated
- [ ] Changelog updated

---

_This QA strategy ensures comprehensive testing coverage for the DataHub API Gateway, with emphasis on API reliability, security, and performance._
