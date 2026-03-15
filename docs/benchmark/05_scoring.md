---
title: "Scoring Engine"
sprint: "24"
created: "2026-03-15"
---

# Scoring Engine

`benchmark/scorer.sh` evaluates any AutoSpec project directory against the 28 quality gates defined in `benchmark/config/quality-gates.json`. It produces a `scores.json` file with per-gate results, category subtotals, and a weighted overall score from 0–100.

---

## Scoring Formula

```
category_score    = Σ(gate_scores in category) / Σ(gate_max_scores in category)
weighted_category = category_score × category_weight
overall           = Σ(weighted_category) / Σ(active_weights) × 100
```

**Active weights** exclude conditional categories (Viewer) whose gates were all skipped. The remaining weights are summed to form the denominator, ensuring scores are always normalized to 100.

Example: if Viewer is skipped (weight 10%), the denominator is 90 (not 100), so a perfect score on all other categories still yields 100.

---

## Weighted Categories

| Category | Weight | Gates | Type Mix |
|----------|--------|-------|----------|
| Structure | 20% | 6 (STR-01–STR-06) | All binary |
| Specificity | 20% | 5 (SPC-01–SPC-05) | 4 binary + 1 graded |
| SDD Compliance | 25% | 5 (SDD-01–SDD-05) | 3 binary + 2 graded |
| Coherence | 15% | 4 (COH-01–COH-04) | All graded |
| Viewer | 10% | 4 (VWR-01–VWR-04) | 2 binary + 2 graded (conditional) |
| Technical Correctness | 10% | 4 (TC-01–TC-04) | 2 binary + 2 graded |

**Total weight: 100%** (or 90% when Viewer is skipped)

---

## Binary vs Graded Gates

### Binary Gates (PASS / FAIL)

Binary gates score either 0 (FAIL) or their defined weight (PASS, usually 1 point). Examples:

| Gate | Check | Pass Condition |
|------|-------|---------------|
| STR-01 | All 10 spec files exist | Every `specs/0N_*.md` found |
| STR-05 | `CLAUDE.md` exists | File present at project root |
| SDD-01 | SDD status emojis in backlog | `🔲`, `🔄`, or `✅` appears in `specs/backlog.md` |
| TC-01 | Valid markdown tables | `\|[-:]+\|` pattern found in spec files |
| TC-03 | No Windows backslash paths | No `\letter` or `\\` paths in specs |

### Graded Gates (0–3)

Graded gates measure quality on a spectrum. Score 0 means absent, 3 means excellent.

| Gate | Metric | 0 | 1 | 2 | 3 |
|------|--------|---|---|---|---|
| SPC-05 | Avg spec length | <50 lines | 50–99 | 100–299 | 300+ |
| SDD-02 | DoD quality | None | Basic exists | Actionable language | References spec files |
| COH-01 | Entity consistency | <3 shared nouns across files | 3–5 | 6–9 | 10+ |
| COH-02 | Endpoint overlap (backend ↔ QA) | 0% | 1–24% | 25–49% | 50%+ |
| COH-03 | DB table overlap (backend ↔ DB architect) | 0% | 1–24% | 25–49% | 50%+ |
| COH-04 | Cross-file reference resolution | <25% | 25–49% | 50–74% | 75%+ |
| TC-02 | No circular dependencies | Cycles detected | — | — | No cycles |
| TC-04 | Internal link validity | 0% valid | 1–49% | 50–79% | 80%+ |
| VWR-03 | Visualization keyword count | 0 | 1–2 | 3–4 | 5+ |

Graded gate `max_score` is always **3** (regardless of weight in config). Category math uses raw scores.

---

## Conditional Gate Behavior

Gates with `"conditional": true` are only evaluated when a precondition is met. Currently, all Viewer category gates depend on `viewer/` existing in the project root:

```json
"condition": {
  "type": "directory_exists",
  "path": "viewer/"
}
```

**When condition is NOT met:**
- Gate status is `SKIPPED`
- Gate score and max_score are both `0`
- The entire Viewer category weight (10%) is excluded from `active_weight`
- `normalized_score = Σ(weighted_categories) / 90 × 100` — effectively redistributes to other categories

**When condition IS met:**
- All 4 Viewer gates are evaluated normally (VWR-01, VWR-02 binary; VWR-03, VWR-04 graded)
- Category weight (10%) is included in `active_weight`

---

## Invocation Modes

### Mode 1: Harness Results Directory

A harness results directory contains `output.log` (the raw model output from `harness.sh`). The scorer evaluates the project files written by the model into the temp directory, which was copied there alongside `output.log`.

```bash
./benchmark/scorer.sh results/run-20260315/claude/run-1/
```

Auto-detection: if `output.log` exists in `$1`, mode is `"harness"`.

### Mode 2: Standalone Project Directory

Score any AutoSpec project directly — no harness run needed. Useful for evaluating reference projects or hand-crafted specs.

