import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { DependencyGraph, type GraphNode, type GraphEdge } from '../components/diagrams/DependencyGraph'
import { SequenceDiagram, type Actor, type Message, type ActivationBar } from '../components/diagrams/SequenceDiagram'
import { SprintTimeline, type TimelinePhase, type TimelineMilestone } from '../components/diagrams/SprintTimeline'
import { AgentCapabilityRadar, type AgentData } from '../components/diagrams/AgentCapabilityRadar'
import { ProgressRing } from '../components/charts/ProgressRing'

// ─── Sprint 6 Dependency Graph Data ─────────────────────────────────
const depNodes: GraphNode[] = [
  { id: '6.1', label: 'Phase Types', x: 40, y: 20, owner: 'Backend', points: 2, status: 'todo', description: 'Define phase type system: foundation, scaffold, content, polish, qa with ordering + dependency rules' },
  { id: '6.2', label: 'Agent Schema', x: 270, y: 20, owner: 'Backend', points: 2, status: 'todo', description: 'Define agent type enum + base AgentProfile interface' },
  { id: '6.3', label: 'Config Extension', x: 155, y: 100, owner: 'Backend', points: 3, status: 'todo', description: 'Extend .autospecrc.json with agents, phases, orchestration sections' },
  { id: '6.4', label: '6 Agent Profiles', x: 430, y: 100, owner: 'Backend', points: 5, status: 'todo', description: 'Create Claude, Copilot, Gemini, Cline, Aider, Windsurf profiles + registry' },
  { id: '6.5', label: 'Auto-Detection', x: 560, y: 190, owner: 'Backend', points: 3, status: 'todo', description: 'Auto-detect active AI environment from process/env signals' },
  { id: '6.6', label: 'State Manager', x: 40, y: 190, owner: 'Backend', points: 5, status: 'todo', description: 'Track phase progress, file hashes, completion status. Atomic writes.' },
  { id: '6.7', label: 'Validators', x: 200, y: 190, owner: 'Backend', points: 3, status: 'todo', description: 'Pre/post-condition checks per phase type' },
  { id: '6.8', label: 'Cross-Ref Check', x: 40, y: 280, owner: 'Backend', points: 3, status: 'todo', description: 'Verify backlog <-> docs <-> sprint summary linkage' },
  { id: '6.9', label: 'Sequencer', x: 270, y: 280, owner: 'Backend', points: 5, status: 'todo', description: 'Resolve phase ordering, dependency graph, parallel-safe detection' },
  { id: '6.10', label: 'Generate Cmd', x: 480, y: 280, owner: 'Backend', points: 3, status: 'todo', description: 'autospec generate command — wraps generators behind sequencer' },
  { id: '6.11', label: 'Init Resume', x: 130, y: 280, owner: 'Backend', points: 3, status: 'todo', description: 'Update autospec init to resume from partial state' },
  { id: '6.12', label: 'Docs + Summary', x: 620, y: 280, owner: 'PM', points: 1, status: 'todo', description: 'Sprint 6 summary + documentation update' },
]

const depEdges: GraphEdge[] = [
  { from: '6.1', to: '6.3' },
  { from: '6.2', to: '6.3' },
  { from: '6.2', to: '6.4' },
  { from: '6.4', to: '6.5' },
  { from: '6.1', to: '6.6' },
  { from: '6.1', to: '6.7' },
  { from: '6.6', to: '6.7' },
  { from: '6.6', to: '6.8' },
  { from: '6.6', to: '6.11' },
  { from: '6.1', to: '6.9' },
  { from: '6.6', to: '6.9' },
  { from: '6.7', to: '6.9' },
  { from: '6.4', to: '6.10' },
  { from: '6.9', to: '6.10' },
]

