# DataHub API Gateway - API Test Suite

## Overview

This document provides the complete API test suite for DataHub API Gateway, including unit tests, integration tests, and load tests ready to implement.

---

## Test Setup

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Setup File

```typescript
// tests/setup.ts
import { db } from '../src/config/database';
import { redis } from '../src/config/redis';

beforeAll(async () => {
  await db.migrate.latest();
});

afterEach(async () => {
  // Clear test data between tests
  await redis.flushdb();
});

afterAll(async () => {
  await db.destroy();
  await redis.quit();
});
```

---

## Unit Tests

### Key Service Tests

```typescript
// tests/unit/services/keyService.test.ts

import { KeyService } from '../../../src/services/keyService';
import { MockKeyRepository } from '../../mocks/keyRepository';
import { MockAuditService } from '../../mocks/auditService';
import { MockRedisClient } from '../../mocks/redis';

describe('KeyService', () => {
  let keyService: KeyService;
  let mockRepo: MockKeyRepository;
  let mockAudit: MockAuditService;
  let mockRedis: MockRedisClient;

  beforeEach(() => {
    mockRepo = new MockKeyRepository();
    mockAudit = new MockAuditService();
    mockRedis = new MockRedisClient();
    keyService = new KeyService(mockRepo, mockAudit, mockRedis);
  });

  describe('generateApiKey', () => {
    it('should generate key with correct live prefix', () => {
      const key = keyService.generateApiKey('live');

      expect(key).toMatch(/^dh_live_[A-Za-z0-9_-]{32}$/);
    });

    it('should generate key with correct test prefix', () => {
      const key = keyService.generateApiKey('test');

      expect(key).toMatch(/^dh_test_[A-Za-z0-9_-]{32}$/);
    });

    it('should generate cryptographically unique keys', () => {
      const keys = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        keys.add(keyService.generateApiKey('live'));
      }

      expect(keys.size).toBe(1000);
    });
  });

  describe('hashApiKey', () => {
    it('should produce consistent SHA-256 hash', () => {
      const key = 'dh_live_test123abc456';
      const hash1 = keyService.hashApiKey(key);
      const hash2 = keyService.hashApiKey(key);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce different hashes for different keys', () => {
      const hash1 = keyService.hashApiKey('dh_live_key1');
      const hash2 = keyService.hashApiKey('dh_live_key2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validateKeyFormat', () => {
    const validCases = [
      'dh_live_abcdefghijklmnopqrstuvwxyz123456',
      'dh_test_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
      'dh_live_abc123_def456-ghi789_jkl012',
    ];

    const invalidCases = [
      'invalid_key',
      'dh_prod_abc123',
      'dh_live_short',
      '',
      null,
      undefined,
    ];

    validCases.forEach((key) => {
      it(`should accept valid key: ${key.substring(0, 20)}...`, () => {
        expect(keyService.validateKeyFormat(key)).toBe(true);
      });
    });

    invalidCases.forEach((key) => {
      it(`should reject invalid key: ${String(key)}`, () => {
        expect(keyService.validateKeyFormat(key as string)).toBe(false);
      });
    });
  });

  describe('createKey', () => {
    it('should create key with default rate limits', async () => {
      const input = {
        name: 'Test Key',
        scopes: ['read:requests'],
      };

      const result = await keyService.createKey(input, mockActor);

      expect(result.rateLimit.requestsPerMinute).toBe(100);
      expect(result.rateLimit.requestsPerHour).toBe(5000);
      expect(result.rateLimit.requestsPerDay).toBe(100000);
    });

    it('should create key with custom rate limits', async () => {
      const input = {
        name: 'High Volume Key',
        scopes: ['read:requests'],
        rateLimit: {
          requestsPerMinute: 1000,
          requestsPerHour: 50000,
        },
      };

      const result = await keyService.createKey(input, mockActor);

      expect(result.rateLimit.requestsPerMinute).toBe(1000);
      expect(result.rateLimit.requestsPerHour).toBe(50000);
    });

    it('should store hashed key, not plaintext', async () => {
      await keyService.createKey(
        { name: 'Test', scopes: ['read:requests'] },
        mockActor
      );

      const storedRecord = mockRepo.getLastCreated();
      expect(storedRecord.keyHash).toMatch(/^[a-f0-9]{64}$/);
      expect(storedRecord.apiKey).toBeUndefined();
    });

    it('should create audit log entry', async () => {
      await keyService.createKey(
        { name: 'Test', scopes: ['read:requests'] },
        mockActor
      );

      expect(mockAudit.logCalled).toBe(true);
      expect(mockAudit.lastAction).toBe('key.create');
    });

    it('should throw on invalid scope', async () => {
      await expect(
        keyService.createKey(
          { name: 'Test', scopes: ['invalid:scope'] },
          mockActor
        )
      ).rejects.toThrow('Invalid scope');
    });
  });

  describe('rotateKey', () => {
    it('should create new key with same configuration', async () => {
      const existingKey = await keyService.createKey(
        {
          name: 'Original Key',
          scopes: ['read:requests', 'write:requests'],
          rateLimit: { requestsPerMinute: 500 },
        },
        mockActor
      );

      const result = await keyService.rotateKey(
        existingKey.id,
        { deprecationPeriod: 3600 },
        mockActor
      );

      expect(result.newKey.scopes).toEqual(existingKey.scopes);
      expect(result.newKey.rateLimit).toEqual(existingKey.rateLimit);
    });

    it('should deprecate old key', async () => {
      const existingKey = await keyService.createKey(
        { name: 'Original', scopes: ['read:requests'] },
        mockActor
      );

      const result = await keyService.rotateKey(
        existingKey.id,
        { deprecationPeriod: 3600 },
        mockActor
      );

      expect(result.oldKey.status).toBe('deprecated');
      expect(result.oldKey.expiresAt).toBeDefined();
    });
  });
});
```

