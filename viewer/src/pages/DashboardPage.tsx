import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'

const sprintData = [
  { sprint: 'S0', points: 38, tickets: 8, status: 'done' },
  { sprint: 'S1', points: 33, tickets: 7, status: 'in-progress' },
  { sprint: 'S2', points: 32, tickets: 5, status: 'todo' },
  { sprint: 'S3', points: 32, tickets: 5, status: 'todo' },
  { sprint: 'S4', points: 26, tickets: 4, status: 'todo' },
  { sprint: 'S5', points: 26, tickets: 5, status: 'todo' },
]

const statusData = [
  { name: 'Done', value: 8, color: '#698472' },
  { name: 'In Progress', value: 7, color: '#b08a79' },
  { name: 'Todo', value: 19, color: '#d8d0ba' },
]

function AnimatedCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-charcoal">{value}</div>
      <div className="text-xs text-sand-600 mt-1">{label}</div>
    </div>
  )
}

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-light text-charcoal">AutoSpec Overview</h2>
        <p className="text-sm text-sand-600 mt-1">Spec-Driven Development Framework</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={187} label="Total Points" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={34} label="Total Tickets" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={6} label="Sprints" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={10} label="Role Specs" />
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
                <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: '#b8a890' }} />
                <YAxis tick={{ fontSize: 12, fill: '#b8a890' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: '8px' }}
                />
                <Bar dataKey="points" fill="#698472" radius={[4, 4, 0, 0]} />
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
                <Tooltip contentStyle={{ backgroundColor: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-2">
              {statusData.map(({ name, color, value }) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sand-600">{name} ({value})</span>
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
            {sprintData.map(({ sprint, points, tickets, status }) => (
              <div key={sprint} className="flex items-center justify-between py-2 border-b border-sand last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-charcoal font-medium">{sprint}</span>
                  <Badge variant={status as 'done' | 'in-progress' | 'todo'}>
                    {status === 'done' ? '✅ Done' : status === 'in-progress' ? '🔄 In Progress' : '🔲 Todo'}
                  </Badge>
                </div>
                <div className="text-sm text-sand-600">
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
