# DataHub API Gateway - Testing Strategy

## Overview

This document defines the comprehensive testing strategy for DataHub API Gateway. The strategy focuses on ensuring API reliability, security, and performance through a layered testing approach.

---

## Testing Pyramid

```
                        /\
                       /  \
                      / E2E \          5% - Full workflow tests
                     /  Tests \
                    /----------\
                   /            \
                  / Integration  \     25% - API endpoint tests
                 /    Tests       \
                /------------------\
               /                    \
              /     Unit Tests       \    70% - Service & utility tests
             /________________________\
```

### Distribution Guidelines

| Test Type | Coverage Target | Max Duration | Focus |
|-----------|----------------|--------------|-------|
| Unit | 80%+ code coverage | < 30 seconds | Business logic, utilities |
| Integration | 70%+ endpoints | < 2 minutes | API contracts, middleware |
| E2E | Critical paths | < 5 minutes | Full workflows |
| Load | Performance | < 10 minutes | Throughput, latency |

---

## Testing Frameworks

| Framework | Purpose | Usage |
|-----------|---------|-------|
| Jest | Test runner, assertions | All JavaScript tests |
| Supertest | HTTP testing | Integration tests |
| Newman | Postman CLI | API contract tests |
| k6 | Load testing | Performance tests |
| Zod | Schema validation | Input validation tests |

---

## Unit Testing Strategy

### Scope

Unit tests validate isolated business logic without external dependencies.

```
+------------------+
|   Unit Tests     |
+------------------+
        |
        v
+------------------+    +------------------+    +------------------+
|   Services       |    |   Utilities      |    |   Validators     |
|                  |    |                  |    |                  |
| - KeyService     |    | - crypto.ts      |    | - keySchemas     |
| - RateLimitSvc   |    | - logger.ts      |    | - webhookSchemas |
| - WebhookService |    | - errors.ts      |    | - common.ts      |
+------------------+    +------------------+    +------------------+
```

### Test Structure

```typescript
// tests/unit/services/keyService.test.ts

describe('KeyService', () => {
  // Group by method
  describe('generateApiKey', () => {
    // Test normal behavior
    it('should generate key with live prefix for production', () => {
      // Arrange, Act, Assert
    });

    // Test edge cases
    it('should generate unique keys on repeated calls', () => {
      // Generate 100 keys and verify uniqueness
    });

    // Test error cases
    it('should throw on invalid environment', () => {
      // Expect error
    });
  });
});
```

### Mocking Strategy

| Dependency | Mock Strategy | Library |
|------------|---------------|---------|
| Database | In-memory mock | Custom mock |
| Redis | Mock client | ioredis-mock |
| HTTP clients | Mock responses | nock |
| Time | Fake timers | jest.useFakeTimers() |

### Unit Test Example

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
    it('should allow request when under limit', async () => {
      // Arrange
      mockRedis.setZCard(50); // 50 requests in window

      // Act
      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(49);
    });

    it('should deny request when at limit', async () => {
      // Arrange
      mockRedis.setZCard(100);

      // Act
      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should calculate correct reset time', async () => {
      // Arrange
      const now = 1705315200000;
      jest.spyOn(Date, 'now').mockReturnValue(now);

      // Act
      const result = await service.checkLimit('key_123', {
        windowSize: 60,
        maxRequests: 100,
      });

      // Assert
      expect(result.resetAt.getTime()).toBe(now + 60000);
    });
  });
});
```

---

## Integration Testing Strategy

### Scope

Integration tests validate API endpoints, middleware chains, and database interactions.

```
+--------------------+
| Integration Tests  |
+--------------------+
        |
        v
+--------------------+    +--------------------+
|  API Endpoints     |    |    Middleware      |
|                    |    |                    |
| - Authentication   |    | - Auth validation  |
| - Key CRUD         |    | - Rate limiting    |
| - Request logs     |    | - Error handling   |
| - Webhooks         |    | - Validation       |
+--------------------+    +--------------------+
```

### Test Environment

```yaml
# docker-compose.test.yml
services:
  test-db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: datahub_test

  test-redis:
    image: redis:7-alpine
```

### Integration Test Example

```typescript
// tests/integration/keys.test.ts

import request from 'supertest';
import { app } from '../../src/app';
import { createTestKey, cleanupTestData } from '../helpers';

