import React from 'react';
import { Crown, CheckCircle2, Clock, User } from 'lucide-react';

export default function ParticipantList({ room, currentUserId }) {
  const users = room.users ? Object.values(room.users) : [];
  const currentTaskId = room.currentTaskId;
  const currentVotes = (currentTaskId && room.votes && room.votes[currentTaskId]) || {};
  const votesRevealed = room.votesRevealed;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          Participantes ({users.length})
        </h3>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
        {users.map((u) => {
          const hasVoted = currentVotes[u.id] !== undefined;
          const voteValue = currentVotes[u.id];
          const isMe = u.id === currentUserId;

          return (
            <div
              key={u.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isMe
                  ? 'bg-indigo-950/30 border-indigo-500/40'
                  : 'bg-slate-950/50 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  u.isOrganizer ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                }`}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {u.name} {isMe && '(Você)'}
                    </span>
                    {u.isOrganizer && (
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Organizador" />
                    )}
                  </div>
                </div>
              </div>

              {/* Vote status / badge */}
              <div className="shrink-0 pl-2">
                {currentTaskId ? (
                  hasVoted ? (
                    votesRevealed ? (
                      <span className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-sm">
                        {voteValue}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Votou
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                      Pensando
                    </span>
                  )
                ) : (
                  <span className="text-xs text-slate-600">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
