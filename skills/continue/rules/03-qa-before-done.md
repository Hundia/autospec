---
name: QA Before Done
globs: "**/*.{ts,tsx,test.ts,spec.ts}"
alwaysApply: false
description: Apply when completing tickets or reviewing code — enforces QA verification before marking tickets done
---

# QA Before Done

No ticket is ✅ Done without verification. Scale QA effort to the type of change.

## QA Verification Matrix

| Change Type | Required Verification |
|-------------|----------------------|
| Bug fix | Reproduce issue first, apply fix, verify the original user flow passes |
| API change | `npm run build` + `npm test` in `cli/`, verify contract matches `specs/06-api-contracts.md` |
| UI change | `npm run build` in `viewer/`, visual check in browser |
| DB migration | Backup check, migration up/down test, data integrity verification |
| Docs/config only | No QA required — mark ✅ directly |
| Full-stack feature | Full test suite + new test cases + integration check |

## Testing Commands

```bash
# CLI tests
cd cli && npm test
cd cli && npm run test:unit
cd cli && HEADLESS=true npx vitest run

# CLI build
cd cli && npm run build

# Viewer build
cd viewer && npm run build

# Viewer dev server
cd viewer && npm run dev
```

## Code Quality Checklist

Before marking any code change as complete, verify:

- [ ] **No `any` types** — use proper TypeScript types or `unknown` with type guards
- [ ] **No `console.log`** in production code — use structured logging if available
- [ ] **Error handling** — all async operations have try/catch or .catch(), errors are typed
- [ ] **No hardcoded secrets** — no API keys, passwords, or tokens in source code
- [ ] **Input validation** — user inputs validated with Zod schemas
- [ ] **Edge cases** — null/undefined handled, empty arrays/objects considered
- [ ] **Naming** — variables and functions have descriptive, consistent names

## Definition of Done

A ticket is complete when ALL of the following are true:

1. **Implementation matches spec** — code fulfills all acceptance criteria from the ticket
2. **Tests pass** — all existing tests pass, new tests added for new functionality
3. **Build succeeds** — `npm run build` completes without errors in affected packages
4. **Docs updated** — relevant `docs/` section reflects the change
5. **Backlog updated** — ticket status set to ✅ in `specs/backlog.md`
6. **No regressions** — existing functionality still works as expected
