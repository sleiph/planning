import React from 'react';
import { socket } from '../socket';
import { Eye, EyeOff, RotateCcw, CheckCircle2, Award, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';

export default function VotingArea({ room, roomId, currentUserId }) {
  const currentTaskId = room.currentTaskId;
  const currentTask = room.tasks?.find(t => t.id === currentTaskId);
  const currentVotes = (currentTaskId && room.votes && room.votes[currentTaskId]) || {};
  const votesRevealed = room.votesRevealed;
  const isOrganizer = room.users && room.users[currentUserId]?.isOrganizer;

  // My vote
  const myVote = currentVotes[currentUserId];

  const handleCastVote = (voteValue) => {
    if (!currentTaskId) return;
    socket.emit('cast-vote', { roomId, taskId: currentTaskId, vote: voteValue });
  };

  const handleClearMyVote = () => {
    if (!currentTaskId) return;
    socket.emit('clear-vote', { roomId, taskId: currentTaskId });
  };

  const handleToggleReveal = () => {
    socket.emit('reveal-votes', { roomId, revealed: !votesRevealed });
  };

  const handleNextTask = () => {
    if (!room.tasks || room.tasks.length === 0) return;
    const currentIndex = room.tasks.findIndex(t => t.id === currentTaskId);
    if (currentIndex < room.tasks.length - 1) {
      const nextTask = room.tasks[currentIndex + 1];
      socket.emit('set-current-task', { roomId, taskId: nextTask.id });
    }
  };

  const handlePrevTask = () => {
    if (!room.tasks || room.tasks.length === 0) return;
    const currentIndex = room.tasks.findIndex(t => t.id === currentTaskId);
    if (currentIndex > 0) {
      const prevTask = room.tasks[currentIndex - 1];
      socket.emit('set-current-task', { roomId, taskId: prevTask.id });
    }
  };

  // Calculate average if numeric
  const calculateStats = () => {
    if (!votesRevealed) return null;
    const values = Object.values(currentVotes).filter(v => typeof v === 'string' && !isNaN(v) && v !== '?' && v !== '☕');
    if (values.length === 0) return null;
    const sum = values.reduce((acc, val) => acc + Number(val), 0);
    return (sum / values.length).toFixed(1);
  };

  const averageScore = calculateStats();

  if (!currentTask) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
        <Award className="w-12 h-12 text-indigo-400 mx-auto mb-4 opacity-60" />
        <h3 className="text-xl font-bold text-white mb-2">Nenhuma tarefa em votação</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          {isOrganizer
            ? 'Vá até a aba de Configuração para adicionar tarefas e iniciar a votação.'
            : 'Aguarde o organizador escolher uma tarefa para iniciar a votação.'}
        </p>
      </div>
    );
  }

  const usersList = room.users ? Object.values(room.users) : [];

  return (
    <div className="space-y-6">
      
      {/* Current Task Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="w-32 h-32 text-indigo-400" />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider rounded-lg">
            Tarefa Atual em Votação
          </span>
          
          {/* Task navigation buttons for organizer */}
          {isOrganizer && room.tasks.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTask}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                title="Tarefa Anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextTask}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                title="Próxima Tarefa"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{currentTask.title}</h2>
        {currentTask.description && (
          <p className="text-slate-300 text-sm max-w-2xl">{currentTask.description}</p>
        )}
      </div>

      {/* Voting Board / Participants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Mesa de Votação
          </h3>

          {/* Organizer Reveal / Reset Controls */}
          {isOrganizer && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleReveal}
                className={`px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  votesRevealed
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                }`}
              >
                {votesRevealed ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Ocultar Novamente
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Revelar Notas
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Players Cards Grid on Table */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {usersList.map((u) => {
            const hasVoted = currentVotes[u.id] !== undefined;
            const voteVal = currentVotes[u.id];
            const isMe = u.id === currentUserId;

            return (
              <div
                key={u.id}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-indigo-950/30 border-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-200 mb-2">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-300 truncate max-w-[120px] mb-3">
                  {u.name} {isMe && '(Você)'}
                </span>

                {/* Card visual */}
                {hasVoted ? (
                  votesRevealed ? (
                    <div className="w-14 h-20 bg-indigo-600 text-white font-bold text-xl rounded-xl flex items-center justify-center shadow-lg border border-indigo-400 animate-bounce-short">
                      {voteVal}
                    </div>
                  ) : (
                    <div className="w-14 h-20 bg-indigo-950 text-indigo-400 border border-indigo-500/50 rounded-xl flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                  )
                ) : (
                  <div className="w-14 h-20 bg-slate-900 border border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                    Pensando
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats when revealed */}
        {votesRevealed && averageScore !== null && (
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-6 bg-slate-950/40 rounded-xl p-4">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Média de Esforço</span>
              <span className="text-3xl font-bold font-mono text-indigo-400">{averageScore}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Deck Picker for Current User */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Escolha sua Nota para a Tarefa
          </h3>
          {myVote !== undefined && (
            <button
              onClick={handleClearMyVote}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Apagar minha nota
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {room.cardDeck && room.cardDeck.map((card, idx) => {
            const isSelected = myVote === card;

            return (
              <button
                key={idx}
                onClick={() => handleCastVote(card)}
                className={`w-14 h-20 sm:w-16 sm:h-24 rounded-2xl font-mono text-xl sm:text-2xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  isSelected
                    ? 'bg-indigo-600 text-white -translate-y-2 ring-4 ring-indigo-500/40 border border-indigo-400'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-indigo-500/50 hover:-translate-y-1'
                }`}
              >
                {card}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
