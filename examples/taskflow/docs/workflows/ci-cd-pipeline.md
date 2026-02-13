# TaskFlow CI/CD Pipeline

## Overview

TaskFlow uses GitHub Actions for continuous integration and deployment. This document details the pipeline stages, configurations, and deployment processes.

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
        INSTALL[Install Dependencies]
        LINT[Lint Check]
        TYPES[Type Check]
        TEST[Run Tests]
        BUILD[Build App]
    end

    subgraph CD["CD Pipeline"]
        DOCKER[Build Docker Image]
        PUSH_IMG[Push to Registry]
        DEPLOY_STAGE[Deploy Staging]
        E2E[E2E Tests]
        DEPLOY_PROD[Deploy Production]
    end

    PR --> INSTALL
    PUSH --> INSTALL
    TAG --> INSTALL

    INSTALL --> LINT --> TYPES --> TEST --> BUILD

    BUILD -->|Main Branch| DOCKER
    DOCKER --> PUSH_IMG --> DEPLOY_STAGE --> E2E
    E2E -->|Tag Only| DEPLOY_PROD

    style Trigger fill:#3b82f6,color:#fff
    style CI fill:#10b981,color:#fff
    style CD fill:#f59e0b,color:#fff
```

---

## Pipeline Stages

### Stage 1: Install Dependencies

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  install:
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

      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```

### Stage 2: Quality Checks

```mermaid
flowchart LR
    subgraph QualityChecks["Quality Checks (Parallel)"]
        direction TB
        LINT[ESLint<br/>Code Style]
        TYPES[TypeScript<br/>Type Safety]
        FORMAT[Prettier<br/>Formatting]
    end

    INSTALL[Dependencies] --> QualityChecks
    QualityChecks --> TESTS[Tests]
```

```yaml
  lint:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier Check
        run: npm run format:check

  typecheck:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: TypeScript Check
        run: npm run typecheck
```

### Stage 3: Testing

```yaml
  test:
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: taskflow_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/taskflow_test

      - name: Run unit tests
        run: npm run test:unit -- --coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/taskflow_test

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/taskflow_test

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

### Stage 4: Build

```yaml
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7
```

---

## Deployment Pipeline

### Docker Build & Push

```mermaid
flowchart LR
    subgraph Docker["Docker Pipeline"]
        BUILD[Build Image]
        SCAN[Security Scan]
        TAG[Tag Image]
        PUSH[Push to ECR]
    end

    ARTIFACTS[Build Artifacts] --> BUILD
    BUILD --> SCAN --> TAG --> PUSH
```

```yaml
  docker:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/taskflow:$IMAGE_TAG .
          docker build -t $ECR_REGISTRY/taskflow:latest .
          docker push $ECR_REGISTRY/taskflow:$IMAGE_TAG
          docker push $ECR_REGISTRY/taskflow:latest

      - name: Run Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ steps.login-ecr.outputs.registry }}/taskflow:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
```

### Staging Deployment

```yaml
  deploy-staging:
    needs: docker
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Deploy to ECS Staging
        run: |
          aws ecs update-service \
            --cluster taskflow-staging \
            --service taskflow-api \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster taskflow-staging \
            --services taskflow-api

      - name: Run smoke tests
        run: |
          curl -f https://staging.taskflow.app/health || exit 1
```

### E2E Tests

```yaml
  e2e-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://staging.taskflow.app

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### Production Deployment

```yaml
  deploy-production:
    needs: e2e-tests
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_PROD_ROLE_ARN }}
          aws-region: us-east-1

      - name: Deploy to ECS Production
        run: |
          aws ecs update-service \
            --cluster taskflow-production \
            --service taskflow-api \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster taskflow-production \
            --services taskflow-api

      - name: Verify deployment
        run: |
          curl -f https://taskflow.app/health || exit 1

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

---

## Pipeline Status Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline Status                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PR #456: feat(tasks): add label filtering                      │
│                                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐         │
│  │ Install │──►│  Lint   │──►│  Types  │──►│  Test   │         │
│  │   ✓     │   │   ✓     │   │   ✓     │   │   ✓     │         │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘         │
│                                                  │              │
│                                                  ▼              │
│                                            ┌─────────┐          │
│                                            │  Build  │          │
│                                            │   ✓     │          │
│                                            └─────────┘          │
│                                                                 │
│  Duration: 4m 32s  |  Coverage: 78%  |  All checks passed ✓    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Configuration

### Environment Variables

```yaml
# CI Environment
CI_ENVIRONMENT: test
DATABASE_URL: postgresql://test:test@localhost:5432/taskflow_test
JWT_SECRET: test-jwt-secret
NODE_ENV: test

# Staging Environment
CI_ENVIRONMENT: staging
DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
JWT_SECRET: ${{ secrets.STAGING_JWT_SECRET }}
NODE_ENV: production

# Production Environment
CI_ENVIRONMENT: production
DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
JWT_SECRET: ${{ secrets.PROD_JWT_SECRET }}
NODE_ENV: production
```

### Secrets Management

```mermaid
flowchart LR
    subgraph Secrets["GitHub Secrets"]
        DB[DATABASE_URL]
        JWT[JWT_SECRET]
        AWS[AWS_ROLE_ARN]
    end

    subgraph Environments
        STG[Staging]
        PROD[Production]
    end

    Secrets -->|Injected| STG
    Secrets -->|Injected| PROD
```

---

## Pipeline Optimization

### Caching Strategy

| Cache | Key | Purpose |
|-------|-----|---------|
| npm | hash(package-lock.json) | Node modules |
| Docker | layer cache | Build layers |
| Playwright | playwright version | Browser binaries |

### Parallelization

```mermaid
flowchart LR
    INSTALL[Install] --> LINT[Lint]
    INSTALL --> TYPES[TypeCheck]
    INSTALL --> FORMAT[Format]

    LINT --> TEST[Test]
    TYPES --> TEST
    FORMAT --> TEST
```

---

## Troubleshooting

### Common Failures

| Issue | Cause | Solution |
|-------|-------|----------|
| Test timeout | DB not ready | Increase health check retries |
| Build OOM | Large bundle | Increase runner memory |
| Deploy fail | Service unstable | Check ECS logs |
| E2E flaky | Network issues | Add retry logic |

### Debugging Steps

```bash
# View workflow logs
gh run view <run-id>

# Re-run failed jobs
gh run rerun <run-id> --failed

# Download artifacts
gh run download <run-id> -n build
```

---

## Related Documents

- [Development Workflow](./development.md)
- [Deployment Process](./deployment.md)
- [Environment Setup](../environments/development.md)
