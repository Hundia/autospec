import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { AnimatedCounter } from '../components/charts/AnimatedCounter'
import { ProgressRing } from '../components/charts/ProgressRing'
import { backlogData } from '../data/backlog'
import { specsManifest } from '../data/specs'
import type { BadgeVariant } from '../components/primitives/Badge'
import type { TicketStatus } from '../data/backlog'

const sprintData = backlogData.map(s => ({
  sprint: `S${s.number}`,
  points: s.totalPoints,
  tickets: s.tickets.length,
  status: s.status,
  number: s.number,
  theme: s.theme,
}))

const totalPoints = backlogData.reduce((sum, s) => sum + s.totalPoints, 0)
const totalTickets = backlogData.reduce((sum, s) => sum + s.tickets.length, 0)
const totalSprints = backlogData.length
const donePoints = backlogData.reduce((sum, s) =>
  sum + s.tickets.filter(t => t.status === 'done').reduce((ts, t) => ts + t.points, 0), 0)
const doneTickets = backlogData.reduce((sum, s) =>
  sum + s.tickets.filter(t => t.status === 'done').length, 0)
const todoTickets = totalTickets - doneTickets

const statusData = [
  { name: 'Done', value: doneTickets, color: '#22c55e' },
  { name: 'Planned', value: todoTickets, color: '#e5e7eb' },
]

const completionPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0

function statusToBadgeVariant(status: TicketStatus): BadgeVariant {
  switch (status) {
    case 'done': return 'done'
    case 'todo': return 'todo'
    case 'in-progress': return 'in-progress'
    case 'blocked': return 'blocked'
    case 'qa': return 'qa'
    default: return 'default'
  }
}

function statusLabel(status: TicketStatus): string {
  switch (status) {
    case 'done': return 'Done'
    case 'todo': return 'Planned'
    case 'in-progress': return 'In Progress'
    case 'blocked': return 'Blocked'
    case 'qa': return 'QA'
    default: return status
  }
}

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-light text-gray-900">MealMap Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Recipe &amp; Meal Planning App — Spec-Driven Development</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card variant="outlined">
          <CardContent>
            <AnimatedCounter value={totalPoints} label="Total Points" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <AnimatedCounter value={totalTickets} label="Total Tickets" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <AnimatedCounter value={totalSprints} label="Sprints" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <AnimatedCounter value={specsManifest.length} label="Role Specs" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="flex flex-col items-center">
            <ProgressRing value={donePoints} max={totalPoints} size={56} color="#22c55e" />
            <div className="text-xs text-gray-500 mt-2">{completionPct}% Done</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Points per Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sprintData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {sprintData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.status === 'done' ? '#22c55e' : entry.status === 'in-progress' ? '#f59e0b' : '#d1fae5'}
                      stroke={entry.status === 'todo' ? '#86efac' : undefined}
                      strokeWidth={entry.status === 'todo' ? 1.5 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-2">
              {statusData.map(({ name, color, value }) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-gray-600">{name} ({value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sprintData.map(({ sprint, points, tickets, status, theme }) => (
              <div
                key={sprint}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 px-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-900 font-medium">{sprint}</span>
                  <Badge variant={statusToBadgeVariant(status)}>
                    {statusLabel(status)}
                  </Badge>
                  <span className="text-xs text-brand-700 font-medium">{theme}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {tickets} tickets · {points} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
