# DataHub API Gateway - Sprint 1 Planning Guide

## Sprint Overview

**Sprint**: 1 - API Management, Permissions & Analytics
**Duration**: 1-2 weeks
**Prerequisites**: Sprint 0 completed and tagged
**Focus**: API configuration, permissions, request logging, and analytics

---

## Sprint Goals

1. Implement API configuration management (register upstream APIs)
2. Create API permission system (which keys can access which APIs)
3. Build request proxy/routing functionality
4. Implement request logging to TimescaleDB
5. Create analytics endpoints

---

## User Stories

### US-1.1: API Configuration
**As a** platform administrator
**I want** to register and configure upstream APIs
**So that** the gateway can route requests appropriately

**Acceptance Criteria:**
- [ ] Create API configuration: `POST /api/v1/apis`
- [ ] List APIs: `GET /api/v1/apis`
- [ ] Update API: `PUT /api/v1/apis/:id`
- [ ] Delete API: `DELETE /api/v1/apis/:id`
- [ ] Configure upstream URL, rate limits, auth requirements

### US-1.2: API Permissions
**As a** developer
**I want** to assign API access permissions to my keys
**So that** I can control which services my applications can access

**Acceptance Criteria:**
- [ ] Grant permission: `POST /api/v1/api-keys/:id/permissions`
- [ ] List permissions: `GET /api/v1/api-keys/:id/permissions`
- [ ] Revoke permission: `DELETE /api/v1/api-keys/:id/permissions/:apiId`
- [ ] Permission levels: read, write, admin
- [ ] Enforce permissions on proxied requests

### US-1.3: Request Logging
**As a** platform administrator
**I want** to log all API requests
**So that** I can analyze usage patterns and debug issues

**Acceptance Criteria:**
- [ ] Log all proxied requests to TimescaleDB
- [ ] Capture: method, path, status, latency, timestamp
- [ ] Store request metadata (headers, query params)
- [ ] Implement 90-day retention policy

### US-1.4: Analytics API
**As a** user
**I want** to view usage analytics for my API keys
**So that** I can monitor my application's API consumption

**Acceptance Criteria:**
- [ ] Requests per hour: `GET /api/v1/analytics/requests`
- [ ] Error rates: `GET /api/v1/analytics/errors`
- [ ] Latency percentiles: `GET /api/v1/analytics/latency`
- [ ] Top APIs by usage: `GET /api/v1/analytics/top-apis`

---

## Technical Tasks

### Backend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| BE-1.1 | Create Api model and migration | 1h | P0 |
| BE-1.2 | Create ApiPermission model and migration | 1h | P0 |
| BE-1.3 | Create RequestLog model (TimescaleDB) | 2h | P0 |
| BE-1.4 | Implement API CRUD endpoints | 3h | P0 |
| BE-1.5 | Implement permission endpoints | 3h | P0 |
| BE-1.6 | Build request proxy middleware | 4h | P0 |
| BE-1.7 | Implement request logging | 3h | P0 |
| BE-1.8 | Create analytics service | 4h | P0 |
| BE-1.9 | Implement analytics endpoints | 3h | P0 |
| BE-1.10 | Add TimescaleDB hypertable setup | 2h | P0 |
| BE-1.11 | Write API endpoint tests | 3h | P1 |
| BE-1.12 | Write permission endpoint tests | 3h | P1 |
| BE-1.13 | Write analytics endpoint tests | 2h | P1 |

---

## API Endpoints Summary

### API Configuration (Admin only)
```
GET    /api/v1/apis               - List all APIs
POST   /api/v1/apis               - Register new API
GET    /api/v1/apis/:id           - Get API details
PUT    /api/v1/apis/:id           - Update API
DELETE /api/v1/apis/:id           - Delete API
```

### API Permissions
```
GET    /api/v1/api-keys/:id/permissions     - List key permissions
POST   /api/v1/api-keys/:id/permissions     - Grant permission
DELETE /api/v1/api-keys/:id/permissions/:apiId - Revoke permission
```

### Request Proxy
```
ANY    /proxy/:apiName/*          - Proxy request to upstream API
```

### Analytics
```
GET    /api/v1/analytics/requests      - Request counts over time
GET    /api/v1/analytics/errors        - Error rates
GET    /api/v1/analytics/latency       - Latency percentiles
GET    /api/v1/analytics/top-apis      - Most used APIs
```

---

## Database Schema Changes

### New Tables

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
  requestLogs RequestLog[]

  @@map("apis")
}

model ApiPermission {
  id         String   @id @default(uuid())
  apiKeyId   String   @map("api_key_id")
  apiId      String   @map("api_id")
  permission Permission
  createdAt  DateTime @default(now()) @map("created_at")

  apiKey ApiKey @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  api    Api    @relation(fields: [apiId], references: [id], onDelete: Cascade)

  @@unique([apiKeyId, apiId])
  @@map("api_permissions")
}

enum Permission {
  read
  write
  admin
}

// TimescaleDB hypertable
model RequestLog {
  id         String   @default(uuid())
  apiKeyId   String?  @map("api_key_id")
  apiId      String?  @map("api_id")
  method     String
  path       String
  statusCode Int      @map("status_code")
  latencyMs  Int      @map("latency_ms")
  timestamp  DateTime @default(now())
  metadata   Json?

  apiKey ApiKey? @relation(fields: [apiKeyId], references: [id])
  api    Api?    @relation(fields: [apiId], references: [id])

  @@id([id, timestamp])
  @@map("request_logs")
}
```

---

## Definition of Done (DoD)

### Code Quality
- [ ] Code follows style guide (ESLint passes)
- [ ] TypeScript compiles without errors
- [ ] Code reviewed

### Testing
- [ ] Unit tests (>70% coverage)
- [ ] Integration tests for new endpoints
- [ ] Sprint 0 regression tests pass

### Documentation
- [ ] New endpoints documented
- [ ] Database changes documented

### Deployment
- [ ] Migrations run successfully
- [ ] TimescaleDB configured
- [ ] CI pipeline passes

---

## Sprint 1 Success Criteria

1. **API Management Working**
   - Admins can register upstream APIs
   - API configurations stored and retrievable

2. **Permissions Enforced**
   - Keys can only access permitted APIs
   - Permission levels respected

3. **Request Logging Active**
   - All proxied requests logged
   - Logs queryable via analytics

4. **Analytics Available**
   - Usage statistics accurate
   - Time-series queries performant
