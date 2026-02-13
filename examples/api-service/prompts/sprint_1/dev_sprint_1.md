# DataHub API Gateway - Sprint 1 Development Execution Prompt

## Context

You are implementing Sprint 1 of DataHub, building on Sprint 0. This sprint adds API configuration, permissions, request proxying, logging, and analytics.

---

## Prerequisites

- Sprint 0 completed (`sprint-0-complete` tag)
- PostgreSQL and Redis running
- TimescaleDB extension installed

---

## New Database Migrations

### Migration: Add APIs Table

```prisma
model Api {
  id           String    @id @default(uuid())
  name         String    @unique
  upstreamUrl  String    @map("upstream_url")
  rateLimit    Int       @default(1000) @map("rate_limit")
  authRequired Boolean   @default(true) @map("auth_required")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  permissions ApiPermission[]

  @@map("apis")
}
```

### Migration: Add API Permissions

```prisma
model ApiPermission {
  id         String     @id @default(uuid())
  apiKeyId   String     @map("api_key_id")
  apiId      String     @map("api_id")
  permission Permission
  createdAt  DateTime   @default(now()) @map("created_at")

  apiKey ApiKey @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  api    Api    @relation(fields: [apiId], references: [id], onDelete: Cascade)

  @@unique([apiKeyId, apiId])
  @@index([apiKeyId])
  @@index([apiId])
  @@map("api_permissions")
}

enum Permission {
  read
  write
  admin
}

// Update ApiKey model
model ApiKey {
  // ... existing fields
  permissions ApiPermission[]
}
```

### Migration: Add Request Logs (TimescaleDB)

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create request_logs table
CREATE TABLE request_logs (
    id UUID DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id),
    api_id UUID REFERENCES apis(id),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,

    PRIMARY KEY (id, timestamp)
);

-- Convert to hypertable
SELECT create_hypertable('request_logs', 'timestamp');

-- Indexes
CREATE INDEX idx_request_logs_api_key ON request_logs(api_key_id, timestamp DESC);
CREATE INDEX idx_request_logs_api ON request_logs(api_id, timestamp DESC);
CREATE INDEX idx_request_logs_status ON request_logs(status_code, timestamp DESC);

-- Retention policy (90 days)
SELECT add_retention_policy('request_logs', INTERVAL '90 days');

-- Compression policy
SELECT add_compression_policy('request_logs', INTERVAL '7 days');
```

---

## API Configuration Endpoints

### POST /api/v1/apis (Admin only)

```typescript
// Request
{
  "name": "users-service",
  "upstreamUrl": "http://users-api.internal:8080",
  "rateLimit": 1000,
  "authRequired": true
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "users-service",
    "upstreamUrl": "http://users-api.internal:8080",
    "rateLimit": 1000,
    "authRequired": true,
    "createdAt": "2026-01-30T00:00:00.000Z"
  }
}
```

### GET /api/v1/apis

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "apis": [
      {
        "id": "uuid",
        "name": "users-service",
        "upstreamUrl": "http://users-api.internal:8080",
        "rateLimit": 1000,
        "authRequired": true,
        "requestCount": 15420
      }
    ]
  }
}
```

---

## Permission Endpoints

### POST /api/v1/api-keys/:id/permissions

```typescript
// Request
{
  "apiId": "uuid",
  "permission": "read"  // read, write, admin
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "apiKeyId": "key-uuid",
    "apiId": "api-uuid",
    "apiName": "users-service",
    "permission": "read",
    "createdAt": "2026-01-30T00:00:00.000Z"
  }
}
```

### GET /api/v1/api-keys/:id/permissions

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "permissions": [
      {
        "id": "uuid",
        "api": {
          "id": "api-uuid",
          "name": "users-service"
        },
        "permission": "read",
        "createdAt": "..."
      }
    ]
  }
}
```

### DELETE /api/v1/api-keys/:keyId/permissions/:apiId

```typescript
// Response (200)
{
  "success": true,
  "message": "Permission revoked"
}
```

---

## Request Proxy Implementation

### Proxy Route Handler

```typescript
// src/routes/proxy.ts
import { Router } from 'express';
import httpProxy from 'http-proxy-middleware';

const router = Router();

