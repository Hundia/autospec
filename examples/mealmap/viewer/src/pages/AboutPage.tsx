import React from 'react'
import { appDescription, personas, featureEpics, techStack } from '../data/about'
import { Card } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Link } from 'react-router-dom'

const statusColors: Record<string, string> = {
  done: 'done',
  'in-progress': 'in-progress',
  planned: 'todo',
}

export const AboutPage: React.FC = () => {
  const categoryGroups = techStack.reduce<Record<string, typeof techStack>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full opacity-20 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500 rounded-full opacity-10 translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="text-sm font-medium text-brand-200 uppercase tracking-wider mb-2">Spec-Driven Development</div>
          <h1 className="text-4xl font-light mb-2">{appDescription.name}</h1>
          <p className="text-xl text-brand-100 font-light mb-4">{appDescription.tagline}</p>
          <p className="text-sm text-brand-200 max-w-2xl leading-relaxed">{appDescription.summary}</p>
        </div>
      </div>

      {/* Problem Statement */}
      <Card variant="outlined">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">The Problem</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{appDescription.problem}</p>
        </div>
      </Card>

      {/* Personas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Personas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personas.map(persona => (
            <Card key={persona.name} variant="elevated">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-2xl">
                    {persona.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{persona.name}</div>
                    <div className="text-xs text-gray-500">{persona.role}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-medium text-brand-700 uppercase tracking-wider mb-2">Goals</div>
                  <ul className="space-y-1">
                    {persona.goals.map((g, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-brand-500 mt-0.5">&#x2713;</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2">Frustrations</div>
                  <ul className="space-y-1">
                    {persona.frustrations.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">&#x2717;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Epics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Epics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureEpics.map(epic => (
            <Card key={epic.id} variant="outlined" hoverable>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{epic.icon}</span>
                    <span className="text-xs font-mono text-gray-400">{epic.id}</span>
                  </div>
                  <Badge variant={statusColors[epic.status] as 'done' | 'in-progress' | 'todo'} size="sm">
                    {epic.status === 'done' ? 'Complete' : epic.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{epic.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{epic.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryGroups).map(([category, items]) => (
            <Card key={category} variant="outlined">
              <div className="p-4">
                <div className="text-xs font-medium text-brand-700 uppercase tracking-wider mb-3">{category}</div>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        {item.version && <span className="text-xs text-gray-400 ml-1">v{item.version}</span>}
                      </div>
                      <span className="text-xs text-gray-500">{item.purpose}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-3 pt-4">
        <Link to="/specs" className="text-sm px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          View Specs
        </Link>
        <Link to="/docs" className="text-sm px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Browse Docs
        </Link>
        <Link to="/architecture" className="text-sm px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Architecture
        </Link>
      </div>
    </div>
  )
}
