// Benchmark data layer — types + static data from Sprint 24

export type GateStatus = 'pass' | 'fail' | 'graded' | 'skipped'
export type CheckType = 'file_exists' | 'directory_exists' | 'regex' | 'content_match' | 'file_count' | 'line_count' | 'graded'

export interface QualityGate {
  id: string
  category: string
  description: string
  weight: number
  checkType: CheckType
  conditional: boolean
}

export interface GateResult {
  status: GateStatus
  score: number
  maxScore: number
  details: string
}

export interface CategoryResult {
  score: number
  maxScore: number
  weight: number
  weightedScore: number
  skipped: boolean
}

export interface RunResult {
  runNumber: number
  timestamp: string
  gates: Record<string, GateResult>
  categories: Record<string, CategoryResult>
  overall: {
    rawScore: number
    maxPossible: number
    weightedScore: number
    activeWeight: number
    normalizedScore: number
  }
}

export interface AggregateGateResult {
  mean: number
  min: number
  max: number
  stddev: number
  maxScore: number
}

export interface AggregateCategoryResult {
  meanWeightedScore: number
  min: number
  max: number
  stddev: number
}

export interface ModelBenchmark {
  model: string
  displayName: string
  color: string
  runs: RunResult[]
  aggregate: {
    runCount: number
    gates: Record<string, AggregateGateResult>
    categories: Record<string, AggregateCategoryResult>
    overall: { mean: number; min: number; max: number; stddev: number }
  }
}

export interface BenchmarkCategory {
  id: string
  label: string
  weight: number
  color: string
  gateCount: number
}

export interface ScoreTier {
  min: number
  max: number
  label: string
  color: string
  description: string
}

export interface BenchmarkConfig {
  targetProject: string
  runsPerModel: number
  timestamp: string
}

// ── Category definitions ──

export const categories: BenchmarkCategory[] = [
  { id: 'structure', label: 'Structure', weight: 20, color: '#698472', gateCount: 6 },
  { id: 'specificity', label: 'Specificity', weight: 20, color: '#c69a84', gateCount: 5 },
  { id: 'sdd_compliance', label: 'SDD Compliance', weight: 25, color: '#44564a', gateCount: 5 },
  { id: 'coherence', label: 'Coherence', weight: 15, color: '#8e6a59', gateCount: 4 },
  { id: 'viewer', label: 'Viewer', weight: 10, color: '#a08c72', gateCount: 4 },
  { id: 'technical_correctness', label: 'Technical', weight: 10, color: '#a8bfaf', gateCount: 4 },
]

export const categoryColorMap: Record<string, string> = Object.fromEntries(categories.map(c => [c.id, c.color]))

// ── Score tiers ──

export const scoreTiers: ScoreTier[] = [
  { min: 90, max: 100, label: 'Excellent', color: '#698472', description: 'Comprehensive, specific, well-cross-referenced' },
  { min: 75, max: 89, label: 'Good', color: '#a8bfaf', description: 'Solid coverage, minor gaps' },
  { min: 60, max: 74, label: 'Adequate', color: '#f59e0b', description: 'Meets minimum structure, lacks depth' },
  { min: 0, max: 59, label: 'Poor', color: '#8e6a59', description: 'Significant gaps in structure or specificity' },
]

export function getScoreTier(score: number): ScoreTier {
  return scoreTiers.find(t => score >= t.min && score <= t.max) || scoreTiers[scoreTiers.length - 1]
}

// ── 28 Quality Gates (from config/quality-gates.json) ──

