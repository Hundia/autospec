import React, { useState } from 'react'
import type { QualityGate, GateResult, BenchmarkCategory, GateStatus } from '../../data/benchmark'

interface HeatmapModel {
  name: string
  color: string
  gates: Record<string, GateResult>
}

interface GateHeatmapProps {
  models: HeatmapModel[]
  qualityGates: QualityGate[]
  categories: BenchmarkCategory[]
}

interface HoverState {
  gateId: string
  modelIdx: number
  x: number
  y: number
}

const GATE_HEIGHT = 26
const CATEGORY_HEADER_HEIGHT = 28
const COL_WIDTH = 80
const COL_GAP = 4
const LABEL_WIDTH = 100
const PADDING = 8

function getCellColor(_gate: QualityGate, result: GateResult, modelColor: string): string {
  if (result.status === 'skipped') return '#e8e4d8'
  if (result.status === 'fail') return 'rgba(142, 106, 89, 0.7)' // terracotta 0.7
  if (result.status === 'pass') return modelColor

  // graded: score 1 = 0.33, score 2 = 0.67, score 3 = 1.0
  if (result.status === 'graded') {
    const opacity = result.score === 1 ? 0.33 : result.score === 2 ? 0.67 : 1.0
    // Convert hex to rgba
    const hex = modelColor.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return '#e8e4d8'
}

function statusLabel(status: GateStatus): string {
  switch (status) {
    case 'pass': return 'Pass'
    case 'fail': return 'Fail'
    case 'graded': return 'Graded'
    case 'skipped': return 'Skipped'
  }
}

function statusBadgeStyle(status: GateStatus): React.CSSProperties {
  switch (status) {
    case 'pass': return { backgroundColor: '#698472', color: '#faf9f5' }
    case 'fail': return { backgroundColor: '#8e6a59', color: '#faf9f5' }
    case 'graded': return { backgroundColor: '#f59e0b22', color: '#92400e' }
    case 'skipped': return { backgroundColor: '#e8e4d8', color: '#7a6a54' }
  }
}

export const GateHeatmap: React.FC<GateHeatmapProps> = ({ models, qualityGates, categories }) => {
  const [hovered, setHovered] = useState<HoverState | null>(null)

  // Build layout: category header + gates per category
  type RowItem =
    | { type: 'category'; category: BenchmarkCategory; y: number }
    | { type: 'gate'; gate: QualityGate; y: number }

  const rows: RowItem[] = []
  let currentY = PADDING

  for (const cat of categories) {
    rows.push({ type: 'category', category: cat, y: currentY })
    currentY += CATEGORY_HEADER_HEIGHT

    const catGates = qualityGates.filter(g => g.category === cat.id)
    for (const gate of catGates) {
      rows.push({ type: 'gate', gate, y: currentY })
      currentY += GATE_HEIGHT
    }
  }

  const totalHeight = currentY + PADDING
  const svgWidth = LABEL_WIDTH + models.length * (COL_WIDTH + COL_GAP)

  const hoveredGate = hovered ? qualityGates.find(g => g.id === hovered.gateId) : null
  const hoveredResult = hovered && hoveredGate ? models[hovered.modelIdx]?.gates[hovered.gateId] : null

  return (
    <div className="relative">
      {/* Model name headers */}
      <div className="flex items-center mb-2" style={{ marginLeft: LABEL_WIDTH }}>
        {models.map((m, i) => (
          <div
            key={m.name}
            className="text-xs font-medium text-center text-charcoal"
            style={{ width: COL_WIDTH, marginRight: i < models.length - 1 ? COL_GAP : 0 }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: m.color, display: 'inline-block', verticalAlign: 'middle', marginBottom: 2 }}
            />
            {m.name}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={totalHeight} style={{ display: 'block' }}>
          {/* Diagonal stripe pattern for skipped */}
          <defs>
            <pattern id="diag-skip" patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(45)">
              <line x1={0} y1={0} x2={0} y2={8} stroke="#c8c0aa" strokeWidth={2} />
            </pattern>
          </defs>

          {rows.map(row => {
            if (row.type === 'category') {
              const cat = row.category
              return (
                <g key={`cat-${cat.id}`}>
                  <rect
                    x={0}
                    y={row.y}
                    width={svgWidth}
                    height={CATEGORY_HEADER_HEIGHT - 2}
                    fill={cat.color}
                    fillOpacity={0.15}
                    rx={4}
                  />
                  <text
                    x={8}
                    y={row.y + CATEGORY_HEADER_HEIGHT / 2 + 4}
                    fontSize={11}
                    fontWeight={600}
                    fill={cat.color}
                    fontFamily="Inter, sans-serif"
                  >
                    {cat.label}
                  </text>
                  <text
                    x={LABEL_WIDTH - 8}
                    y={row.y + CATEGORY_HEADER_HEIGHT / 2 + 4}
                    fontSize={9}
                    fill={cat.color}
                    fillOpacity={0.7}
                    textAnchor="end"
                    fontFamily="Inter, sans-serif"
                  >
                    weight {cat.weight}%
                  </text>
                </g>
              )
            }

            // Gate row
            const gate = row.gate
            const cellY = row.y + 2
            const cellHeight = GATE_HEIGHT - 4

            return (
              <g key={`gate-${gate.id}`}>
                {/* Gate ID label */}
                <text
                  x={LABEL_WIDTH - 8}
                  y={row.y + GATE_HEIGHT / 2 + 4}
                  fontSize={10}
                  fill="#574b3b"
                  textAnchor="end"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {gate.id}
                </text>

                {/* Model cells */}
                {models.map((model, mi) => {
                  const result = model.gates[gate.id]
                  if (!result) return null
                  const cellX = LABEL_WIDTH + mi * (COL_WIDTH + COL_GAP)
                  const isSkipped = result.status === 'skipped'
                  const isHovering = hovered?.gateId === gate.id && hovered?.modelIdx === mi

                  return (
                    <g key={`${gate.id}-${mi}`}>
                      <rect
                        x={cellX}
                        y={cellY}
                        width={COL_WIDTH}
                        height={cellHeight}
                        fill={isSkipped ? 'url(#diag-skip)' : getCellColor(gate, result, model.color)}
                        rx={3}
                        stroke={isHovering ? '#574b3b' : 'transparent'}
                        strokeWidth={isHovering ? 1.5 : 0}
                        style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                        onMouseEnter={e => {
                          const rect = (e.target as SVGRectElement).getBoundingClientRect()
                          const container = (e.target as SVGRectElement).closest('.relative')?.getBoundingClientRect()
                          setHovered({
                            gateId: gate.id,
                            modelIdx: mi,
                            x: rect.left - (container?.left || 0) + rect.width / 2,
                            y: rect.top - (container?.top || 0),
                          })
                        }}
                        onMouseLeave={() => setHovered(null)}
                      />
                      {/* Score label inside cell for graded */}
                      {result.status === 'graded' && (
                        <text
                          x={cellX + COL_WIDTH / 2}
                          y={cellY + cellHeight / 2 + 4}
                          fontSize={9}
                          fill="#fff"
                          textAnchor="middle"
                          fontFamily="Inter, sans-serif"
                          fontWeight={600}
                          style={{ pointerEvents: 'none' }}
                        >
                          {result.score}/{result.maxScore}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hovered && hoveredGate && hoveredResult && (
        <div
          className="absolute bg-cream border border-sand rounded-lg shadow-soft p-3 text-xs z-10 w-60 pointer-events-none"
          style={{
            left: Math.min(hovered.x, svgWidth - 240),
            top: hovered.y - 8,
            transform: 'translateY(-100%)',
          }}
        >
          <div className="font-mono font-semibold text-terracotta mb-1">{hoveredGate.id}</div>
          <div className="text-charcoal leading-relaxed mb-2">{hoveredGate.description}</div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full font-medium"
              style={statusBadgeStyle(hoveredResult.status)}
            >
              {statusLabel(hoveredResult.status)}
            </span>
            {hoveredResult.maxScore > 0 && (
              <span className="text-sand-600">
                {hoveredResult.score} / {hoveredResult.maxScore}
              </span>
            )}
          </div>
          {hoveredResult.details && (
            <div className="text-sand-600 italic">{hoveredResult.details}</div>
          )}
          <div className="mt-1 text-sand-500">
            Model: {models[hovered.modelIdx]?.name}
          </div>
        </div>
      )}
    </div>
  )
}