```bash
./benchmark/scorer.sh examples/mealmap/
./benchmark/scorer.sh examples/taskflow/
./benchmark/scorer.sh /path/to/any/autospec-project/
```

Auto-detection: if `output.log` is absent, mode is `"standalone"`.

Both modes produce identical `scores.json` format; the `mode` field indicates which was used.

---

## Aggregate Mode

When a model has run N times, aggregate across all runs to compute stability metrics:

```bash
./benchmark/scorer.sh --aggregate results/run-20260315/claude/
```

This finds all `run-N/scores.json` files under the model directory and computes per-gate and per-category statistics.

**Output:** `results/run-20260315/claude/aggregate-scores.json`

```json
{
  "timestamp": "2026-03-15T14:30:00Z",
  "model_dir": "/path/to/claude/",
  "run_count": 3,
  "gates": {
    "STR-01": {
      "mean": 1.0,
      "min": 1,
      "max": 1,
      "stddev": 0.0,
      "max_score": 1,
      "pass_count": 3,
      "run_count": 3
    }
  },
  "categories": {
    "structure": {
      "mean_weighted_score": 19.2,
      "min": 18.0,
      "max": 20.0,
      "stddev": 0.9
    }
  },
  "overall": {
    "mean": 78.4,
    "min": 74.1,
    "max": 81.6,
    "stddev": 3.1,
    "run_count": 3
  }
}
```

A low `stddev` on overall score indicates the model produces consistent quality. High stddev (>10 points) suggests high variance in output quality across runs.

---

## Example `scores.json`

```json
{
  "timestamp": "2026-03-15T12:00:00Z",
  "target_dir": "/tmp/benchmark-claude-1-1710504000/",
  "mode": "harness",
  "gates": {
    "STR-01": {
      "status": "PASS",
      "score": 1,
      "max_score": 1,
      "details": "10/10 spec files found"
    },
    "STR-02": {
      "status": "PASS",
      "score": 1,
      "max_score": 1,
      "details": "Found 4 matches (min: 2)"
    },
    "STR-03": {
      "status": "FAIL",
      "score": 0,
      "max_score": 1,
      "details": "6 subdirectories found (min: 8)"
    },
    "SPC-05": {
      "status": "GRADED",
      "score": 2,
      "max_score": 3,
      "details": "Average spec length: 185 lines (score: 2/3)"
    },
    "VWR-01": {
      "status": "SKIPPED",
      "score": 0,
      "max_score": 0,
      "details": "Condition not met: viewer/ not found"
    }
  },
  "categories": {
    "structure": {
      "score": 5,
      "max_score": 6,
      "weight": 20,
      "weighted_score": 16.67,
      "skipped": false
    },
    "specificity": {
      "score": 6,
      "max_score": 8,
      "weight": 20,
      "weighted_score": 15.0,
      "skipped": false
    },
    "sdd_compliance": {
      "score": 8,
      "max_score": 11,
      "weight": 25,
      "weighted_score": 18.18,
      "skipped": false
    },
    "coherence": {
      "score": 7,
      "max_score": 12,
      "weight": 15,
      "weighted_score": 8.75,
      "skipped": false
    },
    "viewer": {
      "score": 0,
      "max_score": 0,
      "weight": 10,
      "weighted_score": 0,
      "skipped": true
    },
    "technical_correctness": {
      "score": 7,
      "max_score": 10,
      "weight": 10,
      "weighted_score": 7.0,
      "skipped": false
    }
  },
  "overall": {
    "raw_score": 33,
    "max_possible": 47,
    "weighted_score": 65.6,
    "active_weight": 90,
    "normalized_score": 72.9
  }
}
```

---

## Score Interpretation

| Score | Rating | Meaning |
|-------|--------|---------|
| 90–100 | **Excellent** | Comprehensive, specific, well-cross-referenced specs. Entity names consistent across files, endpoints aligned with QA targets, rich DoD with spec references. |
| 75–89 | **Good** | Solid coverage with minor gaps. Most structure present, some graded gates at partial score. Suitable for production use. |
| 60–74 | **Adequate** | Meets minimum structural requirements but lacks depth. Specs may be thin (<100 lines), cross-references sparse, or coherence checks failing. |
| <60 | **Poor** | Significant gaps in structure or specificity. Missing spec files, placeholder text, no DoD, or low coherence across specs. |

---

## Related Files

| File | Purpose |
|------|---------|
| `benchmark/scorer.sh` | Main scoring engine (Sprint 24.10) |
| `benchmark/config/quality-gates.json` | 28 gate definitions (Sprint 24.2) |
| `benchmark/lib/common.sh` | Shared logging + utilities (Sprint 24.3) |
| `docs/benchmark/02_quality_gates.md` | Gate-by-gate reference (Sprint 24.2) |
| `docs/benchmark/04_run_config.md` | CLI run configuration (Sprint 24.6) |

*Sprint 24, Phase D — Scorer implementation*
