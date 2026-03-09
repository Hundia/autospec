# Sprint 3 Agent Briefing — Viewer Advanced Pages

**Agent:** Sonnet 4.6
**Sprint:** 3 of 5
**Depends on:** Sprint 1 complete ✅
**Working directory:** `/opt/FitnessAiManager/autospec`
**Parallel with:** Sprint 2 (different pages) + Sprint 4 (different files)

---

## Your Mission

Replace Sprint 1 stub pages for SkillsPage and EnvironmentsPage with full implementations. Create chart components and environments data. You are NOT touching DocsPage, SpecsPage, or BacklogPage (those are Sprint 2's territory).

---

## Tickets

| ID | Task | What to build |
|----|------|---------------|
| 3.1 | SkillsPage | Full `/skills/:slug` page — 10 skill cards + detail view |
| 3.2 | EnvironmentsPage | Full `/environments` page — 6×10 compatibility matrix |
| 3.3 | Chart components | Reusable AnimatedCounter + ProgressRing in `viewer/src/components/charts/` |
| 3.4 | environments.json | Data file for the 6×10 matrix |
| 3.5 | Docs | `docs/viewer/05_advanced_pages.md` |

---

## RULES (same as Sprint 1)

- **NO shadcn/ui**, NO @radix-ui
- **NO RTL CSS**, NO Hebrew text
- **NO dark slate** colors
- Import primitives from `../components/primitives`
- Tailwind warm palette only

---

## Viewer Scaffold (already exists from Sprint 1)

```
viewer/src/
├── components/primitives/   ← Button, Card, Badge, Input, index.ts
├── components/layout/       ← Sidebar, Header, Layout
├── pages/SkillsPage.tsx     ← STUB — replace this
├── pages/EnvironmentsPage.tsx ← STUB — replace this
└── tailwind.config.js       ← warm palette tokens
```

---

## Task 3.4 — Data File (do this FIRST)

Create `viewer/src/data/environments.ts`:

```typescript
export type CompatibilityLevel = 'full' | 'partial' | 'none'

export interface EnvironmentTool {
  id: string
  name: string
  shortName: string
  color: string
}

export interface Skill {
  id: string
  name: string
  description: string
}

export const tools: EnvironmentTool[] = [
  { id: 'claude-code', name: 'Claude Code', shortName: 'Claude', color: '#698472' },
  { id: 'cursor', name: 'Cursor', shortName: 'Cursor', color: '#8e6a59' },
  { id: 'copilot', name: 'GitHub Copilot', shortName: 'Copilot', color: '#536a5b' },
  { id: 'windsurf', name: 'Windsurf', shortName: 'Windsurf', color: '#b08a79' },
  { id: 'jetbrains', name: 'JetBrains AI', shortName: 'JetBrains', color: '#a08c72' },
  { id: 'aider', name: 'Aider', shortName: 'Aider', color: '#857358' },
]

export const skills: Skill[] = [
  { id: 'sprint-run', name: 'sprint-run', description: 'Execute full sprint end-to-end' },
  { id: 'execute-ticket', name: 'execute-ticket', description: 'Execute single ticket' },
  { id: 'plan-sprint', name: 'plan-sprint', description: 'Plan sprint from backlog' },
  { id: 'sprint-status', name: 'sprint-status', description: 'Show sprint progress' },
  { id: 'sprint-close', name: 'sprint-close', description: 'Close sprint and summarize' },
  { id: 'update-backlog', name: 'update-backlog', description: 'Update ticket statuses' },
  { id: 'create-spec', name: 'create-spec', description: 'Generate spec from SRS' },
  { id: 'create-sprint-docs', name: 'create-sprint-docs', description: 'Create sprint docs' },
  { id: 'qa-review', name: 'qa-review', description: 'QA verification protocol' },
  { id: 'help', name: 'help', description: 'List all available commands' },
]

// 6 tools × 10 skills compatibility matrix
export const compatibilityMatrix: Record<string, Record<string, CompatibilityLevel>> = {
  'claude-code': {
    'sprint-run': 'full', 'execute-ticket': 'full', 'plan-sprint': 'full',
    'sprint-status': 'full', 'sprint-close': 'full', 'update-backlog': 'full',
    'create-spec': 'full', 'create-sprint-docs': 'full', 'qa-review': 'full', 'help': 'full',
  },
  'cursor': {
    'sprint-run': 'partial', 'execute-ticket': 'full', 'plan-sprint': 'partial',
    'sprint-status': 'partial', 'sprint-close': 'partial', 'update-backlog': 'full',
    'create-spec': 'partial', 'create-sprint-docs': 'partial', 'qa-review': 'partial', 'help': 'none',
  },
  'copilot': {
    'sprint-run': 'none', 'execute-ticket': 'partial', 'plan-sprint': 'none',
    'sprint-status': 'none', 'sprint-close': 'none', 'update-backlog': 'partial',
    'create-spec': 'none', 'create-sprint-docs': 'none', 'qa-review': 'partial', 'help': 'none',
  },
  'windsurf': {
    'sprint-run': 'partial', 'execute-ticket': 'full', 'plan-sprint': 'partial',
    'sprint-status': 'partial', 'sprint-close': 'partial', 'update-backlog': 'full',
    'create-spec': 'partial', 'create-sprint-docs': 'partial', 'qa-review': 'partial', 'help': 'partial',
  },
  'jetbrains': {
    'sprint-run': 'none', 'execute-ticket': 'partial', 'plan-sprint': 'none',
    'sprint-status': 'none', 'sprint-close': 'none', 'update-backlog': 'partial',
    'create-spec': 'partial', 'create-sprint-docs': 'none', 'qa-review': 'partial', 'help': 'none',
  },
  'aider': {
    'sprint-run': 'partial', 'execute-ticket': 'full', 'plan-sprint': 'partial',
    'sprint-status': 'none', 'sprint-close': 'partial', 'update-backlog': 'full',
    'create-spec': 'none', 'create-sprint-docs': 'partial', 'qa-review': 'partial', 'help': 'none',
  },
}
```

---

## Task 3.3 — Chart Components

Create `viewer/src/components/charts/`:

### `viewer/src/components/charts/AnimatedCounter.tsx`
```tsx
import React, { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value, label, prefix = '', suffix = '', duration = 1000,
}) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const steps = 30
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-charcoal">
        {prefix}{current}{suffix}
      </div>
      <div className="text-xs text-sand-600 mt-1">{label}</div>
    </div>
  )
}
```

### `viewer/src/components/charts/ProgressRing.tsx`
```tsx
import React from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value, max, size = 80, strokeWidth = 6, color = '#698472', label,
}) => {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const progress = max > 0 ? (value / max) * circumference : 0
  const dashoffset = circumference - progress

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth} stroke="#e8e4d8" fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth} stroke={color} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {label && <div className="text-xs text-sand-600 text-center">{label}</div>}
    </div>
  )
}
```

### `viewer/src/components/charts/index.ts`
```typescript
export { AnimatedCounter } from './AnimatedCounter'
export { ProgressRing } from './ProgressRing'
```

---

## Task 3.1 — SkillsPage (full implementation)

Replace `viewer/src/pages/SkillsPage.tsx`.

First, read the skills files to know their content. The 10 skill files are at:
`/opt/FitnessAiManager/autospec/skills/claude/*.md`

Files: create-spec.md, create-sprint-docs.md, execute-ticket.md, help.md, plan-sprint.md, qa-review.md, sprint-close.md, sprint-run.md, sprint-status.md, update-backlog.md

```tsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Zap, ArrowLeft } from 'lucide-react'

interface SkillInfo {
  id: string
  name: string
  description: string
  usage: string
  phases: string[]
  model: 'haiku' | 'sonnet' | 'opus'
}

const skillsData: SkillInfo[] = [
  {
    id: 'sprint-run',
    name: 'sprint-run',
    description: 'Execute an entire sprint end-to-end: plan → implement → QA → docs → close.',
    usage: '/sprint-run [sprint_number]',
    phases: ['Sprint Briefing', 'Ticket Execution', 'QA Verification', 'Documentation Update', 'Sprint Close', 'Final Report'],
    model: 'opus',
  },
  {
    id: 'execute-ticket',
    name: 'execute-ticket',
    description: 'Execute a single ticket from the backlog following SDD methodology.',
    usage: '/execute-ticket [ticket_number]',
    phases: ['Read backlog', 'Check dependencies', 'Read docs', 'Update status', 'Implement', 'QA', 'Docs'],
    model: 'sonnet',
  },
  {
    id: 'plan-sprint',
    name: 'plan-sprint',
    description: 'Plan a sprint from backlog tickets using multi-expert AI analysis.',
    usage: '/plan-sprint [sprint_number]',
    phases: ['Analyze tickets', 'Expert consultation', 'Risk assessment', 'Generate plan'],
    model: 'opus',
  },
  {
    id: 'sprint-status',
    name: 'sprint-status',
    description: 'Show current sprint progress with ticket statuses and burndown.',
    usage: '/sprint-status [sprint_number]',
    phases: ['Read backlog', 'Compute metrics', 'Format report'],
    model: 'haiku',
  },
  {
    id: 'sprint-close',
    name: 'sprint-close',
    description: 'Close a sprint: verify all tickets done, generate summary, tag release.',
    usage: '/sprint-close [sprint_number]',
    phases: ['Verify completeness', 'Generate summary', 'Create git tag', 'Update backlog'],
    model: 'sonnet',
  },
  {
    id: 'update-backlog',
    name: 'update-backlog',
    description: 'Update ticket statuses in the backlog.',
    usage: '/update-backlog [ticket_id] [status]',
    phases: ['Find ticket', 'Validate status', 'Update file'],
    model: 'haiku',
  },
  {
    id: 'create-spec',
    name: 'create-spec',
    description: 'Generate a spec file from an SRS or requirements document.',
    usage: '/create-spec [role]',
    phases: ['Parse requirements', 'Select role template', 'Generate spec', 'Write file'],
    model: 'sonnet',
  },
  {
    id: 'create-sprint-docs',
    name: 'create-sprint-docs',
    description: 'Create sprint documentation from backlog tickets.',
    usage: '/create-sprint-docs [sprint_number]',
    phases: ['Read sprint tickets', 'Generate brief', 'Write summary template'],
    model: 'haiku',
  },
  {
    id: 'qa-review',
    name: 'qa-review',
    description: 'Run QA verification protocol for a ticket or sprint.',
    usage: '/qa-review [ticket_id]',
    phases: ['Identify change type', 'Run tests', 'Verify user flow', 'Report results'],
    model: 'sonnet',
  },
  {
    id: 'help',
    name: 'help',
    description: 'List all available AutoSpec commands with descriptions.',
    usage: '/help',
    phases: ['Read commands', 'Format list'],
    model: 'haiku',
  },
]

const modelColor: Record<string, 'haiku' | 'sonnet' | 'opus'> = {}
skillsData.forEach(s => { modelColor[s.id] = s.model })

export const SkillsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const selectedSkill = slug ? skillsData.find(s => s.id === slug) : null

  if (selectedSkill) {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => navigate('/skills/sprint-run')}
          className="flex items-center gap-2 text-sm text-sage hover:text-sage-600 mb-4"
        >
          <ArrowLeft size={14} />
          All Skills
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-cream" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-charcoal font-mono">/{selectedSkill.name}</h2>
            <p className="text-sm text-sand-600">{selectedSkill.description}</p>
          </div>
          <Badge variant={selectedSkill.model} className="ml-auto">{selectedSkill.model}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card variant="outlined">
            <CardHeader><CardTitle>Usage</CardTitle></CardHeader>
            <CardContent>
              <code className="font-mono text-sm text-sage-700 bg-sand-200 px-3 py-2 rounded block">
                {selectedSkill.usage}
              </code>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader><CardTitle>Model</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={selectedSkill.model} size="lg">{selectedSkill.model}</Badge>
                <span className="text-sm text-sand-600">
                  {selectedSkill.model === 'opus' ? 'High complexity orchestration'
                    : selectedSkill.model === 'sonnet' ? 'Balanced speed + quality'
                    : 'Fast, low-cost operations'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader><CardTitle>Execution Phases</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {selectedSkill.phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sage text-cream text-xs flex items-center justify-center font-medium flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-sm text-charcoal">{phase}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Grid view
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-charcoal">Skills</h2>
        <p className="text-sm text-sand-600 mt-1">10 Claude Code commands for Spec-Driven Development</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {skillsData.map(skill => (
          <Card
            key={skill.id}
            variant="outlined"
            hoverable
            clickable
            onClick={() => navigate(`/skills/${skill.id}`)}
          >
            <CardContent>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={14} className="text-sage flex-shrink-0" />
                    <code className="text-sm font-mono font-semibold text-charcoal">/{skill.name}</code>
                  </div>
                  <p className="text-xs text-sand-600 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {skill.phases.slice(0, 3).map((phase, i) => (
                      <span key={i} className="text-xs bg-sand-200 text-sand-700 px-2 py-0.5 rounded">
                        {phase}
                      </span>
                    ))}
                    {skill.phases.length > 3 && (
                      <span className="text-xs text-sand-500">+{skill.phases.length - 3}</span>
                    )}
                  </div>
                </div>
                <Badge variant={skill.model} size="sm">{skill.model}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 3.2 — EnvironmentsPage (full implementation)

Replace `viewer/src/pages/EnvironmentsPage.tsx`:

```tsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/primitives/Card'
import { tools, skills, compatibilityMatrix, type CompatibilityLevel } from '../data/environments'

function CompatibilityCell({ level }: { level: CompatibilityLevel }) {
  if (level === 'full') return <span className="text-sage text-base" title="Full support">✅</span>
  if (level === 'partial') return <span className="text-amber-500 text-base" title="Partial support">⚠️</span>
  return <span className="text-sand-400 text-base" title="Not supported">❌</span>
}

export const EnvironmentsPage: React.FC = () => {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-charcoal">Environments</h2>
        <p className="text-sm text-sand-600 mt-1">Compatibility matrix — 6 AI tools × 10 AutoSpec skills</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2 text-sm text-charcoal">
          <span>✅</span> Full support
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal">
          <span>⚠️</span> Partial support
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal">
          <span>❌</span> Not supported
        </div>
      </div>

      {/* Matrix */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal border-r border-sand w-32">
                  Tool / Skill
                </th>
                {skills.map(skill => (
                  <th key={skill.id} className="px-3 py-3 text-xs font-medium text-charcoal text-center min-w-20">
                    <div className="font-mono">{skill.name.replace('-', '\u200b-')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tools.map((tool, toolIdx) => (
                <tr key={tool.id} className={toolIdx % 2 === 0 ? 'bg-cream' : 'bg-parchment'}>
                  <td className="px-4 py-3 border-r border-sand">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tool.color }}
                      />
                      <div>
                        <div className="text-sm font-medium text-charcoal">{tool.shortName}</div>
                        <div className="text-xs text-sand-500">{tool.name}</div>
                      </div>
                    </div>
                  </td>
                  {skills.map(skill => (
                    <td key={skill.id} className="px-3 py-3 text-center">
                      <CompatibilityCell
                        level={compatibilityMatrix[tool.id]?.[skill.id] || 'none'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tool Details */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {tools.map(tool => {
          const fullCount = skills.filter(s => compatibilityMatrix[tool.id]?.[s.id] === 'full').length
          const partialCount = skills.filter(s => compatibilityMatrix[tool.id]?.[s.id] === 'partial').length
          return (
            <Card key={tool.id} variant="outlined">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tool.color }} />
                  <span className="text-sm font-medium text-charcoal">{tool.name}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-sage font-bold">{fullCount}</span>
                    <span className="text-sand-600 ml-1">full</span>
                  </div>
                  <div>
                    <span className="text-amber-500 font-bold">{partialCount}</span>
                    <span className="text-sand-600 ml-1">partial</span>
                  </div>
                  <div>
                    <span className="text-sand-400 font-bold">{skills.length - fullCount - partialCount}</span>
                    <span className="text-sand-600 ml-1">none</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Task 3.5 — Documentation

Create `docs/viewer/05_advanced_pages.md`:

```markdown
---
title: "Viewer Advanced Pages"
sprint: "3.1, 3.2, 3.3"
created: "2026-03-09"
---

# Viewer Advanced Pages

## SkillsPage `/skills/:slug`

**Sprint 3.1** | Frontend

Displays all 10 AutoSpec Claude Code skills with detail view.

### Features
- 2-column grid of skill cards
- Model badge (haiku/sonnet/opus) per skill
- Click → detail view with phases, usage, model rationale
- Navigate back to grid

### Data Source
Inline `skillsData` array in SkillsPage.tsx (static, no file reads needed)

### Skills listed
sprint-run, execute-ticket, plan-sprint, sprint-status, sprint-close,
update-backlog, create-spec, create-sprint-docs, qa-review, help

---

## EnvironmentsPage `/environments`

**Sprint 3.2** | Frontend

6×10 compatibility matrix showing which AI tools support which skills.

### Features
- Full matrix table (6 tools × 10 skills)
- ✅/⚠️/❌ compatibility indicators
- Per-tool summary cards with counts
- Color-coded tool indicators

### Data Source
`viewer/src/data/environments.ts` → `compatibilityMatrix`

### Tools covered
Claude Code, Cursor, GitHub Copilot, Windsurf, JetBrains AI, Aider

---

## Chart Components

**Sprint 3.3** | UI | `viewer/src/components/charts/`

### AnimatedCounter
Count-up animation from 0 to value over configurable duration.
Props: `value`, `label`, `prefix?`, `suffix?`, `duration?`

### ProgressRing
SVG circular progress indicator.
Props: `value`, `max`, `size?`, `strokeWidth?`, `color?`, `label?`
```

---

## Build & Verify

```bash
cd /opt/FitnessAiManager/autospec/viewer
npm run build
```

**Expected:** Zero TypeScript errors.

**Check:**
```bash
grep -r "shadcn\|@radix-ui\|font-hebrew" viewer/src/pages/SkillsPage.tsx viewer/src/pages/EnvironmentsPage.tsx || echo "CLEAN"
ls viewer/src/components/charts/
ls viewer/src/data/environments.ts
```

---

## Final Steps

1. Update `specs/backlog.md` — Sprint 3 tickets (3.1–3.5) → ✅ Done, Sprint 3 status → ✅ Done
2. Create `sprints/sprint-3/summary.md`
3. Return: build exit code, file list, any TS errors and fixes
