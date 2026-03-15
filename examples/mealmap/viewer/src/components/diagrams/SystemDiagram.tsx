import React, { useState } from 'react'
import { SystemNode, SystemEdge } from '../../data/architecture'

interface SystemDiagramProps {
  nodes: SystemNode[]
  edges: SystemEdge[]
  title?: string
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({ nodes, edges, title }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const svgW = 700
  const svgH = 540

  const isConnected = (nodeId: string) =>
    edges.some(e => (e.from === hoveredNode && e.to === nodeId) || (e.to === hoveredNode && e.from === nodeId))

  return (
    <div>
      {title && <div className="text-sm font-medium text-brand-700 mb-3">{title}</div>}
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto p-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: svgH }}>
          <defs>
            <marker id="sys-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
            </marker>
            <marker id="sys-arrow-dim" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#d1d5db" />
            </marker>
            <filter id="sys-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
            </filter>
            <linearGradient id="grad-client" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#dcfce7" />
            </linearGradient>
            <linearGradient id="grad-data" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
          </defs>

          {/* Layer backgrounds */}
          <rect x={20} y={5} width={660} height={250} rx={12} fill="url(#grad-client)" opacity={0.4} />
          <text x={35} y={25} fontSize={10} fill="#16a34a" fontWeight={600} fontFamily="Inter, sans-serif">CLIENT LAYER</text>

          <rect x={20} y={260} width={660} height={100} rx={12} fill="#f0fdf4" opacity={0.4} />
          <text x={35} y={278} fontSize={10} fill="#16a34a" fontWeight={600} fontFamily="Inter, sans-serif">APPLICATION LAYER</text>

          <rect x={20} y={365} width={660} height={160} rx={12} fill="url(#grad-data)" opacity={0.4} />
          <text x={35} y={383} fontSize={10} fill="#1d4ed8" fontWeight={600} fontFamily="Inter, sans-serif">DATA LAYER</text>

          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            if (!fromNode || !toNode) return null

            const highlighted = hoveredNode === edge.from || hoveredNode === edge.to
            const dimmed = hoveredNode && !highlighted

            const fromCx = fromNode.x + fromNode.width / 2
            const fromCy = fromNode.y + fromNode.height
            const toCx = toNode.x + toNode.width / 2
            const toCy = toNode.y

            // Horizontal connections for middleware
            const isHorizontal = Math.abs(fromNode.y - toNode.y) < 20
            let d: string
            if (isHorizontal) {
              const fromRight = fromNode.x + fromNode.width
              const toLeft = toNode.x
              const startX = fromRight < toLeft ? fromRight : fromNode.x
              const endX = fromRight < toLeft ? toLeft : toNode.x + toNode.width
              const midY = fromNode.y + fromNode.height / 2
              d = `M ${startX} ${midY} L ${endX} ${midY}`
            } else {
              const my = (fromCy + toCy) / 2
              d = `M ${fromCx} ${fromCy} C ${fromCx} ${my}, ${toCx} ${my}, ${toCx} ${toCy}`
            }

            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={dimmed ? '#e5e7eb' : highlighted ? '#22c55e' : '#9ca3af'}
                  strokeWidth={highlighted ? 2.5 : 1.5}
                  strokeDasharray={edge.style === 'dashed' ? '6 3' : undefined}
                  markerEnd={dimmed ? 'url(#sys-arrow-dim)' : 'url(#sys-arrow)'}
                  style={{ transition: 'all 0.2s' }}
                />
                {edge.label && (
                  <text
                    x={(fromCx + toCx) / 2 + (isHorizontal ? 0 : 10)}
                    y={isHorizontal ? (fromNode.y + fromNode.height / 2 - 8) : (fromCy + toCy) / 2}
                    textAnchor="middle"
                    fontSize={9}
                    fill={dimmed ? '#d1d5db' : '#6b7280'}
                    fontFamily="Inter, sans-serif"
                    style={{ transition: 'all 0.2s' }}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isHovered = hoveredNode === node.id
            const connected = hoveredNode ? isConnected(node.id) : false
            const dimmed = hoveredNode && !isHovered && !connected
            const opacity = dimmed ? 0.35 : 1

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s', opacity }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={10}
                  fill={node.color}
                  stroke={isHovered ? '#22c55e' : '#d1d5db'}
                  strokeWidth={isHovered ? 2 : 1}
                  filter="url(#sys-shadow)"
                />
                {node.icon && (
                  <text x={node.x + 12} y={node.y + node.height / 2 + 5} fontSize={18}>
                    {node.icon}
                  </text>
                )}
                <text
                  x={node.x + (node.icon ? 36 : node.width / 2)}
                  y={node.y + (node.sublabel ? 20 : node.height / 2 + 4)}
                  textAnchor={node.icon ? 'start' : 'middle'}
                  fontSize={11}
                  fontWeight={600}
                  fill="#111827"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text
                    x={node.x + (node.icon ? 36 : node.width / 2)}
                    y={node.y + 35}
                    textAnchor={node.icon ? 'start' : 'middle'}
                    fontSize={9}
                    fill="#6b7280"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.sublabel}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
