# DataHub API Gateway - Data Flow

## Overview

This document describes how data flows through the DataHub API Gateway system, from client requests to persistent storage and webhook delivery.

---

## Request Data Flow

### Complete Request Lifecycle

```
                              REQUEST DATA FLOW

    +--------+                                               +--------+
    | Client |                                               | Client |
    +---+----+                                               +----+---+
        |                                                         ^
        | 1. HTTP Request                                         | 11. HTTP Response
        |    - Headers                                            |     - Status Code
        |    - Body (JSON)                                        |     - Headers
        |    - API Key                                            |     - Body (JSON)
        v                                                         |
    +---+---+                                                 +---+---+
    | Load  |                                                 | Load  |
    |Balancer|                                                |Balancer|
    +---+---+                                                 +---+---+
        |                                                         ^
        | 2. Route to Instance                                    | 10. Return Response
        v                                                         |
    +---+------------------------------------------------+--------+---+
    |                    DataHub API Instance                          |
    |                                                                  |
    | +--------------------------------------------------------------+ |
    | |                      Middleware Stack                        | |
    | |                                                              | |
    | |  3. Request ID        +----------------------------------+   | |
    | |  4. Start Timer       |                                  |   | |
    | |  5. Authentication    |        Request Context           |   | |
    | |  6. Rate Limiting     |        - requestId              |   | |
    | |  7. Authorization     |        - apiKey                 |   | |
    | |                       |        - startTime              |   | |
    | |                       |        - rateLimitInfo          |   | |
    | |                       +----------------------------------+   | |
    | +--------------------------------------------------------------+ |
    |        |                                                         |
    |        | 8. Route Handler                                        |
    |        v                                                         |
    | +------+------+                                                  |
    | |   Service   |                                                  |
    | |    Layer    |                                                  |
    | +------+------+                                                  |
    |        |                                                         |
    |        | 9. Persist Request Log (async)                          |
    |        v                                                         |
    +------+-------------------------------------------------------+---+
           |               |                     |
           v               v                     v
    +------+------+ +------+------+       +------+------+
    | PostgreSQL  | |    Redis    |       |  BullMQ     |
    |             | |             |       |   Queue     |
    | - api_keys  | | - Rate      |       |             |
    | - requests  | |   Counters  |       | - Webhook   |
    | - webhooks  | | - Key Cache |       |   Jobs      |
    | - audit_logs| |             |       |             |
    +-------------+ +-------------+       +-------------+
```

---

## Data Flow by Operation Type

### 1. API Key Creation

```
Client                Gateway              Service             Repository           Database
   |                     |                    |                    |                   |
   |  POST /api/v1/keys  |                    |                    |                   |
   |-------------------->|                    |                    |                   |
   |                     |                    |                    |                   |
   |                     | validate(input)    |                    |                   |
   |                     |------------------->|                    |                   |
   |                     |                    |                    |                   |
   |                     |                    | generateKey()      |                   |
   |                     |                    |-----|              |                   |
   |                     |                    |<----|              |                   |
   |                     |                    |                    |                   |
   |                     |                    | hashKey(key)       |                   |
   |                     |                    |-----|              |                   |
   |                     |                    |<----|              |                   |
   |                     |                    |                    |                   |
   |                     |                    | create(keyRecord)  |                   |
   |                     |                    |------------------->|                   |
   |                     |                    |                    | INSERT INTO       |
   |                     |                    |                    | api_keys          |
   |                     |                    |                    |------------------>|
   |                     |                    |                    |                   |
   |                     |                    |                    | auditLog(action)  |
   |                     |                    |                    |------------------>|
   |                     |                    |                    |                   |
   |                     |                    |<-------------------|                   |
   |                     |<-------------------|                    |                   |
   |                     |                    |                    |                   |
   | 201 Created         |                    |                    |                   |
   | { apiKey: "..." }   |                    |                    |                   |
   |<--------------------|                    |                    |                   |
   |                     |                    |                    |                   |
```

### 2. Request Authentication & Rate Limiting

