# ShopFlow CI/CD Pipeline

## Overview

Continuous Integration and Continuous Deployment pipeline for the ShopFlow e-commerce platform.

---

## Pipeline Architecture

```mermaid
flowchart TB
    subgraph Trigger["Triggers"]
        PUSH[Push to Branch]
        PR[Pull Request]
        TAG[Version Tag]
        MANUAL[Manual Dispatch]
    end

    subgraph CI["Continuous Integration"]
        LINT[Lint & Format]
        BUILD[Build]
        UNIT[Unit Tests]
        INT[Integration Tests]
        SECURITY[Security Scan]
    end

    subgraph CD["Continuous Deployment"]
        STAGING[Deploy Staging]
        E2E[E2E Tests]
        PROD[Deploy Production]
    end

    Trigger --> CI
    CI --> CD
```

---

## GitHub Actions Workflow

### Main CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
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

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  build:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  test-unit:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  test-integration:
    runs-on: ubuntu-latest
    needs: build
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: shopflow_test
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/shopflow_test

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/shopflow_test
          REDIS_URL: redis://localhost:6379

  security-scan:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == 'refs/heads/main' || github.event.inputs.environment == 'staging'

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        run: |
          docker build -t shopflow-api .
          docker tag shopflow-api:latest ${{ secrets.ECR_REGISTRY }}/shopflow-api:staging-${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/shopflow-api:staging-${{ github.sha }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster shopflow-staging \
            --service shopflow-api \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster shopflow-staging \
            --services shopflow-api

  e2e-tests:
    runs-on: ubuntu-latest
    needs: deploy-staging
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
          E2E_BASE_URL: https://staging.shopflow.io

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-results
          path: test-results/

  deploy-production:
    runs-on: ubuntu-latest
    needs: e2e-tests
    environment: production
    if: github.event.inputs.environment == 'production'

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to ECS Production
        run: |
          aws ecs update-service \
            --cluster shopflow-production \
            --service shopflow-api \
            --force-new-deployment

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "ShopFlow deployed to production: ${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Pipeline Stages

```mermaid
flowchart LR
    subgraph Stage1["Stage 1: Validate"]
        L[Lint]
        F[Format]
    end

    subgraph Stage2["Stage 2: Build"]
        B[Build App]
        D[Build Docker]
    end

    subgraph Stage3["Stage 3: Test"]
        U[Unit Tests]
        I[Integration Tests]
    end

    subgraph Stage4["Stage 4: Security"]
        A[Audit]
        S[Scan]
    end

    subgraph Stage5["Stage 5: Deploy"]
        ST[Staging]
        E2E[E2E Tests]
        P[Production]
    end

    Stage1 --> Stage2 --> Stage3 --> Stage4 --> Stage5
```

---

## Environment Configuration

| Environment | Trigger | Approval | Auto-Deploy |
|-------------|---------|----------|-------------|
| Development | PR | None | Yes |
| Staging | Merge to main | None | Yes |
| Production | Manual dispatch | 2 reviewers | No |

---

## Secrets Management

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS deployment credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `ECR_REGISTRY` | Docker registry URL |
| `DATABASE_URL` | Production database connection |
| `STRIPE_SECRET_KEY` | Payment processing key |
| `SLACK_WEBHOOK` | Deployment notifications |

---

## Pipeline Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Build Time | < 5 min | 4.2 min |
| Test Time | < 10 min | 8.5 min |
| Deploy Time | < 15 min | 12 min |
| Success Rate | > 95% | 97.3% |

---

## Related Documents

- [Deployment Process](./deployment.md)
- [Git Workflow](./git-workflow.md)
- [Testing Strategy](../testing/strategy.md)
