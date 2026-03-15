---
title: Quality Gates Reference
sprint: "24"
created: "2026-03-15"
---

# Quality Gates Reference

The scorer evaluates generated output against 28 gates across 6 categories. Gates are defined machine-readably in `benchmark/config/quality-gates.json`. This document provides the human-readable reference.

**Related sprint:** Sprint 24 — `specs/backlog.md` §Sprint 24 ticket 24.2

---

## Categories and Weights

| Category | Weight | Gate Count | Notes |
|----------|--------|------------|-------|
| Structure | 20% | 6 | Always evaluated |
| Specificity | 20% | 5 | Always evaluated |
| SDD Compliance | 25% | 5 | Always evaluated |
| Coherence | 15% | 4 | Always evaluated |
| Viewer | 10% | 4 | **Conditional** — only if `viewer/` exists |
| Technical Correctness | 10% | 4 | Always evaluated |

When viewer gates are skipped (no `viewer/` directory), their 10% weight redistributes proportionally across the remaining 5 categories.

---

## Scoring Formula

```
overall_score = Σ(category_weight × category_score) / Σ(active_category_weights) × 100
```

Where `category_score` is the sum of gate scores within the category normalized to [0, 1].

**Binary gates** emit PASS (score = 1) or FAIL (score = 0).

**Graded gates** emit a score from 0–3:
- `0` = absent or failing
- `1` = minimal / exists but insufficient
- `2` = adequate
- `3` = comprehensive

Graded gate scores are normalized to [0, 1] by dividing by 3 before contributing to the category score.

---

## Gate Definitions

### Structure (20%)

| Gate ID | Description | Check Type | Conditional |
|---------|-------------|------------|-------------|
| STR-01 | 10 spec files exist in `specs/` (01_product_manager.md through 10_ui_designer.md) | file_exists | No |
| STR-02 | `specs/backlog.md` has 2+ sprint sections (`## Sprint N` pattern) | regex | No |
| STR-03 | `docs/` has 8+ subdirectories | file_count | No |
| STR-04 | `prompts/` directory exists in project root | directory_exists | No |
| STR-05 | `CLAUDE.md` exists in project root | file_exists | No |
| STR-06 | `agents/` directory exists | directory_exists | No |

**STR-01 detail:** Checks for all 10 role spec files by exact name. All 10 must exist for PASS.

**STR-02 detail:** Uses regex pattern `## Sprint \d+` with `min_count: 2`. A backlog with only 1 sprint section fails.

**STR-03 detail:** Counts immediate subdirectories of `docs/`. A flat `docs/` with individual files (not organized into sections) fails.

---

### Specificity (20%)

| Gate ID | Description | Check Type | Graded | Conditional |
|---------|-------------|------------|--------|-------------|
| SPC-01 | No placeholder text in spec files (`[insert here]`, `[TODO]`, `[TBD]`, `<placeholder>`) | regex (inverse) | No | No |
| SPC-02 | Spec files contain project-specific references (entity names from requirements) | content_match | No | No |
| SPC-03 | Specs contain concrete examples (real endpoint paths, table names, SQL patterns) | regex | No | No |
| SPC-04 | Cross-references between specs exist (`See specs/0X_` pattern) | regex | No | No |
| SPC-05 | Average spec file length >100 lines | graded | Yes | No |

**SPC-01 detail:** Case-insensitive inverse match. Any occurrence of `[insert here]`, `[TODO]`, `[TBD]`, or `<placeholder>` across all spec files causes FAIL.

**SPC-02 detail:** Checks for at least 3 of these terms across spec files: `user`, `class`, `booking`, `membership`, `schedule`, `admin`, `trainer`, `client`. Note: these defaults are tuned for FitnessAiManager — TaskFlow targets (`task`, `project`, `category`) may need separate gate config.

**SPC-03 detail:** Regex pattern `/api/|CREATE TABLE|POST /|GET /|PUT /|DELETE /`. At least one match required across spec files.

**SPC-05 graded thresholds:**
- 0 = average line count < 50
- 1 = average line count 50–99
- 2 = average line count 100–299
- 3 = average line count 300+

---

### SDD Compliance (25%)

| Gate ID | Description | Check Type | Graded | Conditional |
|---------|-------------|------------|--------|-------------|
| SDD-01 | Backlog uses SDD status emojis (🔲, 🔄, ✅) | regex | No | No |
| SDD-02 | Tickets have Definition of Done | graded | Yes | No |
| SDD-03 | Assumptions documented in specs (`Assumption` or `Constraint` keyword) | content_match | No | No |
| SDD-04 | `CLAUDE.md` has tech stack + commands (`npm`, `docker`, `npx`) | content_match | No | No |
| SDD-05 | Ticket descriptions reference spec sections (`specs/0N_` pattern) | regex | No | No |

**SDD-02 graded thresholds:**
- 0 = no DoD present in any ticket
- 1 = DoD exists (e.g., checklist present but generic)
- 2 = actionable DoD (e.g., specific acceptance criteria)
- 3 = DoD references spec sections (e.g., "per specs/02_backend_lead.md §Auth")

**SDD-04 detail:** Requires at least 2 of `npm`, `docker`, `npx` in `CLAUDE.md`. The check targets the presence of runnable commands, not just tech stack mentions.

**SDD-05 detail:** Regex `specs/0\d_` in `specs/backlog.md`. Ensures tickets trace back to their source specs.