describe('API Keys Endpoints', () => {
  let adminKey: string;

  beforeAll(async () => {
    adminKey = await createTestKey({ scopes: ['admin'] });
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/v1/keys', () => {
    it('should create API key with valid input', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({
          name: 'Test Key',
          scopes: ['read:requests'],
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.apiKey).toMatch(/^dh_live_/);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', adminKey)
        .send({
          name: 'AB', // Too short
          scopes: [], // Empty
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without API key', async () => {
      const response = await request(app)
        .post('/api/v1/keys')
        .send({ name: 'Test', scopes: ['read:requests'] });

      expect(response.status).toBe(401);
    });

    it('should return 403 with insufficient scope', async () => {
      const readOnlyKey = await createTestKey({ scopes: ['read:keys'] });

      const response = await request(app)
        .post('/api/v1/keys')
        .set('X-API-Key', readOnlyKey)
        .send({ name: 'Test', scopes: ['read:requests'] });

      expect(response.status).toBe(403);
    });
  });
});
```

---

## End-to-End Testing Strategy

### Scope

E2E tests validate complete user workflows across the system.

### Critical Paths

| Workflow | Steps | Priority |
|----------|-------|----------|
| Key lifecycle | Create -> Use -> Rotate -> Revoke | P0 |
| Webhook flow | Subscribe -> Trigger -> Receive | P0 |
| Rate limiting | Authenticate -> Use quota -> Hit limit | P0 |
| Error recovery | Fail -> Retry -> Succeed | P1 |

### E2E Test Example

```typescript
// tests/e2e/keyLifecycle.test.ts

describe('Key Lifecycle E2E', () => {
  it('should handle complete key lifecycle', async () => {
    // 1. Create key
    const createResponse = await request(app)
      .post('/api/v1/keys')
      .set('X-API-Key', adminKey)
      .send({ name: 'Lifecycle Test', scopes: ['read:requests'] })
      .expect(201);

    const keyId = createResponse.body.data.id;
    const apiKey = createResponse.body.data.apiKey;

    // 2. Use the key
    await request(app)
      .get('/api/v1/rate-limits/status')
      .set('X-API-Key', apiKey)
      .expect(200);

    // 3. Rotate the key
    const rotateResponse = await request(app)
      .post(`/api/v1/keys/${keyId}/rotate`)
      .set('X-API-Key', adminKey)
      .send({ deprecationPeriod: 60 })
      .expect(200);

    const newApiKey = rotateResponse.body.data.newKey.apiKey;

    // 4. Both keys work during deprecation
    await request(app)
      .get('/api/v1/rate-limits/status')
      .set('X-API-Key', apiKey)
      .expect(200);

    await request(app)
      .get('/api/v1/rate-limits/status')
      .set('X-API-Key', newApiKey)
      .expect(200);

    // 5. Revoke old key
    await request(app)
      .delete(`/api/v1/keys/${keyId}`)
      .set('X-API-Key', adminKey)
      .expect(200);

    // 6. Old key no longer works
    await request(app)
      .get('/api/v1/rate-limits/status')
      .set('X-API-Key', apiKey)
      .expect(401);

    // 7. New key still works
    await request(app)
      .get('/api/v1/rate-limits/status')
      .set('X-API-Key', newApiKey)
      .expect(200);
  });
});
```

---

## Test Data Management

### Fixtures

```typescript
// tests/fixtures/keys.ts
export const testKeys = {
  admin: {
    name: 'Test Admin',
    scopes: ['admin'],
    rateLimit: { requestsPerMinute: 10000 },
  },
  readOnly: {
    name: 'Read Only',
    scopes: ['read:keys', 'read:requests'],
  },
  limited: {
    name: 'Rate Limited',
    scopes: ['read:requests'],
    rateLimit: { requestsPerMinute: 5 },
  },
};
```

### Test Helpers

```typescript
// tests/helpers/index.ts

export async function createTestKey(options: CreateKeyInput): Promise<string> {
  const key = await keyService.createKey(options);
  testKeyIds.push(key.id);
  return key.apiKey;
}

export async function cleanupTestData(): Promise<void> {
  await db.query('DELETE FROM api_keys WHERE id = ANY($1)', [testKeyIds]);
  await redis.flushdb();
  testKeyIds.length = 0;
}
```

---

## Coverage Requirements

### By Component

| Component | Minimum | Target |
|-----------|---------|--------|
| Services | 85% | 95% |
| Middleware | 80% | 90% |
| Routes | 75% | 85% |
| Utils | 90% | 100% |
| Overall | 80% | 90% |

### Coverage Commands

```bash
# Run with coverage
npm run test:coverage

# Generate HTML report
npm run test:coverage -- --coverageReporters=html

# Check thresholds
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

---

## CI/CD Integration

### Test Pipeline

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:14-alpine
    redis:
      image: redis:7-alpine
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run db:migrate
    - run: npm run test:coverage
    - uses: codecov/codecov-action@v3
```

### Quality Gates

- All tests must pass
- Coverage cannot decrease
- No critical vulnerabilities
- Lint checks pass

---

## Related Documentation

- [API Test Suite](./api-test-suite.md) - Complete test examples
- [API Reference](../api/reference.md) - Endpoint documentation
- [QA Specification](../../specs/05_qa_lead.md) - Full QA details

---

_This document defines the testing strategy for DataHub API Gateway._