```
Client              Gateway             Redis               PostgreSQL
   |                   |                  |                     |
   | Request           |                  |                     |
   | X-API-Key: dh_... |                  |                     |
   |------------------>|                  |                     |
   |                   |                  |                     |
   |                   | GET cache:key:   |                     |
   |                   |   {hash}         |                     |
   |                   |----------------->|                     |
   |                   |                  |                     |
   |                   |  (Cache Miss)    |                     |
   |                   |<-----------------|                     |
   |                   |                  |                     |
   |                   | SELECT * FROM api_keys               |
   |                   | WHERE key_hash = $1                  |
   |                   |-------------------------------------->|
   |                   |                  |                     |
   |                   |  Key Record      |                     |
   |                   |<--------------------------------------|
   |                   |                  |                     |
   |                   | SET cache:key:   |                     |
   |                   |   {hash} (5min)  |                     |
   |                   |----------------->|                     |
   |                   |                  |                     |
   |                   | ZCOUNT rl:min:   |                     |
   |                   |   {keyId}        |                     |
   |                   |----------------->|                     |
   |                   |                  |                     |
   |                   | Current: 45      |                     |
   |                   |<-----------------|                     |
   |                   |                  |                     |
   |                   | ZADD rl:min:     |                     |
   |                   |   {keyId}        |                     |
   |                   |----------------->|                     |
   |                   |                  |                     |
   | Continue to       |                  |                     |
   | Handler           |                  |                     |
   |<------------------|                  |                     |
   |                   |                  |                     |
```

### 3. Webhook Delivery

```
Event              Gateway           BullMQ            Worker            Target
Trigger               |                |                 |                 |
   |                  |                |                 |                 |
   | Event: key.created               |                 |                 |
   |----------------->|                |                 |                 |
   |                  |                |                 |                 |
   |                  | Find Webhooks  |                 |                 |
   |                  | subscribed to  |                 |                 |
   |                  | 'key.created'  |                 |                 |
   |                  |-----|          |                 |                 |
   |                  |<----|          |                 |                 |
   |                  |                |                 |                 |
   |                  | Queue Job      |                 |                 |
   |                  | (per webhook)  |                 |                 |
   |                  |--------------->|                 |                 |
   |                  |                |                 |                 |
   |                  |                | Process Job     |                 |
   |                  |                |---------------->|                 |
   |                  |                |                 |                 |
   |                  |                |                 | Sign Payload    |
   |                  |                |                 |-----|           |
   |                  |                |                 |<----|           |
   |                  |                |                 |                 |
   |                  |                |                 | POST {url}      |
   |                  |                |                 | X-Webhook-Sig   |
   |                  |                |                 |---------------->|
   |                  |                |                 |                 |
   |                  |                |                 | 200 OK          |
   |                  |                |                 |<----------------|
   |                  |                |                 |                 |
   |                  |                |                 | Log Delivery    |
   |                  |                |                 |-----|           |
   |                  |                |                 |<----|           |
   |                  |                |                 |                 |
   |                  |                | Job Complete    |                 |
   |                  |                |<----------------|                 |
   |                  |                |                 |                 |
```

---

## Data Transformation Points

### Request to Log Entry

```
Incoming Request                         Request Log Entry
+---------------------------+            +--------------------------------+
| Headers:                  |            | id: "req_01H5X4Y6Z8..."        |
|   X-API-Key: dh_live_...  |            | api_key_id: "key_01H5..."      |
|   Content-Type: app/json  |  ------>   | method: "POST"                 |
|   User-Agent: MyApp/1.0   |            | path: "/api/v1/keys"           |
|                           |            | headers: { ... } (sanitized)   |
| Method: POST              |            | body: { ... }                  |
| Path: /api/v1/keys        |            | ip_address: "192.168.1.100"    |
|                           |            | user_agent: "MyApp/1.0"        |
| Body: {                   |            | status_code: 201               |
|   "name": "Test Key",     |            | duration_ms: 45                |
|   "scopes": [...]         |            | timestamp: "2024-01-15T..."    |
| }                         |            +--------------------------------+
+---------------------------+
```

