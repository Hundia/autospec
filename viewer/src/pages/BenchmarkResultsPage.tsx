import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Button } from '../components/primitives/Button'
import { ScoreGauge } from '../components/charts/ScoreGauge'
import { ProgressRing } from '../components/charts/ProgressRing'
import { AgentCapabilityRadar } from '../components/diagrams/AgentCapabilityRadar'
import { GateHeatmap } from '../components/charts/GateHeatmap'
import {
  models, categories, qualityGates, getScoreTier, categoryColorMap,
} from '../data/benchmark'
import type { GateStatus } from '../data/benchmark'

type TabId = 'comparison' | 'gates' | 'runs'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'comparison', label: 'Comparison', icon: '⚖️' },
  { id: 'gates', label: 'Gates Detail', icon: '🔍' },
  { id: 'runs', label: 'Runs', icon: '📈' },
]

export const BenchmarkResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('comparison')

  // ── Tab 1: Comparison data ──

  const radarAgents = models.map(m => ({
    id: m.model,
    name: m.displayName,
    color: m.color,
    values: Object.fromEntries(
      categories.map(cat => [
        cat.id,
        cat.weight > 0
          ? Math.round(((m.aggregate.categories[cat.id]?.meanWeightedScore || 0) / cat.weight) * 100)
          : 0,
      ])
    ),
  }))

  const radarAxes = categories.map(c => ({ key: c.id, label: c.label }))

  const barData = categories
    .filter(c => c.id !== 'viewer')
    .map(cat => ({
      name: cat.label,
      ...Object.fromEntries(
        models.map(m => [
          m.displayName,
          Math.round(
            ((m.aggregate.categories[cat.id]?.meanWeightedScore || 0) / cat.weight) * 100
          ),
        ])
      ),
    }))

  // Delta table: per category, sorted by absolute delta descending
  const deltaRows = categories
    .filter(c => c.id !== 'viewer')
    .map(cat => {
      const scores = models.map(m =>
        Math.round(((m.aggregate.categories[cat.id]?.meanWeightedScore || 0) / cat.weight) * 100)
      )
      const delta = scores[0] - scores[1]
      return { cat, scores, delta, absDelta: Math.abs(delta) }
    })
    .sort((a, b) => b.absDelta - a.absDelta)

  // ── Tab 2: Gates Detail data ──

  const heatmapModels = models.map(m => ({
    name: m.displayName,
    color: m.color,
    gates: Object.fromEntries(
      qualityGates.map(g => {
        const agg = m.aggregate.gates[g.id]
        const maxScore = agg?.maxScore ?? (g.checkType === 'graded' ? 3 : 1)
        const mean = agg?.mean ?? 0
        let status: GateStatus = 'fail'
        if (maxScore === 0) {
          status = 'skipped'
        } else if (g.checkType === 'graded') {
          status = mean > 0 ? 'graded' : 'fail'
        } else {
          status = mean >= 0.5 ? 'pass' : 'fail'
        }
        return [g.id, { status, score: Math.round(mean * 100) / 100, maxScore, details: '' }]
      })
    ),
  }))

  const varianceGates = qualityGates
    .map(g => ({
      gate: g,
      claudeStddev: models[0].aggregate.gates[g.id]?.stddev || 0,
      gptStddev: models[1]?.aggregate.gates[g.id]?.stddev || 0,
      claudeMean: models[0].aggregate.gates[g.id]?.mean || 0,
      gptMean: models[1]?.aggregate.gates[g.id]?.mean || 0,
    }))
    .filter(v => v.claudeStddev > 0 || v.gptStddev > 0)
    .sort(
      (a, b) =>
        Math.max(b.claudeStddev, b.gptStddev) - Math.max(a.claudeStddev, a.gptStddev)
    )

  // ── Tab 3: Runs data ──

  const runCount = models[0].runs.length
  const lineData = Array.from({ length: runCount }, (_, i) => ({
    run: `Run ${i + 1}`,
    ...Object.fromEntries(
      models.map(m => [m.displayName, m.runs[i]?.overall.normalizedScore ?? 0])
    ),
  }))

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/benchmark')}
            icon={<span>←</span>}
            iconPosition="start"
          >
            Benchmark
          </Button>
        </div>
        <h2 className="text-2xl font-light text-charcoal">Benchmark Results</h2>
        <p className="text-sm text-sand-600 mt-1">
          {models.length} models · {runCount} runs each · {qualityGates.length} quality gates
        </p>
      </div>

      {/* Tab navigation */}
      <div className="bg-sand-200 rounded-xl p-1 inline-flex gap-1">
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

      {/* ── Tab 1: Comparison ── */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Score gauges */}
          <div className="grid grid-cols-2 gap-6">
            {models.map(m => {
              const tier = getScoreTier(m.aggregate.overall.mean)
              return (
                <Card key={m.model} variant="elevated">
                  <CardContent className="py-6 flex flex-col items-center">
                    <ScoreGauge
                      score={m.aggregate.overall.mean}
                      label={m.displayName}
                      tierLabel={tier.label}
                      tierColor={tier.color}
                    />
                    <div className="mt-2 text-xs text-sand-600">
                      ±{m.aggregate.overall.stddev} stddev across {m.aggregate.runCount} runs
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Category Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentCapabilityRadar
                agents={radarAgents}
                axes={radarAxes}
                size={320}
              />
            </CardContent>
          </Card>

          {/* Grouped Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Category Scores by Model</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d8d0ba" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#574b3b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#574b3b' }} />
                  <Tooltip
                    contentStyle={{ background: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend />
                  {models.map(m => (
                    <Bar
                      key={m.model}
                      dataKey={m.displayName}
                      fill={m.color}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delta table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Deltas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sand-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Category</th>
                    {models.map(m => (
                      <th key={m.model} className="text-left px-4 py-3 text-xs font-medium text-charcoal">
                        {m.displayName}
                      </th>
                    ))}
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Delta</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {deltaRows.map(({ cat, scores, delta }) => {
                    const winnerIdx = delta > 0 ? 0 : delta < 0 ? 1 : -1
                    return (
                      <tr key={cat.id} className="border-t border-sand hover:bg-sand-100">
                        <td className="px-4 py-2.5 text-charcoal font-medium">
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: categoryColorMap[cat.id] }}
                          />
                          {cat.label}
                        </td>
                        {scores.map((score, i) => (
                          <td key={i} className="px-4 py-2.5 text-charcoal font-mono text-xs">
                            {score}
                          </td>
                        ))}
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold"
                          style={{ color: delta > 0 ? '#698472' : delta < 0 ? '#8e6a59' : '#7a6a54' }}
                        >
                          {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-charcoal">
                          {winnerIdx >= 0 ? models[winnerIdx].displayName : 'Tie'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab 2: Gates Detail ── */}
      {activeTab === 'gates' && (
        <div className="space-y-6">
          {/* Gate heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Gate Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <GateHeatmap
                models={heatmapModels}
                qualityGates={qualityGates}
                categories={categories}
              />
            </CardContent>
          </Card>

          {/* Variance spotlight */}
          {varianceGates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variance Spotlight</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sand-200">
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Gate</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Category</th>
                      {models.map(m => (
                        <th key={m.model} className="text-left px-4 py-3 text-xs font-medium text-charcoal">
                          {m.displayName} mean ± σ
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {varianceGates.map(({ gate, claudeMean, claudeStddev, gptMean, gptStddev }) => (
                      <tr key={gate.id} className="border-t border-sand hover:bg-sand-100">
                        <td className="px-4 py-2.5 font-mono text-xs text-sage-700 font-semibold">
                          {gate.id}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-sand-600">
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: categoryColorMap[gate.category] }}
                          />
                          {gate.category}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">
                          {claudeMean.toFixed(2)} ± {claudeStddev.toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">
                          {gptMean.toFixed(2)} ± {gptStddev.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Tab 3: Runs ── */}
      {activeTab === 'runs' && (
        <div className="space-y-6">
          {/* Line chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Per Run</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d8d0ba" />
                  <XAxis dataKey="run" tick={{ fontSize: 12, fill: '#574b3b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#574b3b' }} />
                  <Tooltip
                    contentStyle={{ background: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend />
                  {models.map(m => (
                    <Line
                      key={m.model}
                      type="monotone"
                      dataKey={m.displayName}
                      stroke={m.color}
                      strokeWidth={2}
                      dot={{ fill: m.color, r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Run detail cards */}
          <div className="space-y-6">
            {models.map(m => (
              <div key={m.model}>
                <div className="text-sm font-medium text-charcoal mb-3 flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  {m.displayName}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {m.runs.map(run => (
                    <Card key={run.runNumber} variant="outlined">
                      <CardContent className="py-3 flex flex-col items-center">
                        <ProgressRing
                          value={run.overall.normalizedScore}
                          max={100}
                          size={60}
                          color={m.color}
                        />
                        <div className="text-lg font-light mt-1 text-charcoal">
                          {run.overall.normalizedScore}
                        </div>
                        <div className="text-xs text-sand-600">Run {run.runNumber}</div>
                        <div className="text-xs text-sand-500 mt-1">{run.timestamp.slice(11, 16)}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Statistical summary */}
          <Card>
            <CardHeader>
              <CardTitle>Statistical Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sand-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Model</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Mean</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Min</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Max</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Stddev</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-charcoal">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(m => {
                    const agg = m.aggregate.overall
                    return (
                      <tr key={m.model} className="border-t border-sand hover:bg-sand-100">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: m.color }}
                            />
                            <span className="text-charcoal font-medium text-xs">{m.displayName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">{agg.mean}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">{agg.min}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">{agg.max}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">±{agg.stddev}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-charcoal">
                          {agg.max - agg.min}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
