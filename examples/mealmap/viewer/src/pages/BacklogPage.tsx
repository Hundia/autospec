import React, { useState } from 'react'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { backlogData, type TicketStatus, type Sprint } from '../data/backlog'

const statusColumns: { status: TicketStatus; label: string; emoji: string }[] = [
  { status: 'todo', label: 'Todo', emoji: '🔲' },
  { status: 'in-progress', label: 'In Progress', emoji: '🔄' },
  { status: 'qa', label: 'QA Review', emoji: '🧪' },
  { status: 'done', label: 'Done', emoji: '✅' },
  { status: 'blocked', label: 'Blocked', emoji: '❌' },
]

const statusVariant: Record<TicketStatus, BadgeVariantKey> = {
  todo: 'todo',
  'in-progress': 'in-progress',
  qa: 'qa',
  done: 'done',
  blocked: 'blocked',
}

type BadgeVariantKey = 'todo' | 'in-progress' | 'qa' | 'done' | 'blocked'

function TicketCard({ ticket }: { ticket: Sprint['tickets'][0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-subtle">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-gray-400 mb-0.5">{ticket.id}</div>
          <div className="text-sm text-gray-800 leading-snug">{ticket.title}</div>
          {ticket.dependencies.length > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              Deps: {ticket.dependencies.join(', ')}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge variant={statusVariant[ticket.status]} size="sm">
            {ticket.points}pt
          </Badge>
          <div className="text-xs text-gray-400">{ticket.owner}</div>
        </div>
      </div>
    </div>
  )
}

export const BacklogPage: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')

  const allTickets = backlogData.flatMap(sprint =>
    sprint.tickets.map(t => ({ ...t, sprint: sprint.name }))
  )

  const totalPoints = backlogData.reduce((sum, s) => sum + s.totalPoints, 0)
  const donePoints = backlogData
    .filter(s => s.status === 'done')
    .reduce((sum, s) => sum + s.totalPoints, 0)

  if (view === 'table') {
    return (
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Backlog</h2>
            <p className="text-sm text-gray-500 mt-1">{totalPoints} pts total · {donePoints} done</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('kanban')} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Kanban</button>
            <button onClick={() => setView('table')} className="px-3 py-1.5 text-sm rounded-lg bg-brand-500 text-white">Table</button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Sprint</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Owner</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Pts</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {allTickets.map(ticket => (
                  <tr key={ticket.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{ticket.id}</td>
                    <td className="px-4 py-2.5 text-gray-800">{ticket.title}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{ticket.sprint}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{ticket.owner}</td>
                    <td className="px-4 py-2.5 text-gray-800">{ticket.points}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={statusVariant[ticket.status]} size="sm">
                        {ticket.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Kanban view
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-gray-900">Backlog</h2>
          <p className="text-sm text-gray-500 mt-1">{totalPoints} pts total · {donePoints} done</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('kanban')} className="px-3 py-1.5 text-sm rounded-lg bg-brand-500 text-white">Kanban</button>
          <button onClick={() => setView('table')} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Table</button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map(col => {
          const tickets = allTickets.filter(t => t.status === col.status)
          return (
            <div key={col.status} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <span>{col.emoji}</span>
                <span className="text-sm font-medium text-gray-800">{col.label}</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {tickets.length}
                </span>
              </div>
              <div className="min-h-32">
                {tickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-300 border-2 border-dashed border-gray-200 rounded-lg">
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
