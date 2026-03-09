# Sprint 2 Agent Briefing — Viewer Content Pages

**Agent:** Sonnet 4.6
**Sprint:** 2 of 5
**Depends on:** Sprint 1 complete ✅
**Working directory:** `/opt/FitnessAiManager/autospec`
**Parallel with:** Sprint 3 (different pages) + Sprint 4 (different files entirely)

---

## Your Mission

Replace Sprint 1 stub pages with full implementations for DocsPage, SpecsPage, and BacklogPage. Create the data layer that powers them. You are working in an isolated worktree — do NOT touch SkillsPage or EnvironmentsPage (Sprint 3's territory).

---

## Tickets

| ID | Task | What to build |
|----|------|---------------|
| 2.1 | DocsPage | Full `/docs/:section/:slug` page with sidebar nav + markdown rendering |
| 2.2 | SpecsPage | Full `/specs/:slug` page with 10-card grid + markdown view |
| 2.3 | BacklogPage | Full `/backlog` page with kanban board |
| 2.4 | Static data layer | `viewer/src/data/` structure + md imports |
| 2.5 | Docs | `docs/viewer/04_pages.md` (docs + specs + backlog sections) |

---

## RULES (same as Sprint 1 — enforce strictly)

- **NO shadcn/ui**, NO @radix-ui
- **NO RTL CSS**, NO Hebrew text
- **NO dark slate** colors
- Import primitives from `../components/primitives` (Button, Card, Badge, Input)
- Import layout from `../components/layout`
- Tailwind warm palette only (parchment/sage/terracotta/sand)

---

## Viewer Scaffold (already exists from Sprint 1)

```
viewer/
├── src/
│   ├── components/primitives/   ← Button, Card, Badge, Input, index.ts
│   ├── components/layout/       ← Sidebar, Header, Layout
│   ├── pages/                   ← STUB: DocsPage, SpecsPage, BacklogPage (replace these)
│   │                               KEEP: DashboardPage, DesignSystemPage, SkillsPage, EnvironmentsPage
│   └── App.tsx                  ← already has all 7 routes
├── tailwind.config.js           ← warm palette tokens
└── package.json                 ← recharts, react-markdown, remark-gfm, fuse.js all installed
```

---

## Task 2.4 — Data Layer (do this FIRST, pages depend on it)

Create `viewer/src/data/`:

### `viewer/src/data/docs.ts`
```typescript
// Static doc manifests — maps sections to files
// Pages will import markdown using ?raw (Vite raw import)

export interface DocEntry {
  slug: string
  title: string
  section: string
}

export const docsManifest: DocEntry[] = [
  // Methodology
  { slug: '01_philosophy', title: 'Philosophy', section: 'methodology' },
  { slug: '02_spec_structure', title: 'Spec Structure', section: 'methodology' },
  { slug: '03_team_roles', title: 'Team Roles', section: 'methodology' },
  { slug: '04_backlog_management', title: 'Backlog Management', section: 'methodology' },
  { slug: '05_multi_agent', title: 'Multi-Agent', section: 'methodology' },
  { slug: '06_qa_methodology', title: 'QA Methodology', section: 'methodology' },
  { slug: '07_model_selection', title: 'Model Selection', section: 'methodology' },
  { slug: '08_test_validation_results', title: 'Test Validation', section: 'methodology' },
  { slug: '09_ground_truth_schema', title: 'Ground Truth Schema', section: 'methodology' },
  { slug: '10_orchestrator_agent_pattern', title: 'Orchestrator Pattern', section: 'methodology' },
  // Viewer
  { slug: '01_architecture', title: 'Architecture', section: 'viewer' },
  { slug: '02_design_system', title: 'Design System', section: 'viewer' },
]

export const sections = ['methodology', 'viewer'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  methodology: 'Methodology',
  viewer: 'Viewer',
}
```

### `viewer/src/data/specs.ts`
```typescript
export interface SpecEntry {
  slug: string
  number: string
  title: string
  owner: string
  description: string
}

export const specsManifest: SpecEntry[] = [
  { slug: '01_product_manager', number: '01', title: 'Product Manager', owner: 'PM', description: 'Vision, personas, MoSCoW, user stories' },
  { slug: '02_backend_lead', number: '02', title: 'Backend Lead', owner: 'Backend', description: 'CLI architecture, generators, parsers, tsup' },
  { slug: '03_frontend_lead', number: '03', title: 'Frontend Lead', owner: 'Frontend', description: 'Viewer architecture, React 18, Vite, Tailwind, 7 pages' },
  { slug: '04_db_architect', number: '04', title: 'Database Architect', owner: 'DB', description: 'File-based DB, backlog.json schema, environments.json' },
  { slug: '05_qa_lead', number: '05', title: 'QA Lead', owner: 'QA', description: 'Vitest 80% coverage, Playwright TC-01→TC-08' },
  { slug: '06_devops_lead', number: '06', title: 'DevOps Lead', owner: 'DevOps', description: 'NPM publish, GitHub Actions CI/release/pages' },
  { slug: '07_marketing_lead', number: '07', title: 'Marketing Lead', owner: 'Marketing', description: 'OSS positioning, Product Hunt, Show HN' },
  { slug: '08_finance_lead', number: '08', title: 'Finance Lead', owner: 'Finance', description: 'Free/MIT, GitHub free tier, sponsorship' },
  { slug: '09_business_lead', number: '09', title: 'Business Lead', owner: 'Business', description: 'Market analysis, differentiators vs Cursor/Copilot' },
  { slug: '10_ui_designer', number: '10', title: 'UI Designer', owner: 'Design', description: 'Warm palette, 7 pages wireframed, component inventory' },
]
```

### `viewer/src/data/backlog.ts`
```typescript
export type TicketStatus = 'todo' | 'in-progress' | 'qa' | 'done' | 'blocked'

export interface Ticket {
  id: string
  title: string
  owner: string
  points: number
  status: TicketStatus
  dependencies: string[]
}

export interface Sprint {
  number: string
  name: string
  theme: string
  status: TicketStatus
  totalPoints: number
  tickets: Ticket[]
}

export const backlogData: Sprint[] = [
  {
    number: '0',
    name: 'Sprint 0',
    theme: 'SDD Foundation',
    status: 'done',
    totalPoints: 38,
    tickets: [
      { id: '0.1', title: 'Copy 10 skills → .claude/commands/', owner: 'DevOps', points: 2, status: 'done', dependencies: [] },
      { id: '0.2', title: 'Create autospec/CLAUDE.md', owner: 'PM', points: 5, status: 'done', dependencies: [] },
      { id: '0.3', title: 'Create specs/ — 10 role spec files', owner: 'PM', points: 13, status: 'done', dependencies: [] },
      { id: '0.4', title: 'Create specs/backlog.md', owner: 'PM', points: 8, status: 'done', dependencies: ['0.3'] },
      { id: '0.5', title: 'Update sprint-run.md + execute-ticket.md', owner: 'PM', points: 3, status: 'done', dependencies: [] },
      { id: '0.6', title: 'Create agents/sprint-1–5-brief.md', owner: 'PM', points: 5, status: 'done', dependencies: ['0.4'] },
      { id: '0.7', title: 'Create docs/methodology/10_orchestrator_agent_pattern.md', owner: 'Docs', points: 3, status: 'done', dependencies: [] },
      { id: '0.8', title: 'Create sprints/sprint-0/summary.md', owner: 'PM', points: 2, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '1',
    name: 'Sprint 1',
    theme: 'Viewer Scaffold',
    status: 'done',
    totalPoints: 33,
    tickets: [
      { id: '1.1', title: 'Viewer scaffold', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '1.2', title: 'FitnessAiManager design tokens', owner: 'UI', points: 3, status: 'done', dependencies: ['1.1'] },
      { id: '1.3', title: 'Port primitives', owner: 'UI', points: 8, status: 'done', dependencies: ['1.2'] },
      { id: '1.4', title: 'Layout + routing', owner: 'Frontend', points: 5, status: 'done', dependencies: ['1.3'] },
      { id: '1.5', title: 'DashboardPage', owner: 'Frontend', points: 8, status: 'done', dependencies: ['1.4'] },
      { id: '1.6', title: 'DesignSystemPage', owner: 'UI', points: 5, status: 'done', dependencies: ['1.3'] },
      { id: '1.7', title: 'docs/viewer/01+02', owner: 'Docs', points: 3, status: 'done', dependencies: ['1.4'] },
    ],
  },
  {
    number: '2',
    name: 'Sprint 2',
    theme: 'Content Pages',
    status: 'in-progress',
    totalPoints: 32,
    tickets: [
      { id: '2.1', title: 'DocsPage', owner: 'Frontend', points: 13, status: 'in-progress', dependencies: [] },
      { id: '2.2', title: 'SpecsPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '2.3', title: 'BacklogPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '2.4', title: 'Static data layer', owner: 'Frontend', points: 5, status: 'todo', dependencies: [] },
      { id: '2.5', title: 'docs/viewer/04_pages.md', owner: 'Docs', points: 3, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '3',
    name: 'Sprint 3',
    theme: 'Advanced Pages',
    status: 'todo',
    totalPoints: 32,
    tickets: [
      { id: '3.1', title: 'SkillsPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '3.2', title: 'EnvironmentsPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '3.3', title: 'Chart components', owner: 'UI', points: 8, status: 'todo', dependencies: [] },
      { id: '3.4', title: 'environments.json', owner: 'Frontend', points: 5, status: 'todo', dependencies: [] },
      { id: '3.5', title: 'docs update', owner: 'Docs', points: 3, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '4',
    name: 'Sprint 4',
    theme: 'CLI + QUICKSTART',
    status: 'todo',
    totalPoints: 26,
    tickets: [
      { id: '4.1', title: 'viewer-prompt.generator.ts warm palette', owner: 'Backend', points: 8, status: 'todo', dependencies: [] },
      { id: '4.2', title: 'Skills templates orchestrator pattern', owner: 'Backend', points: 5, status: 'todo', dependencies: [] },
      { id: '4.3', title: 'QUICKSTART.md Section 7 rewrite', owner: 'Docs', points: 8, status: 'todo', dependencies: [] },
      { id: '4.4', title: 'docs/cli/viewer_generator.md', owner: 'Docs', points: 5, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '5',
    name: 'Sprint 5',
    theme: 'Polish + Launch',
    status: 'todo',
    totalPoints: 26,
    tickets: [
      { id: '5.1', title: 'viewer/src/data/docs/ copy', owner: 'Frontend', points: 5, status: 'todo', dependencies: [] },
      { id: '5.2', title: 'GitHub Actions ci.yml + pages.yml', owner: 'DevOps', points: 8, status: 'todo', dependencies: [] },
      { id: '5.3', title: 'npm publish --dry-run', owner: 'DevOps', points: 5, status: 'todo', dependencies: [] },
      { id: '5.4', title: 'docs/deployment/github_pages.md', owner: 'Docs', points: 3, status: 'todo', dependencies: [] },
      { id: '5.5', title: 'Sprint 5 summary + cleanup', owner: 'PM', points: 5, status: 'todo', dependencies: [] },
    ],
  },
]
```

---

## Task 2.1 — DocsPage (full implementation)

Replace `viewer/src/pages/DocsPage.tsx`:

```tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Input } from '../components/primitives/Input'
import { Search, ChevronRight } from 'lucide-react'
import { docsManifest, sectionLabels, type DocSection } from '../data/docs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Lazy-load doc content from autospec docs directory
// In a real deployment these would be bundled. For now we use fetch or inline.
// We'll use a simple inline approach with a content map.
async function loadDocContent(section: string, slug: string): Promise<string> {
  try {
    // Try to fetch from public/ directory (we'll copy docs there at build time)
    const res = await fetch(`./docs/${section}/${slug}.md`)
    if (res.ok) return res.text()
  } catch {}
  return `# ${slug}\n\n*Content not available in this build.*\n\nThis doc is stored at \`docs/${section}/${slug}.md\` in the AutoSpec repository.`
}

