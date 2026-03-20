---
title: "GitHub Pages Deployment"
sprint: "5.2, 5.4"
created: "2026-03-09"
---

# GitHub Pages Deployment

## Overview

The AutoSpec viewer is automatically deployed to GitHub Pages on every push to `main`.

## Setup (one-time)

1. Go to repository Settings → Pages
2. Source: **GitHub Actions**
3. Push to main → deployment runs automatically

## Workflows

### `ci.yml` — Continuous Integration
Runs on every push and pull request to `main`:
- `test-cli` job: `cd cli && npm ci && npm run build && npm test`
- `build-viewer` job: `cd viewer && npm ci && npm run build`

### `pages.yml` — GitHub Pages Deploy
Runs on every push to `main`:
1. `cd viewer && npm ci && npm run build`
2. Upload `viewer/dist/` as Pages artifact
3. Deploy to GitHub Pages

## Local Preview

```bash
cd viewer && npm run build && npm run preview
# Opens at http://localhost:4173
```

## NPM Release Process

```bash
# 1. Update version
cd cli && npm version patch  # or minor/major

# 2. Build + test
npm run build && npm test

# 3. Publish
npm publish  # requires NPM_TOKEN in CI or local npm login

# 4. Tag and push
git tag v$(node -p "require('./package.json').version")
git push --tags
```

## Environment Variables

No environment variables required for the viewer (fully static).

For the CLI (if adding telemetry in the future):
- `AUTOSPEC_TELEMETRY=false` — disable any telemetry
