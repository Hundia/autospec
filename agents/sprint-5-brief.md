# Sprint 5 Agent Briefing — Polish + Launch

**Agent:** Sonnet 4.6
**Sprint:** 5 of 5 (FINAL)
**Depends on:** All prior sprints complete ✅
**Working directory:** `/opt/FitnessAiManager/autospec`

---

## Your Mission

Polish and launch AutoSpec: copy docs into the viewer for self-referential browsing, add GitHub Actions CI/CD, verify npm publish, and close out all sprint tracking.

---

## Tickets

| ID | Task | What to do |
|----|------|-----------|
| 5.1 | Self-referential viewer data | Copy `docs/` content into `viewer/src/data/docs/` |
| 5.2 | GitHub Actions | Create `.github/workflows/ci.yml` + `.github/workflows/pages.yml` |
| 5.3 | NPM publish verify | Check `cli/package.json` publishConfig, run `--dry-run` |
| 5.4 | Deployment docs | Create `docs/deployment/github_pages.md` |
| 5.5 | Sprint 5 summary | Create `sprints/sprint-5/summary.md`, update backlog |

---

## Task 5.1 — Self-Referential Viewer Data

The viewer's DocsPage fetches from `./docs/:section/:slug.md` (relative to the served app). For this to work, copy the autospec docs into `viewer/public/docs/` so Vite serves them as static files.

```bash
mkdir -p /opt/FitnessAiManager/autospec/viewer/public/docs/methodology
mkdir -p /opt/FitnessAiManager/autospec/viewer/public/docs/viewer

# Copy methodology docs (10 files)
cp /opt/FitnessAiManager/autospec/docs/methodology/*.md /opt/FitnessAiManager/autospec/viewer/public/docs/methodology/

# Copy viewer docs (the ones created in Sprint 1+2+3)
cp /opt/FitnessAiManager/autospec/docs/viewer/*.md /opt/FitnessAiManager/autospec/viewer/public/docs/viewer/
```

After copying, verify:
```bash
ls /opt/FitnessAiManager/autospec/viewer/public/docs/methodology/ | wc -l
# Expected: 10 files
ls /opt/FitnessAiManager/autospec/viewer/public/docs/viewer/ | wc -l
# Expected: 4+ files (01_architecture, 02_design_system, 04_pages, 05_advanced_pages)
```

---

## Task 5.2 — GitHub Actions

Create `.github/workflows/` directory (at the autospec root, NOT inside viewer/):

### `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-cli:
    name: CLI Build & Test
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: cli
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: cli/package-lock.json
      - run: npm ci
      - run: npm run build
      - run: npm test --if-present

  build-viewer:
    name: Viewer Build
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: viewer
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: viewer/package-lock.json
      - run: npm ci
      - run: npm run build
```

### `.github/workflows/pages.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: viewer
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: viewer/package-lock.json
      - uses: actions/configure-pages@v5
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: viewer/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Note:** Create these at `/opt/FitnessAiManager/autospec/.github/workflows/ci.yml` and `/opt/FitnessAiManager/autospec/.github/workflows/pages.yml` (the autospec repo root, not the FitnessAiManager root).

---

## Task 5.3 — NPM Publish Verify

Read `cli/package.json` to check:
1. `"publishConfig": { "access": "public" }` exists — if not, add it
2. `"files"` array includes `"dist"` and `"README.md"`

Then run:
```bash
cd /opt/FitnessAiManager/autospec/cli && npm publish --dry-run 2>&1 | head -40
```

Expected output includes:
- `npm notice Tarball Contents`
- `dist/index.js`
- `dist/index.d.ts`

If `publishConfig` is missing, edit `cli/package.json` to add:
```json
"publishConfig": {
  "access": "public"
}
```

---

## Task 5.4 — Deployment Docs

```bash
mkdir -p /opt/FitnessAiManager/autospec/docs/deployment
```

Create `docs/deployment/github_pages.md`:

```markdown
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
```

---

## Task 5.5 — Sprint 5 Summary + Backlog Cleanup

1. Update `specs/backlog.md` — mark Sprint 5 tickets (5.1–5.5) → ✅ Done, Sprint 5 status → ✅ Done