// ─── Planning Flow Sequence Diagram ──────────────────────────────────
const planningActors: Actor[] = [
  { id: 'user', label: 'User', color: '#574b3b', icon: '👤' },
  { id: 'orchestrator', label: 'Orchestrator', color: '#698472', icon: '🎯' },
  { id: 'architect', label: 'Architect', color: '#8e6a59', icon: '🏗' },
  { id: 'hx', label: 'HX Expert', color: '#b08a79', icon: '🧠' },
  { id: 'pma', label: 'PM-A', color: '#7a9488', icon: '📋' },
  { id: 'pmb', label: 'PM-B', color: '#a08c72', icon: '🔍' },
  { id: 'pmc', label: 'PM-C', color: '#698472', icon: '✅' },
]

const planningMessages: Message[] = [
  { from: 'user', to: 'orchestrator', label: '/plan-sprint "goal"', type: 'sync', description: 'User invokes plan-sprint with feature goal' },
  { from: 'orchestrator', to: 'orchestrator', label: 'Read backlog + docs', type: 'self', description: 'Analyze goal, determine next sprint number, select experts' },
  { from: 'orchestrator', to: 'architect', label: 'Analyze architecture', type: 'async', description: 'Phase 2: parallel expert launch' },
  { from: 'orchestrator', to: 'hx', label: 'Analyze user experience', type: 'async', description: 'Phase 2: parallel expert launch' },
  { from: 'architect', to: 'orchestrator', label: 'System impact report', type: 'return', description: 'API design, file structure, risks, complexity estimate' },
  { from: 'hx', to: 'orchestrator', label: 'UX analysis report', type: 'return', description: 'Personas, journeys, error recovery, success metrics' },
  { from: 'orchestrator', to: 'pma', label: 'Draft sprint plan', type: 'sync', description: 'Phase 3: synthesize all expert analyses into draft' },
  { from: 'pma', to: 'orchestrator', label: 'Draft: 12 tickets, 38 pts', type: 'return', description: 'Complete draft with phases, QA plan, docs impact' },
  { from: 'orchestrator', to: 'pmb', label: 'Adversarial review', type: 'sync', description: 'Phase 4: review against 8-point checklist' },
  { from: 'pmb', to: 'orchestrator', label: '10 issues, 5 recommendations', type: 'return', description: 'Completeness, granularity, FinOps, QA coverage gaps' },
  { from: 'orchestrator', to: 'pmc', label: 'Final synthesis', type: 'sync', description: 'Phase 5: merge draft + review, validate format' },
  { from: 'pmc', to: 'orchestrator', label: 'Final plan: 38 pts', type: 'return', description: 'Production-ready sprint plan matching backlog format' },
  { from: 'orchestrator', to: 'user', label: 'Present plan for approval', type: 'sync', description: 'Phase 6: show summary + ask to commit to backlog' },
]

const planningActivations: ActivationBar[] = [
  { actor: 'orchestrator', startMsg: 0, endMsg: 12 },
  { actor: 'architect', startMsg: 2, endMsg: 4 },
  { actor: 'hx', startMsg: 3, endMsg: 5 },
  { actor: 'pma', startMsg: 6, endMsg: 7 },
  { actor: 'pmb', startMsg: 8, endMsg: 9 },
  { actor: 'pmc', startMsg: 10, endMsg: 11 },
]

// ─── Sprint Timeline Data ────────────────────────────────────────────
const timelinePhases: TimelinePhase[] = [
  { id: 'types', label: 'Types & Config', startCol: 0, span: 1, row: 0, status: 'planned', tickets: ['6.1', '6.2', '6.3'] },
  { id: 'agents', label: 'Agent Profiles', startCol: 1, span: 1, row: 0, status: 'planned', tickets: ['6.4', '6.5'] },
  { id: 'state', label: 'State + Validation', startCol: 1, span: 2, row: 1, status: 'planned', tickets: ['6.6', '6.7', '6.8'] },
  { id: 'engine', label: 'Sequencing Engine', startCol: 3, span: 1, row: 0, status: 'planned', tickets: ['6.9'] },
  { id: 'cli', label: 'CLI Commands', startCol: 3, span: 1, row: 1, status: 'planned', tickets: ['6.10', '6.11'] },
  { id: 'docs', label: 'Docs & Summary', startCol: 4, span: 1, row: 0, status: 'planned', tickets: ['6.12'] },
]