router.all('/:apiName/*', async (req, res, next) => {
  const { apiName } = req.params;
  const apiKey = req.apiKey;

  // 1. Find API configuration
  const api = await apiService.findByName(apiName);
  if (!api) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'API not found' }
    });
  }

  // 2. Check permissions
  if (api.authRequired && !apiKey) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'API key required' }
    });
  }

  if (apiKey) {
    const permission = await permissionService.check(apiKey.id, api.id);
    if (!permission) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'No permission for this API' }
      });
    }

    // Check write permission for mutating methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (permission.permission === 'read') {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Write permission required' }
        });
      }
    }
  }

  // 3. Proxy the request
  const startTime = Date.now();

  const proxy = httpProxy.createProxyMiddleware({
    target: api.upstreamUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/proxy/${apiName}`]: '',
    },
    onProxyRes: async (proxyRes) => {
      const latencyMs = Date.now() - startTime;

      // Log the request
      await requestLogService.log({
        apiKeyId: apiKey?.id,
        apiId: api.id,
        method: req.method,
        path: req.path,
        statusCode: proxyRes.statusCode || 0,
        latencyMs,
        timestamp: new Date(),
        metadata: {
          userAgent: req.get('user-agent'),
          ip: req.ip,
        },
      });

      // Update last used
      if (apiKey) {
        await apiKeyService.updateLastUsed(apiKey.id);
      }
    },
  });

  proxy(req, res, next);
});

export default router;
```

---

## Analytics Endpoints

### GET /api/v1/analytics/requests

```typescript
// Query params: ?apiKeyId=xxx&apiId=xxx&from=2026-01-01&to=2026-01-31&interval=hour

// Response (200)
{
  "success": true,
  "data": {
    "timeSeries": [
      { "timestamp": "2026-01-30T10:00:00Z", "count": 1523 },
      { "timestamp": "2026-01-30T11:00:00Z", "count": 1847 },
      { "timestamp": "2026-01-30T12:00:00Z", "count": 2104 }
    ],
    "total": 5474
  }
}
```

### GET /api/v1/analytics/errors

```typescript
// Query params: ?apiKeyId=xxx&from=2026-01-01&to=2026-01-31

// Response (200)
{
  "success": true,
  "data": {
    "timeSeries": [
      { "timestamp": "2026-01-30T10:00:00Z", "count": 23, "rate": 1.5 },
      { "timestamp": "2026-01-30T11:00:00Z", "count": 45, "rate": 2.4 }
    ],
    "totalErrors": 68,
    "errorRate": 1.2,
    "byStatusCode": {
      "400": 15,
      "401": 8,
      "403": 12,
      "404": 18,
      "500": 15
    }
  }
}
```

### GET /api/v1/analytics/latency

```typescript
// Query params: ?apiKeyId=xxx&apiId=xxx&from=2026-01-01&to=2026-01-31

// Response (200)
{
  "success": true,
  "data": {
    "percentiles": {
      "p50": 45,
      "p75": 89,
      "p90": 156,
      "p95": 234,
      "p99": 512
    },
    "average": 78,
    "min": 12,
    "max": 1523
  }
}
```

### GET /api/v1/analytics/top-apis

```typescript
// Query params: ?apiKeyId=xxx&from=2026-01-01&to=2026-01-31&limit=10

// Response (200)
{
  "success": true,
  "data": {
    "apis": [
      {
        "id": "uuid",
        "name": "users-service",
        "requestCount": 45230,
        "errorRate": 0.8,
        "avgLatencyMs": 67
      },
      {
        "id": "uuid",
        "name": "orders-service",
        "requestCount": 32100,
        "errorRate": 1.2,
        "avgLatencyMs": 123
      }
    ]
  }
}
```

---

## Analytics Service Implementation

```typescript
// src/services/analytics.service.ts
import { PrismaClient } from '@prisma/client';

export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getRequestCounts(params: {
    apiKeyId?: string;
    apiId?: string;
    from: Date;
    to: Date;
    interval: 'hour' | 'day';
  }) {
    const bucketInterval = params.interval === 'hour' ? '1 hour' : '1 day';

    const result = await this.prisma.$queryRaw`
      SELECT
        time_bucket(${bucketInterval}::interval, timestamp) AS bucket,
        COUNT(*) as count
      FROM request_logs
      WHERE timestamp >= ${params.from}
        AND timestamp <= ${params.to}
        ${params.apiKeyId ? Prisma.sql`AND api_key_id = ${params.apiKeyId}::uuid` : Prisma.empty}
        ${params.apiId ? Prisma.sql`AND api_id = ${params.apiId}::uuid` : Prisma.empty}
      GROUP BY bucket
      ORDER BY bucket ASC
    `;

    return result;
  }

  async getLatencyPercentiles(params: {
    apiKeyId?: string;
    apiId?: string;
    from: Date;
    to: Date;
  }) {
    const result = await this.prisma.$queryRaw`
      SELECT
        percentile_cont(0.50) WITHIN GROUP (ORDER BY latency_ms) as p50,
        percentile_cont(0.75) WITHIN GROUP (ORDER BY latency_ms) as p75,
        percentile_cont(0.90) WITHIN GROUP (ORDER BY latency_ms) as p90,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms) as p99,
        AVG(latency_ms) as average,
        MIN(latency_ms) as min,
        MAX(latency_ms) as max
      FROM request_logs
      WHERE timestamp >= ${params.from}
        AND timestamp <= ${params.to}
        ${params.apiKeyId ? Prisma.sql`AND api_key_id = ${params.apiKeyId}::uuid` : Prisma.empty}
        ${params.apiId ? Prisma.sql`AND api_id = ${params.apiId}::uuid` : Prisma.empty}
    `;

    return result[0];
  }

  async getTopApis(params: {
    apiKeyId?: string;
    from: Date;
    to: Date;
    limit: number;
  }) {
    const result = await this.prisma.$queryRaw`
      SELECT
        a.id,
        a.name,
        COUNT(*) as request_count,
        ROUND(
          COUNT(*) FILTER (WHERE rl.status_code >= 400)::numeric /
          NULLIF(COUNT(*), 0) * 100, 2
        ) as error_rate,
        ROUND(AVG(rl.latency_ms)) as avg_latency_ms
      FROM request_logs rl
      JOIN apis a ON rl.api_id = a.id
      WHERE rl.timestamp >= ${params.from}
        AND rl.timestamp <= ${params.to}
        ${params.apiKeyId ? Prisma.sql`AND rl.api_key_id = ${params.apiKeyId}::uuid` : Prisma.empty}
      GROUP BY a.id, a.name
      ORDER BY request_count DESC
      LIMIT ${params.limit}
    `;

    return result;
  }
}
```

---

## Validation Schemas

```typescript
// src/schemas/api.schema.ts
import { z } from 'zod';

export const createApiSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Name must be lowercase alphanumeric with hyphens'),
    upstreamUrl: z.string().url('Must be a valid URL'),
    rateLimit: z.number().int().min(1).max(100000).optional(),
    authRequired: z.boolean().optional(),
  }),
});

export const grantPermissionSchema = z.object({
  body: z.object({
    apiId: z.string().uuid(),
    permission: z.enum(['read', 'write', 'admin']),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const analyticsQuerySchema = z.object({
  query: z.object({
    apiKeyId: z.string().uuid().optional(),
    apiId: z.string().uuid().optional(),
    from: z.string().datetime(),
    to: z.string().datetime(),
    interval: z.enum(['hour', 'day']).optional().default('hour'),
  }),
});
```

---

## Docker Compose Updates

```yaml
version: '3.8'

services:
  timescaledb:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: datahub
    ports:
      - "5432:5432"
    volumes:
      - timescale_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@timescaledb:5432/datahub
      REDIS_URL: redis://redis:6379
    depends_on:
      - timescaledb
      - redis

volumes:
  timescale_data:
```

---

## Testing Requirements

```typescript
// tests/api.test.ts
describe('API Configuration', () => {
  it('should create API (admin only)', async () => {
    const response = await request(app)
      .post('/api/v1/apis')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'test-api',
        upstreamUrl: 'http://test.internal:8080',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('test-api');
  });

  it('should reject non-admin API creation', async () => {
    const response = await request(app)
      .post('/api/v1/apis')
      .set('Authorization', `Bearer ${developerToken}`)
      .send({ name: 'test', upstreamUrl: 'http://test.com' });

    expect(response.status).toBe(403);
  });
});

// tests/permissions.test.ts
describe('Permissions', () => {
  it('should grant permission', async () => {
    const response = await request(app)
      .post(`/api/v1/api-keys/${keyId}/permissions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ apiId, permission: 'read' });

    expect(response.status).toBe(201);
  });

  it('should enforce read-only permission', async () => {
    // POST to proxied API with read-only permission
    const response = await request(app)
      .post('/proxy/test-api/users')
      .set('X-API-Key', readOnlyKey);

    expect(response.status).toBe(403);
  });
});
```

---

## Commands Reference

```bash
# Run new migrations
npx prisma migrate dev --name add_apis
npx prisma migrate dev --name add_permissions
npx prisma migrate dev --name add_request_logs

# Manual TimescaleDB setup
psql $DATABASE_URL -f migrations/timescaledb_setup.sql

# Run tests
npm run test

# Check analytics queries
psql $DATABASE_URL -c "SELECT * FROM request_logs ORDER BY timestamp DESC LIMIT 10"
```

---

## Checklist Before Completing Sprint 1

- [ ] API table migration applied
- [ ] Permission table migration applied
- [ ] TimescaleDB hypertable created
- [ ] API CRUD endpoints working
- [ ] Permission CRUD endpoints working
- [ ] Proxy routing working
- [ ] Request logging working
- [ ] Analytics endpoints working
- [ ] Admin-only endpoints protected
- [ ] Permission enforcement on proxy
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Sprint 0 regression passing