### Rate Limit Service Tests

```typescript
// tests/unit/services/rateLimitService.test.ts

import { RateLimitService } from '../../../src/services/rateLimitService';
import { MockRedis } from '../../mocks/redis';

describe('RateLimitService', () => {
  let service: RateLimitService;
  let mockRedis: MockRedis;

  beforeEach(() => {
    mockRedis = new MockRedis();
    service = new RateLimitService(mockRedis);
  });

  describe('checkLimit', () => {
    it('should allow when count is zero', async () => {
      mockRedis.setZCard(0);

      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
    });

    it('should allow when under limit', async () => {
      mockRedis.setZCard(50);

      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(49);
    });

    it('should deny when at limit', async () => {
      mockRedis.setZCard(100);

      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should deny when over limit', async () => {
      mockRedis.setZCard(150);

      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should calculate retryAfter when rate limited', async () => {
      mockRedis.setZCard(100);
      mockRedis.setOldestTimestamp(Date.now() - 30000); // 30 seconds ago

      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(30);
    });
  });

  describe('incrementCounter', () => {
    it('should add entry to sorted set', async () => {
      await service.incrementCounter('key_123', 60);

      expect(mockRedis.zadd).toHaveBeenCalledWith(
        'datahub:rl:min:key_123',
        expect.any(Number),
        expect.any(String)
      );
    });

    it('should set expiration on key', async () => {
      await service.incrementCounter('key_123', 60);

      expect(mockRedis.expire).toHaveBeenCalledWith(
        'datahub:rl:min:key_123',
        expect.any(Number)
      );
    });
  });
});
```

### Webhook Service Tests

```typescript
// tests/unit/services/webhookService.test.ts

import { WebhookService } from '../../../src/services/webhookService';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(() => {
    service = new WebhookService();
  });

  describe('signPayload', () => {
    it('should generate valid signature format', () => {
      const payload = { event: 'test', data: {} };
      const secret = 'whsec_testsecret';
      const timestamp = 1705315200000;

      const signature = service.signPayload(payload, secret, timestamp);

      expect(signature).toMatch(/^t=\d+,v1=[a-f0-9]{64}$/);
    });

    it('should include timestamp in signature', () => {
      const timestamp = 1705315200000;
      const signature = service.signPayload({}, 'secret', timestamp);

      expect(signature).toContain(`t=${timestamp}`);
    });

    it('should produce different signatures for different payloads', () => {
      const secret = 'whsec_test';
      const timestamp = Date.now();

      const sig1 = service.signPayload({ a: 1 }, secret, timestamp);
      const sig2 = service.signPayload({ b: 2 }, secret, timestamp);

      expect(sig1).not.toBe(sig2);
    });
  });

  describe('verifySignature', () => {
    it('should verify valid signature', () => {
      const payload = { event: 'test' };
      const secret = 'whsec_test';
      const timestamp = Date.now();
      const signature = service.signPayload(payload, secret, timestamp);

      const isValid = service.verifySignature(
        JSON.stringify(payload),
        signature,
        secret
      );

      expect(isValid).toBe(true);
    });

    it('should reject tampered payload', () => {
      const secret = 'whsec_test';
      const timestamp = Date.now();
      const signature = service.signPayload({ original: true }, secret, timestamp);

      const isValid = service.verifySignature(
        JSON.stringify({ tampered: true }),
        signature,
        secret
      );

      expect(isValid).toBe(false);
    });

    it('should reject expired signature', () => {
      const payload = { event: 'test' };
      const secret = 'whsec_test';
      const oldTimestamp = Date.now() - 600000; // 10 minutes ago
      const signature = service.signPayload(payload, secret, oldTimestamp);

      const isValid = service.verifySignature(
        JSON.stringify(payload),
        signature,
        secret,
        300 // 5 minute tolerance
      );

      expect(isValid).toBe(false);
    });
  });

  describe('calculateRetryDelay', () => {
    it('should apply exponential backoff', () => {
      expect(service.calculateRetryDelay(1, 1000, 2)).toBe(1000);
      expect(service.calculateRetryDelay(2, 1000, 2)).toBe(2000);
      expect(service.calculateRetryDelay(3, 1000, 2)).toBe(4000);
      expect(service.calculateRetryDelay(4, 1000, 2)).toBe(8000);
    });

    it('should cap at maximum delay', () => {
      const maxDelay = 300000; // 5 minutes
      const delay = service.calculateRetryDelay(10, 1000, 2);

      expect(delay).toBeLessThanOrEqual(maxDelay);
    });
  });
});
```

