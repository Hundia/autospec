import React from 'react';
import { Clock, User, Link2, Hash } from 'lucide-react';
import type { Ticket } from '../../../types/index';
import { StatusBadge, ModelBadge, RoleBadge } from './Badges';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  showDetails?: boolean;
}

export function TicketCard({ ticket, onClick, showDetails = false }: TicketCardProps) {
  return (
    <div
      className={`ticket-card p-4 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-sm">#{ticket.id}</span>
          <StatusBadge status={ticket.status} />
        </div>
        <ModelBadge model={ticket.model} />
      </div>

      {/* Title */}
      <h3 className="text-white font-medium mb-2">{ticket.title}</h3>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <User size={12} />
          <RoleBadge role={ticket.owner} />
        </div>
        {ticket.storyPoints > 0 && (
          <div className="flex items-center gap-1">
            <Hash size={12} />
            <span>{ticket.storyPoints} pts</span>
          </div>
        )}
        {ticket.dependencies.length > 0 && (
          <div className="flex items-center gap-1">
            <Link2 size={12} />
            <span>{ticket.dependencies.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Extended details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
          {ticket.agent && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Agent:</span>
              <span className="text-slate-200">{ticket.agent}</span>
            </div>
          )}
          {ticket.startedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Started:</span>
              <span className="text-slate-200">
                {new Date(ticket.startedAt).toLocaleString()}
              </span>
            </div>
          )}
          {ticket.completedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Completed:</span>
              <span className="text-slate-200">
                {new Date(ticket.completedAt).toLocaleString()}
              </span>
            </div>
          )}
          {ticket.duration !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Duration:</span>
              <span className="text-slate-200">{ticket.duration} min</span>
            </div>
          )}
          {ticket.promptHash && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Prompt:</span>
              <span className="text-slate-200 font-mono text-xs">
                {ticket.promptHash}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

export function TicketList({ tickets, onTicketClick }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-slate-400 text-center py-8">
        No tickets found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={onTicketClick ? () => onTicketClick(ticket) : undefined}
        />
      ))}
    </div>
  );
}
