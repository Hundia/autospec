import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Button } from '../components/primitives/Button'
import { AnimatedCounter } from '../components/charts/AnimatedCounter'
import { FlowDiagram } from '../components/diagrams/FlowDiagram'
import {
  qualityGates, categories, scoreTiers, checkTypeLabels,
  pipelineSteps, pipelineConnections, confoundingVariables, models,
} from '../data/benchmark'
import type { BadgeVariant } from '../components/primitives/Badge'

type TabId = 'pipeline' | 'gates' | 'scoring'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'pipeline', label: 'Pipeline', icon: '🔄' },
  { id: 'gates', label: 'Quality Gates', icon: '🎯' },
  { id: 'scoring', label: 'Scoring', icon: '📊' },
]

export const BenchmarkOverviewPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('pipeline')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Derived data
  const filteredGates = selectedCategory
    ? qualityGates.filter(g => g.category === selectedCategory)
    : qualityGates

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.label]))

  const pieData = categories.map(c => ({ name: c.label, value: c.weight, color: c.color }))

  // Binary vs graded counts
  const binaryGates = qualityGates.filter(g => g.checkType !== 'graded')
  const gradedGates = qualityGates.filter(g => g.checkType === 'graded')

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-charcoal">Benchmark Harness</h2>
        <p className="text-sm text-sand-600 mt-1">Cross-model QUICKSTART pipeline scoring</p>
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

      {/* ── Tab 1: Pipeline ── */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            <Card variant="outlined">
              <CardContent className="py-4 flex flex-col items-center">
                <AnimatedCounter value={28} label="Quality Gates" />
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 flex flex-col items-center">
                <AnimatedCounter value={6} label="Categories" />
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 flex flex-col items-center">
                <AnimatedCounter value={3} label="Runs / Model" />
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent className="py-4 flex flex-col items-center">
                <AnimatedCounter value={models.length} label="Models Tested" />
              </CardContent>
            </Card>
          </div>

          {/* Flow diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <FlowDiagram
                steps={pipelineSteps}
                connections={pipelineConnections}
                direction="horizontal"
              />
            </CardContent>
          </Card>

          {/* Confounding variables */}
          <Card variant="filled">
            <CardHeader><CardTitle>Confounding Variables</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-sand-600 mb-3">
                This benchmark measures model + CLI + prompt combined. Factors that affect results:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {confoundingVariables.map(v => (
                  <div key={v.title} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-charcoal">{v.title}</div>
                      <div className="text-xs text-sand-600">{v.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* View Results button */}
          <div className="flex">
            <Button onClick={() => navigate('/benchmark/results')}>View Results →</Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Quality Gates ── */}
      {activeTab === 'gates' && (
        <div className="space-y-6">
          {/* Category filter */}
          <div className="bg-sand-200 rounded-xl p-1 inline-flex gap-1 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedCategory === null
                  ? 'bg-cream shadow-subtle text-charcoal font-medium'
                  : 'text-sand-700 hover:text-charcoal'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cream shadow-subtle text-charcoal font-medium'
                    : 'text-sand-700 hover:text-charcoal'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pie chart */}
          <Card>
            <CardHeader>
              <CardTitle>Category Weights</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    dataKey="value"
                    label={({ name, value }: { name: string; value: number }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gates table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory ? `${categoryMap[selectedCategory]} Gates` : 'All Gates'}
                <span className="text-sm font-normal text-sand-600 ml-2">({filteredGates.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sand">
                      <th className="text-left py-2 px-3 text-sand-600 font-medium">Gate</th>
                      <th className="text-left py-2 px-3 text-sand-600 font-medium">Category</th>
                      <th className="text-left py-2 px-3 text-sand-600 font-medium">Description</th>
                      <th className="text-left py-2 px-3 text-sand-600 font-medium">Check Type</th>
                      <th className="text-center py-2 px-3 text-sand-600 font-medium">Conditional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGates.map(gate => {
                      const categoryLabel = categoryMap[gate.category] || gate.category
                      const checkBadgeVariant: BadgeVariant = gate.checkType === 'graded' ? 'graded' : 'default'
                      return (
                        <tr key={gate.id} className="border-b border-sand/50 hover:bg-sand-200/30">
                          <td className="py-2 px-3 font-mono text-xs">{gate.id}</td>
                          <td className="py-2 px-3">
                            <Badge variant="default" size="sm">{categoryLabel}</Badge>
                          </td>
                          <td className="py-2 px-3">{gate.description}</td>
                          <td className="py-2 px-3">
                            <Badge variant={checkBadgeVariant} size="sm">
                              {checkTypeLabels[gate.checkType]}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-center">{gate.conditional ? '⚡' : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Check types legend */}
          <Card variant="outlined">
            <CardHeader><CardTitle>Check Types</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.entries(checkTypeLabels) as [string, string][]).map(([type, label]) => (
                  <div key={type} className="text-sm">
                    <span className="font-mono text-xs text-sage">{type}</span>
                    <div className="text-sand-600 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab 3: Scoring ── */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          {/* Formula */}
          <Card>
            <CardHeader><CardTitle>Scoring Formula</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-sand-200 rounded-lg p-4 font-mono text-sm">
                <div className="text-terracotta">
                  normalized_score = (Σ category_weighted / active_weight) × 100
                </div>
                <div className="mt-2 text-sand-600 text-xs">
                  category_weighted = (gate_scores / gate_max) × category_weight
                </div>
                <div className="text-sand-600 text-xs">
                  active_weight = Σ weights of non-skipped categories
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score tiers */}
          <Card>
            <CardHeader><CardTitle>Score Interpretation</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-sand">
                {scoreTiers.map(tier => (
                  <div
                    key={tier.label}
                    className="flex items-start gap-4 px-6 py-4"
                    style={{ borderLeft: `3px solid ${tier.color}` }}
                  >
                    <div className="w-20 flex-shrink-0">
                      <div className="text-sm font-medium text-charcoal">{tier.label}</div>
                      <div className="text-xs text-sand-600">{tier.min}–{tier.max}</div>
                    </div>
                    <div className="text-sm text-charcoal">{tier.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Binary vs Graded */}
          <div className="grid grid-cols-2 gap-6">
            <Card variant="outlined">
              <CardHeader><CardTitle>Binary Gates</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-light text-charcoal mb-2">{binaryGates.length}</div>
                <div className="text-sm text-sand-600 mb-3">PASS (1) or FAIL (0)</div>
                <p className="text-xs text-sand-600">
                  Used for existence and pattern checks where the answer is definitively yes or no —
                  file exists, regex matches, directory present.
                </p>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardHeader><CardTitle>Graded Gates</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-light text-charcoal mb-2">{gradedGates.length}</div>
                <div className="text-sm text-sand-600 mb-3">0 / 1 / 2 / 3 scale</div>
                <p className="text-xs text-sand-600">
                  Used for quality assessment where partial credit reflects real signal — entity
                  consistency, cross-reference resolution, spec depth.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category weights table */}
          <Card>
            <CardHeader><CardTitle>Category Weights</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand bg-sand-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Weight</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Gates</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">What It Measures</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-t border-sand hover:bg-sand-100">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-medium text-charcoal">{cat.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="default" size="sm">{cat.weight}%</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-sand-600">{cat.gateCount}</td>
                      <td className="px-4 py-2.5 text-sand-600 text-xs">
                        {cat.id === 'structure' && 'Required directories, files, and top-level organisation'}
                        {cat.id === 'specificity' && 'Concrete examples, entity references, spec depth and cross-links'}
                        {cat.id === 'sdd_compliance' && 'SDD workflow conventions: DoD, assumptions, CLAUDE.md, status emojis'}
                        {cat.id === 'coherence' && 'Consistency of entities, endpoints, and DB tables across spec files'}
                        {cat.id === 'viewer' && 'Viewer app specification: framework choice, visualisations, interactivity'}
                        {cat.id === 'technical_correctness' && 'Valid markdown, consistent paths, no circular dependencies'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