---

## Integration Tests

### Authentication Tests

```typescript
// tests/integration/auth.test.ts

import request from 'supertest';
import { app } from '../../src/app';
import { createTestKey, revokeKey, cleanupTestData } from '../helpers';

describe('Authentication Integration', () => {
  let validKey: string;
  let adminKey: string;

  beforeAll(async () => {
    adminKey = await createTestKey({ scopes: ['admin'] });
    validKey = await createTestKey({ scopes: ['read:requests'] });
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('API Key Validation', () => {
    it('should reject request without API key', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .expect(401);

      expect(response.body.error.code).toBe('MISSING_API_KEY');
    });

    it('should reject request with invalid API key', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .set('X-API-Key', 'dh_live_invalid123456789012345678901234')
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_API_KEY');
    });

    it('should accept valid X-API-Key header', async () => {
      const response = await request(app)
        .get('/api/v1/rate-limits/status')
        .set('X-API-Key', validKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should accept valid Authorization Bearer header', async () => {
      const response = await request(app)
        .get('/api/v1/rate-limits/status')
        .set('Authorization', `Bearer ${validKey}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject revoked API key', async () => {
      const keyToRevoke = await createTestKey({ scopes: ['read:requests'] });
      await revokeKey(keyToRevoke);

      const response = await request(app)
        .get('/api/v1/rate-limits/status')
        .set('X-API-Key', keyToRevoke)
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_API_KEY');
    });
  });

  describe('Scope Authorization', () => {
    it('should allow access with correct scope', async () => {
      const response = await request(app)
        .get('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should deny access with insufficient scope', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', validKey) // Only has read:requests
        .send({ name: 'Test', scopes: ['read:requests'] })
        .expect(403);

      expect(response.body.error.code).toBe('INSUFFICIENT_SCOPE');
    });
  });
});
```

### Rate Limiting Tests

```typescript
// tests/integration/rateLimit.test.ts

import request from 'supertest';
import { app } from '../../src/app';
import { createTestKey, clearRateLimits } from '../helpers';

describe('Rate Limiting Integration', () => {
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
          .get('/api/v1/rate-limits/status')
          .set('X-API-Key', limitedKey)
          .expect(200);

        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      }
    });

    it('should return 429 when limit exceeded', async () => {
      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/v1/rate-limits/status')
          .set('X-API-Key', limitedKey);
      }

      // Next request should fail
      const response = await request(app)
        .get('/api/v1/rate-limits/status')
        .set('X-API-Key', limitedKey)
        .expect(429);

      expect(response.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(response.headers['retry-after']).toBeDefined();
    });

    it('should include correct rate limit headers', async () => {
      const response = await request(app)
        .get('/api/v1/rate-limits/status')
        .set('X-API-Key', limitedKey)
        .expect(200);

      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBe('4');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });
});
```

---

## Load Tests

### Basic Load Test (k6)

```javascript
// tests/load/basic.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const latencyTrend = new Trend('latency');

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up
    { duration: '2m', target: 50 },    // Steady state
    { duration: '30s', target: 100 },  // Peak
    { duration: '1m', target: 100 },   // Sustained peak
    { duration: '30s', target: 0 },    // Ramp down
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

  // GET rate limit status
  const response = http.get(
    `${BASE_URL}/api/v1/rate-limits/status`,
    { headers }
  );

  latencyTrend.add(response.timings.duration);

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'response has data': (r) => JSON.parse(r.body).success === true,
  });

  errorRate.add(!success);

  sleep(1);
}
```

### Rate Limit Stress Test

```javascript
// tests/load/rate-limit-stress.js

import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const rateLimited = new Counter('rate_limited_requests');
const successful = new Counter('successful_requests');

export const options = {
  scenarios: {
    burst: {
      executor: 'constant-arrival-rate',
      rate: 200,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

export default function () {
  const response = http.get(
    `${__ENV.BASE_URL}/api/v1/rate-limits/status`,
    { headers: { 'X-API-Key': __ENV.API_KEY } }
  );

  if (response.status === 429) {
    rateLimited.add(1);
    check(response, {
      'has retry-after header': (r) => r.headers['Retry-After'] !== undefined,
    });
  } else if (response.status === 200) {
    successful.add(1);
  }
}
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage

# Run load tests
npm run test:load

# Watch mode (development)
npm run test:watch
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "jest --testPathPattern=e2e",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:load": "k6 run tests/load/basic.js"
  }
}
```

---

## Related Documentation

- [Testing Strategy](./strategy.md) - Overall testing approach
- [API Reference](../api/reference.md) - Endpoint documentation
- [QA Specification](../../specs/05_qa_lead.md) - Complete QA details

---

_This document provides the complete API test suite for DataHub API Gateway._
