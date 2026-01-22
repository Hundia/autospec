import React, { useState, useMemo } from 'react';
import { Filter, Search, LayoutGrid, List } from 'lucide-react';
import type { ProjectState, Ticket, TicketStatus } from '../../../types/index';
import { TicketCard, TicketList } from '../components/TicketCard';
import { StatusBadge } from '../components/Badges';

interface BacklogProps {
  state: ProjectState | null;
}

type ViewMode = 'board' | 'list';

const statusColumns: TicketStatus[] = ['todo', 'in-progress', 'qa-review', 'done', 'blocked'];

export default function Backlog({ state }: BacklogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSprint, setFilterSprint] = useState<number | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const sprints = state ? Array.from(state.sprints.values()) : [];
  const allTickets = useMemo(() => sprints.flatMap((s) => s.tickets), [sprints]);

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const matchesSearch =
        searchQuery === '' ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSprint =
        filterSprint === 'all' || ticket.sprintId === filterSprint;

      return matchesSearch && matchesSprint;
    });
  }, [allTickets, searchQuery, filterSprint]);

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<TicketStatus, Ticket[]> = {
      todo: [],
      'in-progress': [],
      'qa-review': [],
      done: [],
      blocked: [],
    };

    filteredTickets.forEach((ticket) => {
      grouped[ticket.status].push(ticket);
    });

    return grouped;
  }, [filteredTickets]);

  if (!state) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading backlog...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Backlog</h1>
          <p className="text-slate-400 mt-1">
            {filteredTickets.length} tickets across {sprints.length} sprints
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('board')}
            className={`p-2 rounded ${
              viewMode === 'board'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={filterSprint}
            onChange={(e) =>
              setFilterSprint(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
            }
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Sprints</option>
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                Sprint {sprint.id}: {sprint.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-5 gap-4">
          {statusColumns.map((status) => (
            <div key={status} className="sprint-lane">
              <div className="flex items-center justify-between mb-4">
                <StatusBadge status={status} size="md" />
                <span className="text-slate-400 text-sm">
                  {ticketsByStatus[status].length}
                </span>
              </div>
              <div className="space-y-3">
                {ticketsByStatus[status].map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => setSelectedTicket(ticket)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400 font-medium">ID</th>
                <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                <th className="text-left p-4 text-slate-400 font-medium">Sprint</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Owner</th>
                <th className="text-left p-4 text-slate-400 font-medium">Model</th>
                <th className="text-left p-4 text-slate-400 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-slate-700/50 hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <td className="p-4 font-mono text-sm text-slate-300">{ticket.id}</td>
                  <td className="p-4 text-white">{ticket.title}</td>
                  <td className="p-4 text-slate-400">Sprint {ticket.sprintId}</td>
                  <td className="p-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="p-4 text-slate-400">{ticket.owner}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ticket.model === 'haiku'
                          ? 'bg-emerald-900 text-emerald-300'
                          : ticket.model === 'opus'
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-blue-900 text-blue-300'
                      }`}
                    >
                      {ticket.model}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{ticket.storyPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="card max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header flex items-center justify-between">
              <span className="font-mono">#{selectedTicket.id}</span>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="card-body">
              <TicketCard ticket={selectedTicket} showDetails />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