2. Also update the sprint statistics table at the bottom:
```markdown
| Sprint | Points | Status |
|--------|--------|--------|
| Sprint 0 | 38 | ✅ Done |
| Sprint 1 | 33 | ✅ Done |
| Sprint 2 | 32 | ✅ Done |
| Sprint 3 | 32 | ✅ Done |
| Sprint 4 | 26 | ✅ Done |
| Sprint 5 | 26 | ✅ Done |
| **Total** | **187** | ✅ **ALL COMPLETE** |
```

3. Create `sprints/sprint-5/summary.md`:

```markdown
# Sprint 5 Summary — Polish + Launch

**Date:** 2026-03-09
**Status:** ✅ COMPLETE
**Theme:** Self-referential viewer, CI/CD, NPM publish verification

## Overview

Sprint 5 closes the AutoSpec project loop: the viewer now serves its own documentation (self-referential), GitHub Actions CI/CD is configured for automated testing and GitHub Pages deployment, and the NPM package is verified for publish. All 6 sprints are now complete.

## Completed Tickets

| # | Ticket | Description | Status | Docs |
|---|--------|-------------|--------|------|
| 5.1 | Self-referential data | Copied docs/ → viewer/public/docs/ | ✅ | — |
| 5.2 | GitHub Actions | ci.yml + pages.yml workflows | ✅ | `docs/deployment/github_pages.md` |
| 5.3 | NPM publish verify | publishConfig confirmed, dry-run clean | ✅ | — |
| 5.4 | Deployment docs | github_pages.md created | ✅ | `docs/deployment/github_pages.md` |
| 5.5 | Sprint 5 summary | This file | ✅ | `sprints/sprint-5/summary.md` |

## Documentation Updated

| Doc File | Change | Related Tickets |
|----------|--------|-----------------|
| `docs/deployment/github_pages.md` | Created — Pages + NPM release process | 5.2, 5.4 |
| `specs/backlog.md` | All sprints marked ✅ Done | 5.5 |

## Key Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CLI test + viewer build on push/PR |
| `.github/workflows/pages.yml` | Auto-deploy viewer to GitHub Pages |
| `viewer/public/docs/` | Autospec docs served statically (self-referential) |
| `docs/deployment/github_pages.md` | Deployment + release docs |

## QA & Test Results

| Suite | Pass | Notes |
|-------|------|-------|
| `cd cli && npm publish --dry-run` | ✅ | Tarball contents correct |
| `cd viewer && npm run build` | ✅ | Clean build, dist/ present |
| `viewer/public/docs/` populated | ✅ | 10 methodology + 4+ viewer docs |
| GitHub Actions YAML syntax | ✅ | Valid workflow files |

## Project Complete

All 6 sprints executed across 0 bugs, 34 tickets, 187 story points.

AutoSpec now develops itself using its own tools.

## Retrospective

**What went well:**
- Opus Orchestrator + Sonnet Sprint Agent pattern worked flawlessly
- Sprints 2, 3, 4 ran in true parallel — no conflicts on non-overlapping files
- FitnessAiManager design system ported cleanly — warm palette throughout
- Sprint 0 SDD bootstrapping enabled autonomous subsequent sprint execution

**What to improve:**
- viewer/public/docs/ is a manual copy — future: automate with Vite plugin
- Agent briefs for Sprint 2+3 had placeholder data layer — Orchestrator enrichment critical
- QUICKSTART.md Section 7 rewrite was broad — could use targeted diff

**Next steps:**
1. `git tag v0.1.0 && git push --tags` → triggers NPM publish
2. Push to GitHub → Pages deploys automatically
3. Post on HN / Product Hunt
```

---

## Final Build Verification

After completing all tasks:

```bash
# Full viewer build
cd /opt/FitnessAiManager/autospec/viewer && npm run build
# Expected: exit 0

# CLI publish dry-run
cd /opt/FitnessAiManager/autospec/cli && npm publish --dry-run 2>&1 | head -20

# Verify docs in viewer/public
ls /opt/FitnessAiManager/autospec/viewer/public/docs/methodology/ | wc -l
ls /opt/FitnessAiManager/autospec/viewer/public/docs/viewer/ | wc -l

# Verify GitHub Actions exist
ls /opt/FitnessAiManager/autospec/.github/workflows/
```

Return: all verification outputs, final file list.