const timelineMilestones: TimelineMilestone[] = [
  { col: 2, label: 'State API stable', icon: '🔒' },
  { col: 4, label: 'Sprint complete', icon: '🚀' },
]

// ─── Agent Capability Radar Data ────────────────────────────────────
const agentRadarData: AgentData[] = [
  { id: 'claude', name: 'Claude Code', color: '#698472', values: { context: 80, output: 75, subagents: 95, streaming: 90, resume: 95, isolation: 90 } },
  { id: 'gemini', name: 'Gemini CLI', color: '#4285f4', values: { context: 100, output: 95, subagents: 20, streaming: 60, resume: 15, isolation: 30 } },
  { id: 'copilot', name: 'GitHub Copilot', color: '#000000', values: { context: 40, output: 25, subagents: 10, streaming: 30, resume: 10, isolation: 15 } },
  { id: 'opencode', name: 'OpenCode', color: '#f59e0b', values: { context: 60, output: 55, subagents: 35, streaming: 40, resume: 20, isolation: 30 } },
  { id: 'cline', name: 'Cline', color: '#8b5cf6', values: { context: 70, output: 60, subagents: 15, streaming: 50, resume: 15, isolation: 25 } },
  { id: 'aider', name: 'Aider', color: '#ef4444', values: { context: 55, output: 50, subagents: 10, streaming: 35, resume: 20, isolation: 60 } },
]

const radarAxes = [
  { key: 'context', label: 'Context' },
  { key: 'output', label: 'Output' },
  { key: 'subagents', label: 'Subagents' },
  { key: 'streaming', label: 'Streaming' },
  { key: 'resume', label: 'Resume' },
  { key: 'isolation', label: 'Isolation' },
]

// ─── Page tabs ───────────────────────────────────────────────────────
type TabId = 'overview' | 'dependencies' | 'planning' | 'agents' | 'timeline'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'dependencies', label: 'Dependency Graph', icon: '🔗' },
  { id: 'planning', label: 'Planning Flow', icon: '🔄' },
  { id: 'agents', label: 'Agent Capabilities', icon: '🤖' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
]

