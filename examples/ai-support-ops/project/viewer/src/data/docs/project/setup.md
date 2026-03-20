# Project Setup

## Suggested Repo Shape
```text
apps/web
apps/api
apps/worker
packages/ui
packages/config
packages/test-utils
viewer/src/data
```

## Config Notes
- TypeScript project references for web, api, worker, and shared packages.
- ESLint with import order and no-explicit-any rule.
- Prettier for formatting.
- Vite for web and viewer build pipelines.
