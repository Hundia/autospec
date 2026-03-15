import React, { useState } from 'react'
import { Actor, Message, ActivationBar } from '../../data/architecture'

interface SequenceDiagramProps {
  actors: Actor[]
  messages: Message[]
  activations?: ActivationBar[]
  title?: string
}

const defaultColors = ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac', '#166534']

export const SequenceDiagram: React.FC<SequenceDiagramProps> = ({
  actors, messages, activations = [], title,
}) => {
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null)

  const actorWidth = 130
  const msgHeight = 50
  const headerHeight = 70
  const footerHeight = 30
  const svgW = actors.length * actorWidth + 40
  const svgH = headerHeight + messages.length * msgHeight + footerHeight + 20

  const getActorX = (actorId: string) => {
    const idx = actors.findIndex(a => a.id === actorId)
    return idx * actorWidth + actorWidth / 2 + 20
  }

  return (
    <div>
      {title && <div className="text-sm font-medium text-brand-700 mb-3">{title}</div>}
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minHeight: Math.min(svgH, 500) }}>
          <defs>
            <marker id="seq-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#111827" />
            </marker>
            <marker id="seq-arrow-return" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
            </marker>
            <marker id="seq-arrow-async" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polyline points="0 0, 10 4, 0 8" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            </marker>
          </defs>

          {/* Actor headers */}
          {actors.map((actor, i) => {
            const x = getActorX(actor.id)
            const color = actor.color || defaultColors[i % defaultColors.length]
            return (
              <g key={actor.id}>
                <line
                  x1={x} y1={headerHeight}
                  x2={x} y2={svgH - footerHeight}
                  stroke="#e5e7eb" strokeWidth={1.5} strokeDasharray="6 4"
                />
                <rect
                  x={x - 52} y={12}
                  width={104} height={44}
                  rx={10} fill={color} stroke="none" opacity={0.9}
                />
                {actor.icon && (
                  <text x={x - 38} y={40} fontSize={16}>{actor.icon}</text>
                )}
                <text
                  x={actor.icon ? x + 4 : x}
                  y={38}
                  textAnchor="middle"
                  fontSize={11} fontWeight={600}
                  fill="white"
                  fontFamily="Inter, sans-serif"
                >
                  {actor.label}
                </text>
                <rect
                  x={x - 42} y={svgH - footerHeight}
                  width={84} height={24}
                  rx={6} fill={color} opacity={0.3}
                />
              </g>
            )
          })}

          {/* Activation bars */}
          {activations.map((bar, i) => {
            const x = getActorX(bar.actor)
            const startY = headerHeight + bar.startMsg * msgHeight + 5
            const endY = headerHeight + (bar.endMsg + 1) * msgHeight - 5
            const actorDef = actors.find(a => a.id === bar.actor)
            const color = actorDef?.color || '#22c55e'
            return (
              <rect
                key={i}
                x={x - 6} y={startY}
                width={12} height={endY - startY}
                rx={3} fill={color} opacity={0.15}
                stroke={color} strokeWidth={1}
              />
            )
          })}

          {/* Messages */}
          {messages.map((msg, i) => {
            const y = headerHeight + i * msgHeight + msgHeight / 2
            const fromX = getActorX(msg.from)
            const toX = getActorX(msg.to)
            const isHovered = hoveredMsg === i
            const isSelf = msg.type === 'self' || msg.from === msg.to

            if (isSelf) {
              const loopW = 40
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredMsg(i)}
                  onMouseLeave={() => setHoveredMsg(null)}
                  style={{ cursor: 'default' }}
                >
                  <path
                    d={`M ${fromX + 6} ${y} H ${fromX + loopW} V ${y + 20} H ${fromX + 6}`}
                    fill="none" stroke={isHovered ? '#16a34a' : '#111827'}
                    strokeWidth={isHovered ? 2 : 1.5}
                    markerEnd="url(#seq-arrow)"
                  />
                  <text
                    x={fromX + loopW + 8} y={y + 4}
                    fontSize={9} fill="#111827" fontFamily="Inter, sans-serif"
                    fontWeight={isHovered ? 600 : 400}
                  >
                    {msg.label}
                  </text>
                  {isHovered && msg.description && (
                    <foreignObject x={fromX + loopW + 4} y={y + 8} width={180} height={40}>
                      <div style={{ fontSize: 8, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                        {msg.description}
                      </div>
                    </foreignObject>
                  )}
                </g>
              )
            }

            const isReturn = msg.type === 'return'
            const isAsync = msg.type === 'async'
            const leftToRight = toX > fromX
            const startX = fromX + (leftToRight ? 8 : -8)
            const endX = toX + (leftToRight ? -8 : 8)

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredMsg(i)}
                onMouseLeave={() => setHoveredMsg(null)}
                style={{ cursor: 'default' }}
              >
                <line
                  x1={startX} y1={y} x2={endX} y2={y}
                  stroke={isHovered ? '#16a34a' : isReturn ? '#9ca3af' : '#111827'}
                  strokeWidth={isHovered ? 2 : 1.5}
                  strokeDasharray={isReturn ? '6 3' : isAsync ? '4 2' : undefined}
                  markerEnd={isReturn ? 'url(#seq-arrow-return)' : isAsync ? 'url(#seq-arrow-async)' : 'url(#seq-arrow)'}
                />
                <rect
                  x={(startX + endX) / 2 - msg.label.length * 3}
                  y={y - 16}
                  width={msg.label.length * 6 + 12}
                  height={14}
                  rx={4}
                  fill={isHovered ? '#f0fdf4' : 'transparent'}
                  stroke={isHovered ? '#dcfce7' : 'none'}
                />
                <text
                  x={(startX + endX) / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={isHovered ? 600 : 400}
                  fill={isReturn ? '#9ca3af' : '#111827'}
                  fontFamily="Inter, sans-serif"
                >
                  {msg.label}
                </text>
                {isHovered && msg.description && (
                  <foreignObject
                    x={Math.min(startX, endX)}
                    y={y + 4}
                    width={Math.abs(endX - startX)}
                    height={30}
                  >
                    <div style={{
                      fontSize: 8, color: '#6b7280', textAlign: 'center',
                      fontFamily: 'Inter, sans-serif', padding: '2px 4px',
                    }}>
                      {msg.description}
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