export const qualityGates: QualityGate[] = [
  // Structure (6)
  { id: 'STR-01', category: 'structure', description: '10 spec files exist in specs/', weight: 1, checkType: 'file_exists', conditional: false },
  { id: 'STR-02', category: 'structure', description: 'Backlog has 2+ sprint sections', weight: 1, checkType: 'regex', conditional: false },
  { id: 'STR-03', category: 'structure', description: 'docs/ has 8+ subdirectories', weight: 1, checkType: 'file_count', conditional: false },
  { id: 'STR-04', category: 'structure', description: 'prompts/ directory exists', weight: 1, checkType: 'directory_exists', conditional: false },
  { id: 'STR-05', category: 'structure', description: 'CLAUDE.md exists in root', weight: 1, checkType: 'file_exists', conditional: false },
  { id: 'STR-06', category: 'structure', description: 'agents/ directory exists', weight: 1, checkType: 'directory_exists', conditional: false },
  // Specificity (5)
  { id: 'SPC-01', category: 'specificity', description: 'No placeholder text in specs', weight: 1, checkType: 'regex', conditional: false },
  { id: 'SPC-02', category: 'specificity', description: 'Project-specific entity references', weight: 1, checkType: 'content_match', conditional: false },
  { id: 'SPC-03', category: 'specificity', description: 'Concrete examples (endpoints, tables)', weight: 1, checkType: 'regex', conditional: false },
  { id: 'SPC-04', category: 'specificity', description: 'Cross-references between specs', weight: 1, checkType: 'regex', conditional: false },
  { id: 'SPC-05', category: 'specificity', description: 'Avg spec length >100 lines', weight: 1, checkType: 'graded', conditional: false },
  // SDD Compliance (5)
  { id: 'SDD-01', category: 'sdd_compliance', description: 'Status emojis in backlog', weight: 1, checkType: 'regex', conditional: false },
  { id: 'SDD-02', category: 'sdd_compliance', description: 'Tickets have Definition of Done', weight: 1, checkType: 'graded', conditional: false },
  { id: 'SDD-03', category: 'sdd_compliance', description: 'Assumptions documented', weight: 1, checkType: 'content_match', conditional: false },
  { id: 'SDD-04', category: 'sdd_compliance', description: 'CLAUDE.md has tech stack + commands', weight: 1, checkType: 'content_match', conditional: false },
  { id: 'SDD-05', category: 'sdd_compliance', description: 'Tickets reference spec sections', weight: 1, checkType: 'regex', conditional: false },
  // Coherence (4)
  { id: 'COH-01', category: 'coherence', description: 'Entity names consistent across specs', weight: 1, checkType: 'graded', conditional: false },
  { id: 'COH-02', category: 'coherence', description: 'Backend endpoints match QA targets', weight: 1, checkType: 'graded', conditional: false },
  { id: 'COH-03', category: 'coherence', description: 'DB tables match across specs', weight: 1, checkType: 'graded', conditional: false },
  { id: 'COH-04', category: 'coherence', description: 'Cross-file references resolve', weight: 1, checkType: 'graded', conditional: false },
  // Viewer (4, all conditional)
  { id: 'VWR-01', category: 'viewer', description: 'Not a markdown reader (mentions framework)', weight: 1, checkType: 'content_match', conditional: true },
  { id: 'VWR-02', category: 'viewer', description: 'Mentions viz framework (Recharts/D3)', weight: 1, checkType: 'content_match', conditional: true },
  { id: 'VWR-03', category: 'viewer', description: '5+ visualizations specified', weight: 1, checkType: 'graded', conditional: true },
  { id: 'VWR-04', category: 'viewer', description: 'Interactive components specified', weight: 1, checkType: 'content_match', conditional: true },
  // Technical Correctness (4)
  { id: 'TC-01', category: 'technical_correctness', description: 'Valid markdown tables in specs', weight: 1, checkType: 'regex', conditional: false },
  { id: 'TC-02', category: 'technical_correctness', description: 'No circular dependencies', weight: 1, checkType: 'graded', conditional: false },
  { id: 'TC-03', category: 'technical_correctness', description: 'Consistent forward-slash paths', weight: 1, checkType: 'regex', conditional: false },
  { id: 'TC-04', category: 'technical_correctness', description: 'Internal links use valid paths', weight: 1, checkType: 'graded', conditional: false },
]

// ── Check type labels ──

export const checkTypeLabels: Record<CheckType, string> = {
  file_exists: 'File Exists',
  directory_exists: 'Dir Exists',
  regex: 'Regex Match',
  content_match: 'Content Match',
  file_count: 'File Count',
  line_count: 'Line Count',
  graded: 'Graded (0-3)',
}

// ── Pipeline steps for FlowDiagram ──

export const pipelineSteps = [
  { id: 'quickstart', label: 'QUICKSTART (7 parts)', type: 'start' as const, status: 'complete' as const },
  { id: 'template', label: 'Template Fill', type: 'process' as const, status: 'complete' as const, description: 'Inject project requirements into prompt' },
  { id: 'parallel', label: 'Claude x3 / GPT x3', type: 'parallel' as const, status: 'active' as const, description: 'Both models run n=3 times each' },
  { id: 'score', label: 'Score Each Run', type: 'process' as const, status: 'complete' as const, description: '28 gates per run → scores.json' },
  { id: 'aggregate', label: 'Aggregate Stats', type: 'process' as const, status: 'complete' as const, description: 'Mean/stddev across runs' },
  { id: 'compare', label: 'Compare Models', type: 'end' as const, status: 'complete' as const, description: 'Side-by-side comparison.md' },
]

