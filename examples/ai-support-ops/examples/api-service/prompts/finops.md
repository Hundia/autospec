# DataHub API Gateway - FinOps Model Selection Guide

## Overview

Model selection guide for DataHub development tasks.

---

## Model Tiers

### Claude Haiku (Fast & Economical)

**Best for:**
- Boilerplate generation
- Simple CRUD implementations
- Documentation writing
- Configuration files
- Test data generation
- Code formatting

**DataHub Examples:**
```
- Generate Prisma seed data
- Create route boilerplate
- Write environment templates
- Generate test fixtures
- Simple migration scripts
```

### Claude Sonnet (Balanced)

**Best for:**
- Feature implementation
- API endpoint development
- Middleware creation
- Test writing
- Bug investigation

**DataHub Examples:**
```
- Implement auth endpoints
- Create API key service
- Write rate limiter middleware
- Build permission checking
- Implement proxy handler
- Write integration tests
```

### Claude Opus (Most Capable)

**Best for:**
- Architecture design
- Security review
- Performance optimization
- Complex query optimization
- System integration

**DataHub Examples:**
```
- Design rate limiting algorithm
- Security audit of API key handling
- TimescaleDB query optimization
- Proxy architecture design
- Analytics aggregation strategy
```

---

## Task-Based Selection

### Sprint 0 Tasks

| Task | Model | Rationale |
|------|-------|-----------|
| Project setup | Haiku | Boilerplate |
| Auth design | Opus | Security critical |
| Auth implementation | Sonnet | Standard feature |
| API key generation | Sonnet | Security sensitive |
| Rate limit algorithm | Opus | Performance critical |
| Rate limit implementation | Sonnet | Standard feature |
| Tests | Sonnet | Needs understanding |
| Documentation | Haiku | Content generation |

### Sprint 1 Tasks

| Task | Model | Rationale |
|------|-------|-----------|
| API config CRUD | Sonnet | Standard feature |
| Permission system | Sonnet | Logic implementation |
| Proxy middleware | Opus | Complex routing |
| TimescaleDB setup | Opus | Performance critical |
| Analytics queries | Opus | Query optimization |
| Analytics endpoints | Sonnet | Standard feature |

---

## Cost Estimates

```
Sprint 0:
├─ Haiku:  ~400K tokens → ~$0.60
├─ Sonnet: ~2M tokens   → ~$36
├─ Opus:   ~300K tokens → ~$27
└─ Total: ~$64

Sprint 1:
├─ Haiku:  ~200K tokens → ~$0.30
├─ Sonnet: ~2.5M tokens → ~$45
├─ Opus:   ~600K tokens → ~$54
└─ Total: ~$100
```

---

## DataHub-Specific Guidelines

### Security-Critical (Use Opus)
- API key hashing strategy
- JWT implementation
- Permission enforcement
- Input validation design

### Performance-Critical (Use Opus)
- Rate limiting algorithm
- TimescaleDB hypertable design
- Analytics query optimization
- Proxy request handling

### Standard Implementation (Use Sonnet)
- CRUD endpoints
- Middleware chains
- Service layer logic
- Integration tests

### Boilerplate (Use Haiku)
- Route definitions
- Schema migrations
- Seed data
- Configuration files

---

## Decision Flowchart

```
Is it security/auth related?
  YES → Use OPUS
  NO ↓

Is it performance/scaling related?
  YES → Use OPUS
  NO ↓

Is it a standard CRUD/feature?
  YES → Use SONNET
  NO ↓

Is it boilerplate/config?
  YES → Use HAIKU
  NO → Use SONNET (default)
```
