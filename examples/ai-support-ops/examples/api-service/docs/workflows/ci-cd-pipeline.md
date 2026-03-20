# DataHub CI/CD Pipeline

## Overview

DataHub uses GitHub Actions for continuous integration and deployment with a focus on security, performance, and reliability for the API Gateway platform.

---

## Pipeline Architecture

```mermaid
flowchart TB
    subgraph Trigger["Triggers"]
        PR[Pull Request]
        PUSH[Push to Main]
        TAG[Version Tag]
    end

    subgraph CI["CI Pipeline"]
        LINT[Lint & Format]
        TYPES[Type Check]
        UNIT[Unit Tests]
        INT[Integration Tests]
        SECURITY[Security Scan]
        BUILD[Build]
    end

    subgraph CD["CD Pipeline"]
        DOCKER[Build Image]
        PUSH_IMG[Push to ECR]
        STAGING[Deploy Staging]
        LOAD[Load Tests]
        PROD[Deploy Production]
    end

    PR --> LINT
    PUSH --> LINT
    TAG --> LINT

    LINT --> TYPES --> UNIT --> INT --> SECURITY --> BUILD

    BUILD -->|Main Branch| DOCKER
    DOCKER --> PUSH_IMG --> STAGING --> LOAD
    LOAD -->|Tag Only| PROD

    style CI fill:#10b981,color:#fff
    style CD fill:#f59e0b,color:#fff
```

---

## Pipeline Stages

### Stage 1: Code Quality

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Format check
        run: npm run format:check
```

### Stage 2: Testing

```yaml
  unit-tests:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4

  integration-tests:
    needs: quality
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: datahub_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379
      timescaledb:
        image: timescale/timescaledb:latest-pg15
        env:
          POSTGRES_DB: analytics_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5433:5432

    steps:
      - uses: actions/checkout@v4

      - name: Run migrations
        run: npm run db:migrate:test

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/datahub_test
          REDIS_URL: redis://localhost:6379
          TIMESCALE_URL: postgresql://test:test@localhost:5433/analytics_test
```

### Stage 3: Security Scanning

```yaml
  security:
    needs: [unit-tests, integration-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'

      - name: SAST scan
        uses: github/codeql-action/analyze@v2
```

### Stage 4: Build & Deploy

```yaml
  build:
    needs: security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build application
        run: npm run build

      - name: Build Docker image
        run: |
          docker build -t datahub-gateway:${{ github.sha }} .

      - name: Push to ECR
        if: github.ref == 'refs/heads/main'
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker tag datahub-gateway:${{ github.sha }} $ECR_REGISTRY/datahub-gateway:${{ github.sha }}
          docker push $ECR_REGISTRY/datahub-gateway:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to EKS Staging
        run: |
          kubectl set image deployment/datahub-gateway \
            gateway=$ECR_REGISTRY/datahub-gateway:${{ github.sha }} \
            -n datahub-staging

      - name: Wait for rollout
        run: kubectl rollout status deployment/datahub-gateway -n datahub-staging

  load-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run k6 load tests
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load/gateway-load.js
        env:
          K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
          BASE_URL: https://staging-gateway.datahub.io

      - name: Check performance thresholds
        run: |
          if [ $K6_EXIT_CODE -ne 0 ]; then
            echo "Performance thresholds not met"
            exit 1
          fi

  deploy-production:
    needs: load-tests
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to EKS Production
        run: |
          kubectl set image deployment/datahub-gateway \
            gateway=$ECR_REGISTRY/datahub-gateway:${{ github.sha }} \
            -n datahub-production

      - name: Wait for rollout
        run: kubectl rollout status deployment/datahub-gateway -n datahub-production

      - name: Verify deployment
        run: |
          curl -f https://gateway.datahub.io/health || exit 1
```

---

## Load Test Configuration

```javascript
// tests/load/gateway-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Steady state
    { duration: '2m', target: 200 },   // Spike
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<100', 'p(99)<200'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['rate>1000'],
  },
};

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/proxy/health`, {
    headers: {
      'X-API-Key': __ENV.TEST_API_KEY,
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'latency < 100ms': (r) => r.timings.duration < 100,
  });

  sleep(0.1);
}
```

---

## Pipeline Status

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE STATUS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Build #456: feat(ratelimit): add sliding window                │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Quality │→│  Unit   │→│  Integ  │→│Security │→│  Build  │   │
│  │   ✓     │ │   ✓     │ │   ✓     │ │   ✓     │ │   ✓     │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                     │            │
│                                                     ▼            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│  │ Staging │→│  Load   │→│  Prod   │                           │
│  │   ✓     │ │   ✓     │ │ Pending │                           │
│  └─────────┘ └─────────┘ └─────────┘                           │
│                                                                  │
│  Duration: 12m 34s  |  Coverage: 84%  |  Awaiting approval      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [Development Workflow](./development.md)
- [Deployment Process](./deployment.md)
- [Testing Strategy](../testing/strategy.md)
