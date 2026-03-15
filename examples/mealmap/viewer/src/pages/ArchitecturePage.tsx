import React, { useState } from 'react'
import { Card } from '../components/primitives/Card'
import { SystemDiagram } from '../components/diagrams/SystemDiagram'
import { DatabaseERD } from '../components/diagrams/DatabaseERD'
import { SequenceDiagram } from '../components/diagrams/SequenceDiagram'
import { FlowDiagram } from '../components/diagrams/FlowDiagram'
import {
  systemNodes, systemEdges,
  dbTables, dbRelationships,
  sequenceFlows,
  requestLifecycleSteps, requestLifecycleConnections,
} from '../data/architecture'

const tabs = [
  { id: 'system', label: 'System', icon: '\u{1F3D7}\uFE0F' },
  { id: 'database', label: 'Database', icon: '\u{1F5C4}\uFE0F' },
  { id: 'flows', label: 'Flows', icon: '\u{1F504}' },
  { id: 'lifecycle', label: 'Request Lifecycle', icon: '\u26A1' },
] as const

type TabId = typeof tabs[number]['id']

export const ArchitecturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('system')
  const [activeFlow, setActiveFlow] = useState<string>(sequenceFlows[0]?.id || '')

  const selectedFlow = sequenceFlows.find(f => f.id === activeFlow)

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <SystemDiagram nodes={systemNodes} edges={systemEdges} title="System Architecture" />

          {/* Tech Stack Cards */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'Zustand'], color: 'bg-green-50 border-green-200' },
                { label: 'Backend', items: ['Express', 'TypeScript', 'Zod', 'JWT'], color: 'bg-emerald-50 border-emerald-200' },
                { label: 'Database', items: ['PostgreSQL 15', 'Drizzle ORM', 'Migrations'], color: 'bg-blue-50 border-blue-200' },
                { label: 'Testing', items: ['Vitest', 'Supertest', '70% coverage'], color: 'bg-amber-50 border-amber-200' },
              ].map(group => (
                <div key={group.label} className={`p-3 rounded-lg border ${group.color}`}>
                  <div className="text-xs font-semibold text-gray-700 mb-2">{group.label}</div>
                  {group.items.map(item => (
                    <div key={item} className="text-xs text-gray-600 py-0.5">{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Database Tab */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <DatabaseERD tables={dbTables} relationships={dbRelationships} title="Entity Relationship Diagram" />

          {/* Table Summary Cards */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Table Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dbTables.map(table => (
                <Card key={table.name} variant="outlined" hoverable>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: table.color }} />
                      <span className="font-mono text-sm font-semibold text-gray-900">{table.name}</span>
                    </div>
                    <div className="space-y-1">
                      {table.columns.map(col => (
                        <div key={col.name} className="flex items-center justify-between text-xs">
                          <span className="font-mono text-gray-700">
                            {col.constraint === 'PK' ? '\u{1F511} ' : col.constraint?.startsWith('FK') ? '\u{1F517} ' : '   '}
                            {col.name}
                          </span>
                          <span className="text-gray-400">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flows Tab */}
      {activeTab === 'flows' && (
        <div className="space-y-4">
          {/* Flow Selector */}
          <div className="flex gap-2">
            {sequenceFlows.map(flow => (
              <button
                key={flow.id}
                onClick={() => setActiveFlow(flow.id)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeFlow === flow.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {flow.title}
              </button>
            ))}
          </div>

          {selectedFlow && (
            <>
              <div className="text-sm text-gray-500">{selectedFlow.description}</div>
              <SequenceDiagram
                actors={selectedFlow.actors}
                messages={selectedFlow.messages}
                activations={selectedFlow.activations}
              />
            </>
          )}
        </div>
      )}

      {/* Request Lifecycle Tab */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-6">
          <FlowDiagram
            steps={requestLifecycleSteps}
            connections={requestLifecycleConnections}
            title="Request Processing Pipeline"
          />

          {/* Step Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requestLifecycleSteps.map((step, i) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{step.label}</div>
                    {step.description && (
                      <div className="text-xs text-gray-500">{step.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
