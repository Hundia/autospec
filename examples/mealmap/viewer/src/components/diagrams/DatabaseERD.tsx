import React, { useState } from 'react'
import { DBTable, DBRelationship } from '../../data/architecture'

interface DatabaseERDProps {
  tables: DBTable[]
  relationships: DBRelationship[]
  title?: string
}

// Manual layout positions for 6 tables
const tablePositions: Record<string, { x: number; y: number }> = {
  users: { x: 30, y: 20 },
  recipes: { x: 250, y: 20 },
  ingredients: { x: 500, y: 20 },
  recipe_ingredients: { x: 380, y: 250 },
  meal_plans: { x: 30, y: 250 },
  meal_plan_entries: { x: 170, y: 430 },
}

export const DatabaseERD: React.FC<DatabaseERDProps> = ({ tables, relationships, title }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const tableWidth = 200
  const rowHeight = 20
  const headerHeight = 32

  const getTableHeight = (t: DBTable) => headerHeight + t.columns.length * rowHeight + 8

  const getRelPath = (rel: DBRelationship) => {
    const fromPos = tablePositions[rel.from]
    const toPos = tablePositions[rel.to]
    if (!fromPos || !toPos) return ''

    const fromTable = tables.find(t => t.name === rel.from)
    const toTable = tables.find(t => t.name === rel.to)
    const fromH = fromTable ? getTableHeight(fromTable) : 100
    const toH = toTable ? getTableHeight(toTable) : 100

    // Determine best connection points
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y

    let sx: number, sy: number, ex: number, ey: number

    if (Math.abs(dy) > Math.abs(dx)) {
      // Vertical connection
      if (dy > 0) {
        sx = fromPos.x + tableWidth / 2
        sy = fromPos.y + fromH
        ex = toPos.x + tableWidth / 2
        ey = toPos.y
      } else {
        sx = fromPos.x + tableWidth / 2
        sy = fromPos.y
        ex = toPos.x + tableWidth / 2
        ey = toPos.y + toH
      }
    } else {
      // Horizontal connection
      if (dx > 0) {
        sx = fromPos.x + tableWidth
        sy = fromPos.y + fromH / 2
        ex = toPos.x
        ey = toPos.y + toH / 2
      } else {
        sx = fromPos.x
        sy = fromPos.y + fromH / 2
        ex = toPos.x + tableWidth
        ey = toPos.y + toH / 2
      }
    }

    const mx = (sx + ex) / 2
    return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`
  }

  const isRelHighlighted = (rel: DBRelationship) =>
    selectedTable === rel.from || selectedTable === rel.to

  const svgW = 730
  const svgH = 600

  return (
    <div>
      {title && <div className="text-sm font-medium text-brand-700 mb-3">{title}</div>}
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minHeight: 500 }}>
          <defs>
            <marker id="erd-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#22c55e" />
            </marker>
            <marker id="erd-arrow-dim" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#d1d5db" />
            </marker>
            <filter id="erd-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Relationships */}
          {relationships.map((rel, i) => {
            const highlighted = isRelHighlighted(rel)
            const dimmed = selectedTable && !highlighted
            return (
              <g key={i}>
                <path
                  d={getRelPath(rel)}
                  fill="none"
                  stroke={dimmed ? '#e5e7eb' : highlighted ? '#22c55e' : '#9ca3af'}
                  strokeWidth={highlighted ? 2.5 : 1.5}
                  strokeDasharray={rel.type === 'M:N' ? '6 3' : undefined}
                  markerEnd={dimmed ? 'url(#erd-arrow-dim)' : 'url(#erd-arrow)'}
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Hidden path for textPath */}
                <path id={`rel-path-${i}`} d={getRelPath(rel)} fill="none" stroke="none" />
                {rel.label && (
                  <text
                    x={0} y={0}
                    fontSize={8}
                    fill={dimmed ? '#d1d5db' : '#6b7280'}
                    fontFamily="Inter, sans-serif"
                    fontStyle="italic"
                  >
                    <textPath href={`#rel-path-${i}`} startOffset="50%" textAnchor="middle">
                      {rel.label}
                    </textPath>
                  </text>
                )}
                {/* Cardinality labels */}
                {(() => {
                  const path = getRelPath(rel)
                  const match = path.match(/M ([\d.]+) ([\d.]+)/)
                  const matchEnd = path.match(/([\d.]+) ([\d.]+)$/)
                  if (!match || !matchEnd) return null
                  const sx = parseFloat(match[1])
                  const sy = parseFloat(match[2])
                  const ex = parseFloat(matchEnd[1])
                  const ey = parseFloat(matchEnd[2])
                  const fromLabel = rel.type === '1:N' || rel.type === '1:1' ? '1' : 'N'
                  const toLabel = rel.type === '1:N' ? 'N' : rel.type === 'N:1' ? '1' : rel.type === 'M:N' ? 'N' : '1'
                  return (
                    <>
                      <text x={sx + 8} y={sy - 6} fontSize={9} fontWeight={700} fill={dimmed ? '#d1d5db' : '#22c55e'} fontFamily="JetBrains Mono, monospace">{fromLabel}</text>
                      <text x={ex - 14} y={ey - 6} fontSize={9} fontWeight={700} fill={dimmed ? '#d1d5db' : '#22c55e'} fontFamily="JetBrains Mono, monospace">{toLabel}</text>
                    </>
                  )
                })()}
              </g>
            )
          })}

          {/* Tables */}
          {tables.map(table => {
            const pos = tablePositions[table.name]
            if (!pos) return null
            const isSelected = selectedTable === table.name
            const isConnected = selectedTable
              ? relationships.some(r => (r.from === selectedTable && r.to === table.name) || (r.to === selectedTable && r.from === table.name))
              : false
            const dimmed = selectedTable && !isSelected && !isConnected
            const h = getTableHeight(table)

            return (
              <g
                key={table.name}
                onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}
                style={{ cursor: 'pointer', opacity: dimmed ? 0.35 : 1, transition: 'opacity 0.2s' }}
              >
                {/* Table body */}
                <rect
                  x={pos.x} y={pos.y} width={tableWidth} height={h}
                  rx={8} fill="white"
                  stroke={isSelected ? '#22c55e' : '#e5e7eb'}
                  strokeWidth={isSelected ? 2 : 1}
                  filter="url(#erd-shadow)"
                />
                {/* Header */}
                <rect
                  x={pos.x} y={pos.y} width={tableWidth} height={headerHeight}
                  rx={8} fill={table.color} opacity={0.15}
                />
                <rect
                  x={pos.x} y={pos.y + headerHeight - 4} width={tableWidth} height={4}
                  fill={table.color} opacity={0.15}
                />
                <text
                  x={pos.x + tableWidth / 2} y={pos.y + 21}
                  textAnchor="middle" fontSize={12} fontWeight={700}
                  fill="#111827" fontFamily="JetBrains Mono, monospace"
                >
                  {table.name}
                </text>
                {/* Columns */}
                {table.columns.map((col, ci) => {
                  const cy = pos.y + headerHeight + ci * rowHeight + 15
                  const isPK = col.constraint === 'PK'
                  const isFK = col.constraint?.startsWith('FK')
                  return (
                    <g key={col.name}>
                      {isPK && (
                        <text x={pos.x + 8} y={cy} fontSize={8} fill="#f59e0b" fontFamily="Inter, sans-serif">{'\u{1F511}'}</text>
                      )}
                      {isFK && (
                        <text x={pos.x + 8} y={cy} fontSize={8} fill="#3b82f6" fontFamily="Inter, sans-serif">{'\u{1F517}'}</text>
                      )}
                      <text
                        x={pos.x + 22} y={cy}
                        fontSize={10} fill="#374151"
                        fontWeight={isPK ? 600 : 400}
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {col.name}
                      </text>
                      <text
                        x={pos.x + tableWidth - 8} y={cy}
                        textAnchor="end" fontSize={9} fill="#9ca3af"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {col.type}
                      </text>
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected table detail */}
      {selectedTable && (() => {
        const table = tables.find(t => t.name === selectedTable)
        if (!table) return null
        const rels = relationships.filter(r => r.from === selectedTable || r.to === selectedTable)
        return (
          <div className="mt-3 p-4 bg-brand-50 border border-brand-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm font-bold text-gray-900">{table.name}</span>
              <span className="text-xs text-gray-500">{table.columns.length} columns</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rels.map((rel, i) => {
                const other = rel.from === selectedTable ? rel.to : rel.from
                const direction = rel.from === selectedTable ? 'has' : 'belongs to'
                return (
                  <span key={i} className="text-xs px-2 py-1 bg-white border border-brand-200 rounded-full">
                    {direction} <span className="font-mono font-medium">{other}</span> ({rel.type})
                  </span>
                )
              })}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