export const pipelineConnections = [
  { from: 'quickstart', to: 'template', label: 'concatenate' },
  { from: 'template', to: 'parallel', label: 'substitute' },
  { from: 'parallel', to: 'score', label: 'n=3 per model' },
  { from: 'score', to: 'aggregate' },
  { from: 'aggregate', to: 'compare' },
]

// ── Confounding variables ──

export const confoundingVariables = [
  { title: 'Model Capability', description: 'Inherent generation quality differences between Claude and GPT architectures' },
  { title: 'CLI Behavior', description: 'Claude reads filesystem natively; GPT via OpenCode --dir flag may differ' },
  { title: 'Context Window', description: 'How each model handles the ~2800-line QUICKSTART + requirements payload' },
  { title: 'Prompt Interpretation', description: 'Models may weight different parts of the same symmetric prompt differently' },
  { title: 'Tool Use Patterns', description: 'File-writing strategy (many small files vs fewer large files) varies by model' },
]

// ── Seed benchmark results (based on real QA scores: TaskFlow and MealMap) ──

function makeGateResults(
  overrides: Record<string, { status: GateStatus; score: number; maxScore: number; details: string }>
): Record<string, GateResult> {
  const results: Record<string, GateResult> = {}
  for (const gate of qualityGates) {
    results[gate.id] = overrides[gate.id] || { status: 'fail', score: 0, maxScore: gate.checkType === 'graded' ? 3 : 1, details: 'Not evaluated' }
  }
  return results
}

function makeCategoryResults(gates: Record<string, GateResult>): Record<string, CategoryResult> {
  const cats: Record<string, CategoryResult> = {}
  for (const cat of categories) {
    const catGates = qualityGates.filter(g => g.category === cat.id)
    let totalScore = 0
    let totalMax = 0
    let allSkipped = true
    for (const g of catGates) {
      const r = gates[g.id]
      if (r.status !== 'skipped') {
        allSkipped = false
        totalScore += r.score
        totalMax += r.maxScore
      }
    }
    const pct = totalMax > 0 ? totalScore / totalMax : 0
    cats[cat.id] = {
      score: totalScore,
      maxScore: totalMax,
      weight: cat.weight,
      weightedScore: pct * cat.weight,
      skipped: allSkipped,
    }
  }
  return cats
}

function makeOverall(cats: Record<string, CategoryResult>) {
  let rawScore = 0, maxPossible = 0, weightedScore = 0, activeWeight = 0
  for (const c of Object.values(cats)) {
    rawScore += c.score
    maxPossible += c.maxScore
    if (!c.skipped) {
      weightedScore += c.weightedScore
      activeWeight += c.weight
    }
  }
  const normalizedScore = activeWeight > 0 ? Math.round((weightedScore / activeWeight) * 100) : 0
  return { rawScore, maxPossible, weightedScore, activeWeight, normalizedScore }
}

// Claude seed data — modeled after a strong performer
const claudeRun1Gates = makeGateResults({
  'STR-01': { status: 'pass', score: 1, maxScore: 1, details: '10/10 spec files found' },
  'STR-02': { status: 'pass', score: 1, maxScore: 1, details: '4 sprint sections found' },
  'STR-03': { status: 'pass', score: 1, maxScore: 1, details: '9 subdirectories' },
  'STR-04': { status: 'pass', score: 1, maxScore: 1, details: 'prompts/ exists' },
  'STR-05': { status: 'pass', score: 1, maxScore: 1, details: 'CLAUDE.md exists' },
  'STR-06': { status: 'pass', score: 1, maxScore: 1, details: 'agents/ exists' },
  'SPC-01': { status: 'pass', score: 1, maxScore: 1, details: 'No placeholders found' },
  'SPC-02': { status: 'pass', score: 1, maxScore: 1, details: '18 entity references' },
  'SPC-03': { status: 'pass', score: 1, maxScore: 1, details: '42 concrete examples' },
  'SPC-04': { status: 'pass', score: 1, maxScore: 1, details: '15 cross-references' },
  'SPC-05': { status: 'graded', score: 3, maxScore: 3, details: 'Avg 412 lines (score: 3/3)' },
  'SDD-01': { status: 'pass', score: 1, maxScore: 1, details: '89 emoji matches' },
  'SDD-02': { status: 'graded', score: 3, maxScore: 3, details: 'DoD quality: 3/3' },
  'SDD-03': { status: 'pass', score: 1, maxScore: 1, details: '7 assumption mentions' },
  'SDD-04': { status: 'pass', score: 1, maxScore: 1, details: '5 tech stack refs' },
  'SDD-05': { status: 'pass', score: 1, maxScore: 1, details: '12 spec section refs' },
  'COH-01': { status: 'graded', score: 3, maxScore: 3, details: 'Entity consistency: 3/3' },
  'COH-02': { status: 'graded', score: 2, maxScore: 3, details: 'Endpoint overlap: 2/3' },
  'COH-03': { status: 'graded', score: 3, maxScore: 3, details: 'DB table overlap: 3/3' },
  'COH-04': { status: 'graded', score: 3, maxScore: 3, details: 'Cross-ref resolution: 3/3' },
  'VWR-01': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'VWR-02': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'VWR-03': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'VWR-04': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'TC-01': { status: 'pass', score: 1, maxScore: 1, details: '48 valid markdown tables' },
  'TC-02': { status: 'graded', score: 3, maxScore: 3, details: 'No circular deps' },
  'TC-03': { status: 'pass', score: 1, maxScore: 1, details: 'No backslash paths' },
  'TC-04': { status: 'graded', score: 3, maxScore: 3, details: 'Internal links: 3/3' },
})