export const DocsPage: React.FC = () => {
  const { section = 'methodology', slug = '01_philosophy' } = useParams<{ section: string; slug: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    loadDocContent(section, slug).then(c => {
      setContent(c)
      setLoading(false)
    })
  }, [section, slug])

  const filteredDocs = docsManifest.filter(d =>
    search === '' ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.slug.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = (Object.keys(sectionLabels) as DocSection[]).reduce(
    (acc, sec) => ({
      ...acc,
      [sec]: filteredDocs.filter(d => d.section === sec),
    }),
    {} as Record<DocSection, typeof filteredDocs>
  )

  const currentDoc = docsManifest.find(d => d.section === section && d.slug === slug)

  return (
    <div className="flex gap-6 h-full max-w-6xl">
      {/* Sidebar nav */}
      <aside className="w-56 flex-shrink-0">
        <div className="mb-4">
          <Input
            placeholder="Search docs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="sm"
            startAdornment={<Search size={14} />}
          />
        </div>
        <nav className="space-y-4">
          {(Object.keys(sectionLabels) as DocSection[]).map(sec => (
            <div key={sec}>
              <div className="text-xs font-semibold text-sand-600 uppercase tracking-wider mb-2">
                {sectionLabels[sec]}
              </div>
              <div className="space-y-1">
                {grouped[sec].map(doc => (
                  <button
                    key={doc.slug}
                    onClick={() => navigate(`/docs/${doc.section}/${doc.slug}`)}
                    className={[
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                      section === doc.section && slug === doc.slug
                        ? 'bg-sage text-cream font-medium'
                        : 'text-charcoal hover:bg-sand-200',
                    ].join(' ')}
                  >
                    {doc.title}
                  </button>
                ))}
                {grouped[sec].length === 0 && (
                  <div className="text-xs text-sand-500 px-3 py-2">No results</div>
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-sand-600 mb-4">
          <span>Docs</span>
          <ChevronRight size={12} />
          <span className="capitalize">{section}</span>
          <ChevronRight size={12} />
          <span>{currentDoc?.title || slug}</span>
        </div>

        <Card>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3 py-4">
                <div className="h-8 bg-sand-200 rounded w-1/2" />
                <div className="h-4 bg-sand-200 rounded w-full" />
                <div className="h-4 bg-sand-200 rounded w-3/4" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-light text-charcoal mb-4 pb-2 border-b border-sand">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-medium text-terracotta mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-charcoal mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-sm text-charcoal leading-relaxed mb-3">{children}</p>,
                    code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) =>
                      inline ? (
                        <code className="bg-sand-200 text-terracotta px-1.5 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>
                      ) : (
                        <code className="block bg-sand-200 p-4 rounded-lg font-mono text-xs overflow-x-auto mb-3" {...props}>{children}</code>
                      ),
                    pre: ({ children }) => <pre className="bg-sand-200 rounded-lg overflow-hidden mb-3">{children}</pre>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-sm text-charcoal space-y-1 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-sm text-charcoal space-y-1 mb-3">{children}</ol>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="w-full text-xs border-collapse">{children}</table></div>,
                    th: ({ children }) => <th className="text-left px-3 py-2 bg-sand-200 font-medium text-charcoal border border-sand">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 border border-sand text-charcoal">{children}</td>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-sage pl-4 text-sand-700 italic mb-3">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-sage hover:text-sage-600 underline">{children}</a>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## Task 2.2 — SpecsPage (full implementation)

Replace `viewer/src/pages/SpecsPage.tsx`:

```tsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { specsManifest } from '../data/specs'

const ownerColors: Record<string, string> = {
  PM: 'bg-sage-100 text-sage-700',
  Backend: 'bg-blue-100 text-blue-700',
  Frontend: 'bg-purple-100 text-purple-700',
  UI: 'bg-pink-100 text-pink-700',
  DB: 'bg-amber-100 text-amber-700',
  QA: 'bg-red-100 text-red-700',
  DevOps: 'bg-green-100 text-green-700',
  Marketing: 'bg-orange-100 text-orange-700',
  Finance: 'bg-teal-100 text-teal-700',
  Business: 'bg-indigo-100 text-indigo-700',
  Design: 'bg-rose-100 text-rose-700',
}

export const SpecsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [view, setView] = useState<'grid' | 'detail'>(slug ? 'detail' : 'grid')

  const selectedSpec = slug ? specsManifest.find(s => s.slug === slug) : null

  if (selectedSpec && view === 'detail') {
    return (
      <div className="max-w-4xl">
        <button
          onClick={() => { navigate('/specs/01_product_manager'); setView('grid') }}
          className="text-sm text-sage hover:text-sage-600 mb-4 flex items-center gap-1"
        >
          ← All Specs
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center text-cream font-bold">
            {selectedSpec.number}
          </div>
          <div>
            <h2 className="text-xl font-medium text-charcoal">{selectedSpec.title}</h2>
            <p className="text-sm text-sand-600">{selectedSpec.description}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${ownerColors[selectedSpec.owner] || 'bg-sand-200 text-charcoal'}`}>
              {selectedSpec.owner}
            </span>
          </div>
        </div>
        <Card>
          <CardContent>
            <p className="text-sm text-sand-600">
              Full spec content is stored at{' '}
              <code className="bg-sand-200 px-1.5 py-0.5 rounded font-mono text-xs">
                specs/{selectedSpec.slug}.md
              </code>
            </p>
            <p className="text-sm text-sand-600 mt-2">
              Read it in your editor or via the CLI: <code className="bg-sand-200 px-1.5 py-0.5 rounded font-mono text-xs">cat autospec/specs/{selectedSpec.slug}.md</code>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-charcoal">Role Specifications</h2>
        <p className="text-sm text-sand-600 mt-1">10 expert roles defining the AutoSpec development team</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {specsManifest.map(spec => (
          <Card
            key={spec.slug}
            variant="outlined"
            hoverable
            clickable
            onClick={() => { navigate(`/specs/${spec.slug}`); setView('detail') }}
          >
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center text-cream font-bold flex-shrink-0">
                  {spec.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-charcoal">{spec.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ownerColors[spec.owner] || 'bg-sand-200 text-charcoal'}`}>
                      {spec.owner}
                    </span>
                  </div>
                  <p className="text-xs text-sand-600 mt-1 line-clamp-2">{spec.description}</p>
                </div>
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

## Task 2.3 — BacklogPage (full implementation)

Replace `viewer/src/pages/BacklogPage.tsx`:

```tsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { backlogData, type TicketStatus, type Sprint } from '../data/backlog'

const statusColumns: { status: TicketStatus; label: string; emoji: string }[] = [
  { status: 'todo', label: 'Todo', emoji: '🔲' },
  { status: 'in-progress', label: 'In Progress', emoji: '🔄' },
  { status: 'qa', label: 'QA Review', emoji: '🧪' },
  { status: 'done', label: 'Done', emoji: '✅' },
  { status: 'blocked', label: 'Blocked', emoji: '❌' },
]

const statusVariant: Record<TicketStatus, 'todo' | 'in-progress' | 'qa' | 'done' | 'blocked'> = {
  todo: 'todo',
  'in-progress': 'in-progress',
  qa: 'qa',
  done: 'done',
  blocked: 'blocked',
}

function TicketCard({ ticket }: { ticket: Sprint['tickets'][0] }) {
  return (
    <div className="bg-cream border border-sand rounded-lg p-3 mb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-sand-600 mb-0.5">{ticket.id}</div>
          <div className="text-sm text-charcoal leading-snug">{ticket.title}</div>
          {ticket.dependencies.length > 0 && (
            <div className="text-xs text-sand-500 mt-1">
              Deps: {ticket.dependencies.join(', ')}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge variant={statusVariant[ticket.status]} size="sm">
            {ticket.points}pt
          </Badge>
          <div className="text-xs text-sand-500">{ticket.owner}</div>
        </div>
      </div>
    </div>
  )
}

export const BacklogPage: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')

  const allTickets = backlogData.flatMap(sprint =>
    sprint.tickets.map(t => ({ ...t, sprint: sprint.name }))
  )

  const totalPoints = backlogData.reduce((sum, s) => sum + s.totalPoints, 0)
  const donePoints = backlogData
    .filter(s => s.status === 'done')
    .reduce((sum, s) => sum + s.totalPoints, 0)

  if (view === 'table') {
    return (
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light text-charcoal">Backlog</h2>
            <p className="text-sm text-sand-600 mt-1">{totalPoints} pts total · {donePoints} done</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('kanban')} className="px-3 py-1.5 text-sm rounded-lg bg-sand-200 text-charcoal hover:bg-sand-300">Kanban</button>
            <button onClick={() => setView('table')} className="px-3 py-1.5 text-sm rounded-lg bg-sage text-cream">Table</button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sand-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Sprint</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Owner</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Pts</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Status</th>
                </tr>
              </thead>
              <tbody>
                {allTickets.map(ticket => (
                  <tr key={ticket.id} className="border-t border-sand hover:bg-sand-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-sand-600">{ticket.id}</td>
                    <td className="px-4 py-2.5 text-charcoal">{ticket.title}</td>
                    <td className="px-4 py-2.5 text-sand-600 text-xs">{ticket.sprint}</td>
                    <td className="px-4 py-2.5 text-sand-600 text-xs">{ticket.owner}</td>
                    <td className="px-4 py-2.5 text-charcoal">{ticket.points}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={statusVariant[ticket.status]} size="sm">
                        {ticket.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Kanban view
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-charcoal">Backlog</h2>
          <p className="text-sm text-sand-600 mt-1">{totalPoints} pts total · {donePoints} done</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('kanban')} className="px-3 py-1.5 text-sm rounded-lg bg-sage text-cream">Kanban</button>
          <button onClick={() => setView('table')} className="px-3 py-1.5 text-sm rounded-lg bg-sand-200 text-charcoal hover:bg-sand-300">Table</button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map(col => {
          const tickets = allTickets.filter(t => t.status === col.status)
          return (
            <div key={col.status} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <span>{col.emoji}</span>
                <span className="text-sm font-medium text-charcoal">{col.label}</span>
                <span className="ml-auto text-xs bg-sand-200 text-sand-600 px-2 py-0.5 rounded-full">
                  {tickets.length}
                </span>
              </div>
              <div className="min-h-32">
                {tickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-8 text-xs text-sand-400 border-2 border-dashed border-sand-200 rounded-lg">
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Task 2.5 — Documentation

Create `docs/viewer/04_pages.md`:

```markdown
---
title: "Viewer Pages"
sprint: "2.1, 2.2, 2.3, 3.1, 3.2"
created: "2026-03-09"
---

# Viewer Pages

## DocsPage `/docs/:section/:slug`

**Sprint 2.1** | Frontend

Renders autospec documentation with sidebar navigation and markdown content.

### Features
- Section-grouped sidebar (methodology, viewer)
- Fuzzy search via Input component
- Markdown rendered with react-markdown + remark-gfm
- Syntax-highlighted code blocks (sand-200 bg)
- Breadcrumb navigation
- Skeleton loading state

### Data Source
`viewer/src/data/docs.ts` → `docsManifest` array
Content fetched from `./docs/:section/:slug.md` (via Vite public/ or fetch)

### Route params
- `:section` — e.g. `methodology`, `viewer`
- `:slug` — e.g. `01_philosophy`

---

## SpecsPage `/specs/:slug`

**Sprint 2.2** | Frontend

Displays the 10 role spec files as browsable cards.

### Features
- 2-column grid of spec cards
- Owner color badges per role
- Click → detail view with spec content
- Navigate back to grid

### Data Source
`viewer/src/data/specs.ts` → `specsManifest` array

---

## BacklogPage `/backlog`

**Sprint 2.3** | Frontend

Shows all tickets across 6 sprints in kanban or table view.

### Features
- Kanban board: 5 columns (Todo / In Progress / QA / Done / Blocked)
- Table view: sortable, all 34 tickets
- Toggle between views
- Total points + done points in header

### Data Source
`viewer/src/data/backlog.ts` → `backlogData` array (6 sprints, 34 tickets)

### Kanban columns
| Column | Status | Emoji |
|--------|--------|-------|
| Todo | todo | 🔲 |
| In Progress | in-progress | 🔄 |
| QA Review | qa | 🧪 |
| Done | done | ✅ |
| Blocked | blocked | ❌ |

---

## SkillsPage `/skills/:slug`

**Sprint 3.1** — See Sprint 3 agent output

---

## EnvironmentsPage `/environments`

**Sprint 3.2** — See Sprint 3 agent output
```

---

## Build & Verify

```bash
cd /opt/FitnessAiManager/autospec/viewer
npm run build
```

**Check:** Zero TypeScript errors. All 3 pages compile.

**Also check:**
```bash
grep -r "shadcn\|@radix-ui\|font-hebrew" viewer/src/pages/DocsPage.tsx viewer/src/pages/SpecsPage.tsx viewer/src/pages/BacklogPage.tsx || echo "CLEAN"
```

---

## Final Steps

1. Update `specs/backlog.md` — Sprint 2 tickets (2.1–2.5) → ✅ Done, Sprint 2 status → ✅ Done
2. Create `sprints/sprint-2/summary.md`
3. Return: build exit code, file list, any TS errors and fixes