### Event to Webhook Payload

```
Internal Event                           Webhook Payload
+---------------------------+            +--------------------------------+
| type: "key.created"       |            | {                              |
| timestamp: 1705315200000  |  ------>   |   "id": "evt_01H5X4...",       |
| data: {                   |            |   "type": "key.created",       |
|   keyId: "key_01H5...",   |            |   "created": "2024-01-15...",  |
|   name: "Test Key",       |            |   "data": {                    |
|   scopes: [...]           |            |     "object": {                |
| }                         |            |       "id": "key_01H5...",     |
|                           |            |       "name": "Test Key",      |
|                           |            |       "scopes": [...]          |
|                           |            |     }                          |
|                           |            |   }                            |
+---------------------------+            | }                              |
                                         +--------------------------------+
```

---

## Data Storage Locations

### By Data Type

| Data Type | Primary Storage | Cache | Retention |
|-----------|----------------|-------|-----------|
| API Keys | PostgreSQL | Redis (5 min) | Indefinite |
| Request Logs | PostgreSQL (partitioned) | None | 30 days |
| Webhooks | PostgreSQL | Redis (10 min) | Indefinite |
| Webhook Deliveries | PostgreSQL (partitioned) | None | 30 days |
| Audit Logs | PostgreSQL (partitioned) | None | 1 year |
| Rate Limit Counters | Redis (sorted sets) | N/A | Window size |

### Redis Key Patterns

```
datahub:cache:key:{hash}           # Cached API key record
datahub:cache:webhook:{id}         # Cached webhook config
datahub:rl:min:{keyId}             # Per-minute rate limit counter
datahub:rl:hour:{keyId}            # Per-hour rate limit counter
datahub:rl:day:{keyId}             # Per-day rate limit counter
```

---

## Async vs Sync Operations

### Synchronous (Blocking)

| Operation | Reason |
|-----------|--------|
| Authentication | Must verify before proceeding |
| Rate limit check | Must enforce before handler |
| Authorization | Must verify scopes |
| Route handler | Core business logic |
| Response generation | Client waiting |

### Asynchronous (Non-Blocking)

| Operation | Implementation |
|-----------|---------------|
| Request logging | Fire-and-forget to queue |
| `last_used_at` update | Background promise |
| Webhook delivery | BullMQ job queue |
| Metrics emission | Non-blocking writes |
| Audit logging | Async database insert |

---

## Error Flow

```
                              ERROR PROPAGATION

Route Handler
      |
      | throws ValidationError
      v
Error Handling Middleware
      |
      | 1. Log error (with requestId)
      | 2. Map to HTTP status
      | 3. Format error response
      |
      v
+---------------------------------+
| {                               |
|   "success": false,             |
|   "error": {                    |
|     "code": "VALIDATION_ERROR", |
|     "message": "...",           |
|     "details": [...]            |
|   },                            |
|   "meta": {                     |
|     "requestId": "req_...",     |
|     "timestamp": "..."          |
|   }                             |
| }                               |
+---------------------------------+
      |
      v
Request Log (with error info)
      |
      v
PostgreSQL (request_logs table)
```

---

## Data Integrity Guarantees

### Strong Consistency

- API key creation/update/deletion
- Webhook configuration changes
- Audit log entries

### Eventual Consistency

- Request log entries (async write)
- `last_used_at` timestamp updates
- Webhook delivery statistics

### Transactional Operations

```sql
-- Key rotation is transactional
BEGIN;
  -- Create new key
  INSERT INTO api_keys (...) VALUES (...);

  -- Deprecate old key
  UPDATE api_keys SET status = 'deprecated' WHERE id = $1;

  -- Create audit log
  INSERT INTO audit_logs (...) VALUES (...);
COMMIT;
```

---

## Related Documentation

- [Architecture Overview](../architecture/overview.md) - System components
- [Database Architecture](../architecture/database.md) - Storage details
- [Authentication Flow](./authentication-flow.md) - Auth data flow

---

_This document describes the data flow through DataHub API Gateway._