const claudeRun2Gates = makeGateResults({
  ...Object.fromEntries(Object.entries(claudeRun1Gates).map(([k, v]) => [k, { ...v }])),
  'COH-02': { status: 'graded', score: 3, maxScore: 3, details: 'Endpoint overlap: 3/3' },
  'SPC-05': { status: 'graded', score: 3, maxScore: 3, details: 'Avg 385 lines (score: 3/3)' },
})

const claudeRun3Gates = makeGateResults({
  ...Object.fromEntries(Object.entries(claudeRun1Gates).map(([k, v]) => [k, { ...v }])),
  'COH-02': { status: 'graded', score: 2, maxScore: 3, details: 'Endpoint overlap: 2/3' },
  'TC-04': { status: 'graded', score: 2, maxScore: 3, details: 'Internal links: 2/3' },
})

// GPT seed data — slightly lower but competitive
const gptRun1Gates = makeGateResults({
  'STR-01': { status: 'pass', score: 1, maxScore: 1, details: '10/10 spec files found' },
  'STR-02': { status: 'pass', score: 1, maxScore: 1, details: '3 sprint sections found' },
  'STR-03': { status: 'pass', score: 1, maxScore: 1, details: '8 subdirectories' },
  'STR-04': { status: 'fail', score: 0, maxScore: 1, details: 'prompts/ not found' },
  'STR-05': { status: 'pass', score: 1, maxScore: 1, details: 'CLAUDE.md exists' },
  'STR-06': { status: 'pass', score: 1, maxScore: 1, details: 'agents/ exists' },
  'SPC-01': { status: 'pass', score: 1, maxScore: 1, details: 'No placeholders found' },
  'SPC-02': { status: 'pass', score: 1, maxScore: 1, details: '14 entity references' },
  'SPC-03': { status: 'pass', score: 1, maxScore: 1, details: '31 concrete examples' },
  'SPC-04': { status: 'fail', score: 0, maxScore: 1, details: 'No cross-references' },
  'SPC-05': { status: 'graded', score: 2, maxScore: 3, details: 'Avg 178 lines (score: 2/3)' },
  'SDD-01': { status: 'pass', score: 1, maxScore: 1, details: '54 emoji matches' },
  'SDD-02': { status: 'graded', score: 2, maxScore: 3, details: 'DoD quality: 2/3' },
  'SDD-03': { status: 'pass', score: 1, maxScore: 1, details: '4 assumption mentions' },
  'SDD-04': { status: 'pass', score: 1, maxScore: 1, details: '3 tech stack refs' },
  'SDD-05': { status: 'fail', score: 0, maxScore: 1, details: 'No spec section refs in tickets' },
  'COH-01': { status: 'graded', score: 2, maxScore: 3, details: 'Entity consistency: 2/3' },
  'COH-02': { status: 'graded', score: 1, maxScore: 3, details: 'Endpoint overlap: 1/3' },
  'COH-03': { status: 'graded', score: 2, maxScore: 3, details: 'DB table overlap: 2/3' },
  'COH-04': { status: 'graded', score: 1, maxScore: 3, details: 'Cross-ref resolution: 1/3' },
  'VWR-01': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'VWR-02': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'VWR-03': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'VWR-04': { status: 'skipped', score: 0, maxScore: 0, details: 'No viewer/ directory' },
  'TC-01': { status: 'pass', score: 1, maxScore: 1, details: '35 valid markdown tables' },
  'TC-02': { status: 'graded', score: 3, maxScore: 3, details: 'No circular deps' },
  'TC-03': { status: 'pass', score: 1, maxScore: 1, details: 'No backslash paths' },
  'TC-04': { status: 'graded', score: 2, maxScore: 3, details: 'Internal links: 2/3' },
})

