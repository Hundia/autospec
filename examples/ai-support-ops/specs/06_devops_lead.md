# DevOps Lead Spec — AutoSpec Infrastructure

## NPM Package
- **Name:** `autospec` (or `@autospec/cli` if taken)
- **Version:** 0.1.0 → follows semver
- **Main:** `dist/index.js` (CommonJS)
- **Bin:** `autospec` → `dist/index.js`
- **publishConfig:** `{ "access": "public" }`

## GitHub Actions Workflows

### `.github/workflows/ci.yml` (on: push, PR)
```yaml
jobs:
  test:
    - checkout
    - node 20
    - cd cli && npm ci && npm run build && npm test
  build-viewer:
    - cd viewer && npm ci && npm run build
```

### `.github/workflows/pages.yml` (on: push to main)
```yaml
jobs:
  deploy:
    - build viewer (npm run build)
    - Upload artifact: viewer/dist/
    - Deploy to GitHub Pages
```

### `.github/workflows/release.yml` (on: tag v*)
```yaml
jobs:
  publish:
    - npm publish (with NPM_TOKEN secret)
```

## Package Scripts
```json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepublishOnly": "npm run build && npm test",
    "typecheck": "tsc --noEmit"
  }
}
```

## Release Process
1. Update version in `cli/package.json`
2. `git tag v0.1.0`
3. Push tag → triggers release.yml → npm publish
4. Update CHANGELOG.md
