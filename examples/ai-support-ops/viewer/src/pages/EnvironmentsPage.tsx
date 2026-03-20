import React from 'react'
import { Card, CardContent } from '../components/primitives/Card'
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