const gptRun2Gates = makeGateResults({
  ...Object.fromEntries(Object.entries(gptRun1Gates).map(([k, v]) => [k, { ...v }])),
  'STR-04': { status: 'pass', score: 1, maxScore: 1, details: 'prompts/ exists' },
  'SPC-04': { status: 'pass', score: 1, maxScore: 1, details: '8 cross-references' },
  'COH-02': { status: 'graded', score: 2, maxScore: 3, details: 'Endpoint overlap: 2/3' },
})

const gptRun3Gates = makeGateResults({
  ...Object.fromEntries(Object.entries(gptRun1Gates).map(([k, v]) => [k, { ...v }])),
  'SPC-05': { status: 'graded', score: 3, maxScore: 3, details: 'Avg 302 lines (score: 3/3)' },
  'COH-04': { status: 'graded', score: 2, maxScore: 3, details: 'Cross-ref resolution: 2/3' },
})

function buildRun(runNumber: number, gates: Record<string, GateResult>, ts: string): RunResult {
  const cats = makeCategoryResults(gates)
  return { runNumber, timestamp: ts, gates, categories: cats, overall: makeOverall(cats) }
}

function buildAggregate(runs: RunResult[]) {
  const n = runs.length
  const gateIds = Object.keys(runs[0].gates)
  const catIds = Object.keys(runs[0].categories)

  const gates: Record<string, AggregateGateResult> = {}
  for (const gid of gateIds) {
    const scores = runs.map(r => r.gates[gid].score)
    const mean = scores.reduce((a, b) => a + b, 0) / n
    gates[gid] = {
      mean: Math.round(mean * 100) / 100,
      min: Math.min(...scores),
      max: Math.max(...scores),
      stddev: Math.round(Math.sqrt(scores.reduce((s, v) => s + (v - mean) ** 2, 0) / n) * 100) / 100,
      maxScore: runs[0].gates[gid].maxScore,
    }
  }

  const catAgg: Record<string, AggregateCategoryResult> = {}
  for (const cid of catIds) {
    const ws = runs.map(r => r.categories[cid].weightedScore)
    const mean = ws.reduce((a, b) => a + b, 0) / n
    catAgg[cid] = {
      meanWeightedScore: Math.round(mean * 100) / 100,
      min: Math.round(Math.min(...ws) * 100) / 100,
      max: Math.round(Math.max(...ws) * 100) / 100,
      stddev: Math.round(Math.sqrt(ws.reduce((s, v) => s + (v - mean) ** 2, 0) / n) * 100) / 100,
    }
  }

  const overalls = runs.map(r => r.overall.normalizedScore)
  const overallMean = overalls.reduce((a, b) => a + b, 0) / n
  return {
    runCount: n,
    gates,
    categories: catAgg,
    overall: {
      mean: Math.round(overallMean * 10) / 10,
      min: Math.min(...overalls),
      max: Math.max(...overalls),
      stddev: Math.round(Math.sqrt(overalls.reduce((s, v) => s + (v - overallMean) ** 2, 0) / n) * 10) / 10,
    },
  }
}

// Build model benchmarks
const claudeRuns = [
  buildRun(1, claudeRun1Gates, '2026-03-15T10:00:00Z'),
  buildRun(2, claudeRun2Gates, '2026-03-15T10:15:00Z'),
  buildRun(3, claudeRun3Gates, '2026-03-15T10:30:00Z'),
]

const gptRuns = [
  buildRun(1, gptRun1Gates, '2026-03-15T11:00:00Z'),
  buildRun(2, gptRun2Gates, '2026-03-15T11:15:00Z'),
  buildRun(3, gptRun3Gates, '2026-03-15T11:30:00Z'),
]

export const claudeBenchmark: ModelBenchmark = {
  model: 'claude-sonnet-4-20250514',
  displayName: 'Claude Sonnet',
  color: '#698472',
  runs: claudeRuns,
  aggregate: buildAggregate(claudeRuns),
}

export const gptBenchmark: ModelBenchmark = {
  model: 'gpt-4o',
  displayName: 'GPT-4o',
  color: '#8e6a59',
  runs: gptRuns,
  aggregate: buildAggregate(gptRuns),
}

export const models: ModelBenchmark[] = [claudeBenchmark, gptBenchmark]

export const benchmarkConfig: BenchmarkConfig = {
  targetProject: 'TaskFlow',
  runsPerModel: 3,
  timestamp: '2026-03-15',
}
