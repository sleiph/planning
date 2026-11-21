import React from 'react';
import { Crown, CheckCircle2, Clock, Users } from 'lucide-react';

export default function ParticipantList({ room, currentUserId }) {
  const users = room.users ? Object.values(room.users) : [];
  const currentTaskId = room.currentTaskId;
  const currentVotes = (currentTaskId && room.votes && room.votes[currentTaskId]) || {};
  const votesRevealed = room.votesRevealed;
  const votedCount = users.filter((u) => currentVotes[u.id] !== undefined).length;

  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-theme-border">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-theme-muted flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
          Participantes ({users.length})
        </h3>
        {currentTaskId && (
          <span className="text-[11px] font-medium text-theme-muted">
            {votedCount}/{users.length} votaram
          </span>
        )}
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-0.5 max-h-72 lg:max-h-none">
        {users.map((u) => {
          const hasVoted = currentVotes[u.id] !== undefined;
          const voteValue = currentVotes[u.id];
          const isMe = u.id === currentUserId;

          return (
            <div
              key={u.id}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                isMe
                  ? 'bg-[var(--indigo-subtle-bg)] border-[var(--indigo-subtle-border)]'
                  : 'bg-theme-item border-theme-border'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${
                    u.isOrganizer
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-theme-elevated text-theme-main'
                  }`}
                >
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-medium text-theme-main truncate">
                      {u.name} {isMe && '(Você)'}
                    </span>
                    {u.isOrganizer && (
                      <Crown
                        className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0"
                        title="Organizador"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* badge de status do voto */}
              <div className="shrink-0 pl-2">
                {currentTaskId ? (
                  hasVoted ? (
                    votesRevealed ? (
                      <span className="px-2.5 py-1 bg-amber-600 dark:bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-xs">
                        {voteValue}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 sm:py-1 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Votou</span>
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-theme-muted bg-theme-elevated px-2 py-0.5 sm:py-1 rounded-lg">
                      <Clock className="w-3 h-3 animate-pulse text-amber-500" />
                      <span className="hidden xs:inline">Votando</span>
                    </span>
                  )
                ) : (
                  <span className="text-xs text-theme-faint">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