---

### Coherence (15%)

| Gate ID | Description | Check Type | Graded | Conditional |
|---------|-------------|------------|--------|-------------|
| COH-01 | Entity names consistent across specs (Jaccard similarity) | graded | Yes | No |
| COH-02 | Backend endpoints match QA test targets (cross-spec coherence) | graded | Yes | No |
| COH-03 | DB tables referenced in backend spec match DB architect spec | graded | Yes | No |
| COH-04 | Cross-file references resolve (referenced files exist) | graded | Yes | No |

**COH-01 — Entity Jaccard:** Extract entity names (capitalized nouns, model names) from each spec file. Compute pairwise Jaccard similarity: `|intersection| / |union|`. Average across all pairs. Higher = more consistent naming conventions.

Graded thresholds:
- 0 = fewer than 1 entity appears in 3+ spec files (near-zero overlap)
- 1 = 1–2 entities shared across 3+ files
- 2 = 3+ entities shared, moderate overlap
- 3 = strong entity consistency (entity set overlap > 50%)

**COH-02 detail:** Extracts `GET /`, `POST /`, `PUT /`, `DELETE /` patterns from `specs/02_backend_lead.md` and `specs/05_qa_engineer.md`. Computes overlap (Jaccard on endpoint paths).

Graded thresholds:
- 0 = no overlap
- 1 = 1–25% overlap
- 2 = 25–50% overlap
- 3 = >50% overlap

**COH-03 detail:** Extracts table names (`CREATE TABLE`, `model X`, `interface X`) from `specs/02_backend_lead.md` and `specs/04_db_architect.md`. Computes overlap.

Graded thresholds: same as COH-02 (0 / 0.25 / 0.5).

**COH-04 detail:** Extracts all `specs/0N_*.md` and `docs/*/` references from spec files. For each reference, checks if the referenced file/directory exists. Reports resolution rate (resolved / total).

Graded thresholds:
- 0 = no references resolve
- 1 = 0–50% resolve
- 2 = 50–80% resolve
- 3 = >80% resolve

---

### Viewer (10%, conditional)

**These gates are only evaluated when `viewer/` directory exists in the project root.** When skipped, the 10% weight redistributes proportionally to the remaining categories.

| Gate ID | Description | Check Type | Graded | Condition |
|---------|-------------|------------|--------|-----------|
| VWR-01 | Viewer is not a markdown reader — mentions React/Vue/Svelte or a chart library | content_match | No | `viewer/` exists |
| VWR-02 | Mentions visualization framework (Recharts/D3/Chart.js/ECharts) | content_match | No | `viewer/` exists |
| VWR-03 | 5+ distinct visualizations specified | graded | Yes | `viewer/` exists |
| VWR-04 | Interactive components specified (not just static renders) | content_match | No | `viewer/` exists |

**VWR-01 detail:** Searches `specs/*.md` and `CLAUDE.md` for at least 1 of: `React`, `Vue`, `Svelte`, `Recharts`, `D3`, `Chart.js`, `ECharts`.

**VWR-02 detail:** Searches for at least 1 of: `Recharts`, `D3`, `Chart.js`, `ECharts`, `recharts`, `d3`.

**VWR-03 graded thresholds:**
- 0 = 0 visualizations mentioned
- 1 = 1–2 visualizations
- 2 = 3–4 visualizations
- 3 = 5+ visualizations

**VWR-04 detail:** Case-insensitive search for: `interactive`, `filter`, `search`, `click`, `hover`, `toggle`, `drill-down`.

---

### Technical Correctness (10%)

| Gate ID | Description | Check Type | Graded | Conditional |
|---------|-------------|------------|--------|-------------|
| TC-01 | Valid markdown tables in specs (proper `\|` delimiters, header separator) | regex | No | No |
| TC-02 | No circular dependencies in backlog | graded | Yes | No |
| TC-03 | Consistent forward-slash paths (no Windows backslash paths) | regex (inverse) | No | No |
| TC-04 | Internal links/references use valid relative paths | graded | Yes | No |

**TC-01 detail:** Regex `\|[-:]+\|` — matches at least one markdown table header separator row across spec files.

**TC-02 graded:** Analyzes dependency declarations in `specs/backlog.md` (e.g., `Deps` column). Builds a dependency graph; detects cycles.
- 0 = circular dependencies detected
- 3 = no cycles (binary outcome — scores 0 or 3, not 1 or 2)

**TC-03 detail:** Inverse regex `\\[a-zA-Z]|\\\\` — any Windows-style backslash path in specs or CLAUDE.md causes FAIL.

**TC-04 graded:** Extracts relative paths from spec files, checks resolution rate.
- 0 = no references resolve
- 1 = 0–50% resolve
- 2 = 50–80% resolve
- 3 = >80% resolve

---

## Score Interpretation

| Score Range | Interpretation |
|-------------|----------------|
| 90–100 | Excellent — comprehensive SDD-compliant output |
| 75–89 | Good — strong output with minor gaps |
| 60–74 | Adequate — passes minimum criteria, room to improve |
| < 60 | Poor — significant structural or compliance gaps |

---

## Machine-Readable Definition

All gate definitions live in `benchmark/config/quality-gates.json` (version 1.0, 28 gates). The `scorer.sh` script reads this file directly — the JSON is the authoritative source. This document is the human-readable companion.