export const Sprint6Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const totalPoints = 38
  const donePoints = 0
  const totalTickets = 12
  const ownerDist = [
    { owner: 'Backend', count: 11, color: '#698472' },
    { owner: 'PM', count: 1, color: '#8e6a59' },
  ]
  const pointsDist = [
    { range: '1-2 pts', count: 3, color: '#e8e4d8' },
    { range: '3 pts', count: 5, color: '#d8d0ba' },
    { range: '5 pts', count: 4, color: '#698472' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-light text-charcoal">Sprint 6</h2>
          <Badge variant="todo">Planned</Badge>
        </div>
        <p className="text-sm text-sand-600 mt-1">Multi-Agent Orchestration Engine — {totalPoints} points, {totalTickets} tickets</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-sand-200 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cream shadow-subtle text-charcoal font-medium'
                : 'text-sand-600 hover:text-charcoal hover:bg-cream/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            <Card variant="outlined">
              <CardContent className="py-4 flex flex-col items-center">
                <ProgressRing value={donePoints} max={totalPoints} size={72} label="Progress" />
                <div className="text-xs text-sand-600 mt-1">{donePoints}/{totalPoints} pts</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-charcoal">{totalTickets}</div>
                <div className="text-xs text-sand-600 mt-1">Tickets</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-charcoal">6</div>
                <div className="text-xs text-sand-600 mt-1">Agent Profiles</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-charcoal">5</div>
                <div className="text-xs text-sand-600 mt-1">Phase Types</div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution charts */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Owner Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ownerDist.map(d => (
                    <div key={d.owner} className="flex items-center gap-3">
                      <span className="text-sm text-charcoal w-20">{d.owner}</span>
                      <div className="flex-1 h-6 bg-sand-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(d.count / totalTickets) * 100}%`, backgroundColor: d.color }}
                        />
                      </div>
                      <span className="text-xs text-sand-600 w-6 text-right">{d.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Points Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pointsDist.map(d => (
                    <div key={d.range} className="flex items-center gap-3">
                      <span className="text-sm text-charcoal w-20">{d.range}</span>
                      <div className="flex-1 h-6 bg-sand-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(d.count / totalTickets) * 100}%`, backgroundColor: d.color }}
                        />
                      </div>
                      <span className="text-xs text-sand-600 w-6 text-right">{d.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket list */}
          <Card>
            <CardHeader>
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>12 tickets across foundation, orchestration, and CLI integration</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sand-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Ticket</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Owner</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Pts</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Deps</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {depNodes.map(node => (
                    <tr key={node.id} className="border-t border-sand hover:bg-sand-100">
                      <td className="px-4 py-2.5 font-mono text-xs text-sage-700 font-semibold">{node.id}</td>
                      <td className="px-4 py-2.5 text-charcoal">{node.label}</td>
                      <td className="px-4 py-2.5 text-sand-600 text-xs">{node.owner}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant="default" size="sm">{node.points} pt</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-sand-500 font-mono">
                        {depEdges.filter(e => e.to === node.id).map(e => e.from).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="todo" size="sm">Todo</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'dependencies' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sprint 6 Dependency DAG</CardTitle>
              <CardDescription>
                Interactive dependency graph. Hover to highlight connections, click for details.
                Terracotta badges show story points. Dashed edges become solid on hover.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyGraph
                nodes={depNodes}
                edges={depEdges}
                width={780}
                height={340}
              />
            </CardContent>
          </Card>

          {/* Critical path analysis */}
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Critical Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {['6.1', '6.6', '6.7', '6.9', '6.10'].map((id, i) => {
                  const node = depNodes.find(n => n.id === id)!
                  return (
                    <React.Fragment key={id}>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sage/10 border border-sage/20 rounded-lg">
                        <span className="font-mono text-xs font-semibold text-sage-700">{id}</span>
                        <span className="text-xs text-charcoal">{node.label}</span>
                        <Badge variant="default" size="sm">{node.points}pt</Badge>
                      </div>
                      {i < 4 && (
                        <svg width="20" height="12" className="flex-shrink-0">
                          <line x1="0" y1="6" x2="14" y2="6" stroke="#698472" strokeWidth="2" />
                          <polygon points="14,2 20,6 14,10" fill="#698472" />
                        </svg>
                      )}
                    </React.Fragment>
                  )
                })}
                <div className="ml-4 text-xs text-sand-600">
                  Total: <span className="font-semibold text-charcoal">18 pts</span> on critical path
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'planning' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Planning Sequence</CardTitle>
              <CardDescription>
                The 6-phase planning workflow that produced this sprint. Hover messages for details.
                Solid arrows = synchronous. Dashed arrows = returns. Open arrows = parallel async.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SequenceDiagram
                actors={planningActors}
                messages={planningMessages}
                activations={planningActivations}
              />
            </CardContent>
          </Card>

          {/* Phase summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { phase: 'Phase 1-2', title: 'Expert Analysis', desc: 'Architect + HX Expert ran in parallel. Produced system impact assessment, API design, persona analysis, error recovery matrix.', color: '#698472' },
              { phase: 'Phase 3-4', title: 'PM Draft + Review', desc: 'PM-A drafted 24-ticket plan (67pts). PM-B found 10 issues: overscoped, merge profiles, defer templates. Cut to 38pts.', color: '#8e6a59' },
              { phase: 'Phase 5-6', title: 'Final Synthesis', desc: 'PM-C merged recommendations. Single sprint, 12 tickets. Deferred chunker + templates to Sprint 7. User confirmed.', color: '#7a9488' },
            ].map(p => (
              <Card key={p.phase} variant="outlined">
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-xs font-medium text-sand-600">{p.phase}</span>
                  </div>
                  <div className="text-sm font-medium text-charcoal mb-1">{p.title}</div>
                  <p className="text-xs text-sand-600 leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Capability Comparison</CardTitle>
              <CardDescription>
                Radar chart comparing 6 AI coding agents across key capabilities.
                Click agent names to toggle visibility. Hover to highlight.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgentCapabilityRadar
                agents={agentRadarData}
                axes={radarAxes}
                size={320}
              />
            </CardContent>
          </Card>

          {/* Agent detail cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Claude Code', ctx: '200K', out: '~16K', strategy: 'single/phase', color: '#698472', features: ['Native subagents', 'Session resume', 'Stream JSON', 'Worktree isolation'] },
              { name: 'Gemini CLI', ctx: '1M+', out: '64K+', strategy: 'single', color: '#4285f4', features: ['Massive context', 'GEMINI.md injection', 'High output cap', 'Few phases needed'] },
              { name: 'GitHub Copilot', ctx: '32K', out: '~3K', strategy: 'micro', color: '#000000', features: ['Smallest chunks', 'Stateless calls', 'Most phases needed', 'Conservative defaults'] },
              { name: 'OpenCode', ctx: 'Varies', out: 'Varies', strategy: 'phase', color: '#f59e0b', features: ['Provider-dependent', '@general subagent', '-p flag sessions', 'Manual isolation'] },
              { name: 'Cline', ctx: '~200K', out: 'Varies', strategy: 'phase', color: '#8b5cf6', features: ['VS Code native', 'Model-agnostic', 'Approval-gated', 'File-edit focus'] },
              { name: 'Aider', ctx: '~128K', out: 'Varies', strategy: 'phase', color: '#ef4444', features: ['Git-centric', 'Diff-based edits', '--message flag', 'Auto-commit'] },
            ].map(agent => (
              <Card key={agent.name} variant="outlined" hoverable>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span className="text-sm font-medium text-charcoal">{agent.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
                    <div className="text-sand-600">Context</div>
                    <div className="text-charcoal font-mono">{agent.ctx}</div>
                    <div className="text-sand-600">Output</div>
                    <div className="text-charcoal font-mono">{agent.out}</div>
                    <div className="text-sand-600">Strategy</div>
                    <div className="text-charcoal font-mono">{agent.strategy}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.features.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-sand-200 rounded-full text-xs text-sand-700">{f}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Timeline</CardTitle>
              <CardDescription>
                Gantt-style view of Sprint 6 phases. Badge numbers show ticket count per phase.
                Parallel tracks show work that can execute concurrently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SprintTimeline
                phases={timelinePhases}
                milestones={timelineMilestones}
                columns={['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5']}
                totalRows={2}
              />
            </CardContent>
          </Card>

          {/* Phase detail cards */}
          <div className="grid grid-cols-2 gap-4">
            {timelinePhases.map(phase => (
              <Card key={phase.id} variant="outlined">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">{phase.label}</span>
                    <Badge variant="default" size="sm">{phase.tickets?.length || 0} tickets</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.tickets?.map(tid => {
                      const node = depNodes.find(n => n.id === tid)
                      return (
                        <div key={tid} className="flex items-center gap-1 px-2 py-1 bg-sand-200 rounded-lg">
                          <span className="font-mono text-xs font-semibold text-sage-700">{tid}</span>
                          <span className="text-xs text-sand-600">{node?.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Deferred items */}
          <Card variant="filled">
            <CardHeader>
              <CardTitle>Deferred to Sprint 7</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { item: 'Handlebars template refactor', reason: 'No user value until orchestration stable' },
                  { item: 'Token estimator + chunk sizing', reason: 'Needs real usage data from Sprint 6' },
                  { item: 'Truncation detection + error UX', reason: 'Polish after core engine works' },
                  { item: 'Micro-phase fallback', reason: 'Depends on chunker infrastructure' },
                ].map(d => (
                  <div key={d.item} className="flex items-start gap-2 text-xs">
                    <span className="text-sand-500 mt-0.5">⏳</span>
                    <div>
                      <div className="text-charcoal font-medium">{d.item}</div>
                      <div className="text-sand-500">{d.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
