import React from 'react'
import { Card, CardContent } from '../components/primitives/Card'
import { specsManifest } from '../data/specs'

const ownerColors: Record<string, string> = {
  PM: 'bg-purple-100 text-purple-700',
  Backend: 'bg-blue-100 text-blue-700',
  Frontend: 'bg-green-100 text-green-700',
  DB: 'bg-amber-100 text-amber-700',
  QA: 'bg-red-100 text-red-700',
}

export const SpecsPage: React.FC = () => {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Role Specs</h2>
        <p className="text-sm text-gray-500 mt-1">{specsManifest.length} role specifications driving MealMap development</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specsManifest.map(spec => (
          <Card key={spec.slug} variant="outlined" hoverable>
            <CardContent>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl font-light text-brand-500">{spec.number}</div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ownerColors[spec.owner] ?? 'bg-gray-100 text-gray-600'}`}>
                  {spec.owner}
                </span>
              </div>
              <div className="text-base font-semibold text-gray-900 mb-2">{spec.title}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{spec.description}</p>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <code className="text-xs text-gray-400 font-mono">
                  specs/{spec.slug}.md
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
