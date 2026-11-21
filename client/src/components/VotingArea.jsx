import React from 'react';
import { socket } from '../socket';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Award,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Settings,
  PlayingCardsFan,
  RotateCcw
} from 'lucide-react';

export default function VotingArea({ room, roomId, currentUserId, onOpenSettings }) {
  const currentTaskId = room.currentTaskId;
  const currentTask = room.tasks?.find((t) => t.id === currentTaskId);
  const currentVotes = (currentTaskId && room.votes && room.votes[currentTaskId]) || {};
  const votesRevealed = room.votesRevealed;
  const isOrganizer = room.users && room.users[currentUserId]?.isOrganizer;

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

  const handleResetVotes = () => {
    if (!currentTaskId) return;
    socket.emit('reset-task-votes', { roomId, taskId: currentTaskId });
  };

  const handleSetFinalScore = (score) => {
    if (!currentTaskId) return;
    socket.emit('set-final-score', { roomId, taskId: currentTaskId, score });
  };

  const currentIndex = room.tasks ? room.tasks.findIndex((t) => t.id === currentTaskId) : -1;

  const handleNextTask = () => {
    if (!room.tasks || room.tasks.length === 0) return;
    if (currentIndex < room.tasks.length - 1) {
      const nextTask = room.tasks[currentIndex + 1];
      socket.emit('set-current-task', { roomId, taskId: nextTask.id });
    }
  };

  const handlePrevTask = () => {
    if (!room.tasks || room.tasks.length === 0) return;
    if (currentIndex > 0) {
      const prevTask = room.tasks[currentIndex - 1];
      socket.emit('set-current-task', { roomId, taskId: prevTask.id });
    }
  };

  // Calculate stats when votes are revealed
  const calculateStats = () => {
    if (!votesRevealed) return null;
    const values = Object.values(currentVotes).filter(
      (v) => (typeof v === 'string' || typeof v === 'number') && !isNaN(v) && v !== '?' && v !== '☕'
    );
    if (values.length === 0) return null;
    const sum = values.reduce((acc, val) => acc + Number(val), 0);
    return Math.round(sum / values.length);
  };

  const averageScore = calculateStats();
  const usersList = room.users ? Object.values(room.users) : [];

  if (!currentTask) {
    return (
      <div className="bg-theme-card border border-theme-border rounded-2xl p-8 sm:p-12 text-center shadow-xl">
        <Award className="w-12 h-12 text-amber-600 dark:text-indigo-400 mx-auto mb-4 opacity-60" />
        <h3 className="text-xl font-bold text-theme-heading mb-2">Nenhuma tarefa em votação</h3>
        <p className="text-sm text-theme-muted max-w-md mx-auto mb-6">
          {isOrganizer
            ? 'Abra as configurações para adicionar tarefas da Sprint e configurar seu baralho.'
            : 'Aguarde o organizador adicionar ou escolher uma tarefa para iniciar a votação.'}
        </p>
        {isOrganizer && (
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-amber-600/20 dark:shadow-indigo-600/20 transition-all cursor-pointer text-sm"
          >
            <Settings className="w-4 h-4" />
            Configurar Tarefas & Baralho
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* tarefa atual */}
      <div className="bg-[var(--accent-banner-bg)] border border-[var(--accent-banner-border)] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        
        {/* status da tarefa atual */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-700 dark:text-indigo-300 border border-amber-500/30 dark:border-indigo-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg">
              Em Votação
            </span>
            {room.tasks && room.tasks.length > 0 && (
              <span className="text-xs text-theme-muted">
                Tarefa {currentIndex + 1} de {room.tasks.length}
              </span>
            )}
            {currentTask.status === 'completed' && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Pontuação: {currentTask.finalScore}
              </span>
            )}
          </div>

          {/* select de tarefas (organizador) */}
          {isOrganizer && room.tasks && room.tasks.length > 1 && (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handlePrevTask}
                disabled={currentIndex === 0}
                className="p-1.5 sm:p-2 bg-theme-elevated hover:bg-theme-elevated-hover disabled:opacity-40 disabled:cursor-not-allowed text-theme-sub rounded-lg text-xs flex items-center cursor-pointer"
                title="Tarefa Anterior"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <select
                value={currentTaskId}
                onChange={(e) => socket.emit('set-current-task', { roomId, taskId: e.target.value })}
                className="bg-theme-elevated border border-theme-border-subtle text-theme-main text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 dark:focus:border-indigo-500 max-w-[130px] sm:max-w-[180px] truncate cursor-pointer"
              >
                {room.tasks.map((t, i) => (
                  <option key={t.id} value={t.id}>
                    {i + 1}. {t.title} {t.status === 'completed' ? `✓ (${t.finalScore})` : ''}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextTask}
                disabled={currentIndex === room.tasks.length - 1}
                className="p-1.5 sm:p-2 bg-theme-elevated hover:bg-theme-elevated-hover disabled:opacity-40 disabled:cursor-not-allowed text-theme-sub rounded-lg text-xs flex items-center cursor-pointer"
                title="Próxima Tarefa"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-theme-heading mb-2 break-words">
          {currentTask.title}
        </h2>

        {currentTask.description && (
          <p className="text-theme-sub text-xs sm:text-sm max-w-3xl break-words">
            {currentTask.description}
          </p>
        )}
      </div>

      {/* mesa de votacao */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-theme-border">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-theme-muted">
            Mesa de Votação
          </h3>

          {/* revelar / esconder */}
          {isOrganizer && (
            <div className="flex items-center gap-2">
              {votesRevealed && (
                <button
                  onClick={handleResetVotes}
                  className="px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-600/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer"
                  title="Limpar todos os votos e revotar esta tarefa"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Votos</span>
                </button>
              )}
              <button
                onClick={handleToggleReveal}
                className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  votesRevealed
                    ? 'bg-amber-500/10 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-amber-600 hover:bg-amber-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-md shadow-amber-600/20 dark:shadow-indigo-600/20'
                }`}
              >
                {votesRevealed ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar Notas</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Revelar Notas</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* grid de cartas dos jogadores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {usersList.map((u) => {
            const hasVoted = currentVotes[u.id] !== undefined;
            const voteVal = currentVotes[u.id];
            const isMe = u.id === currentUserId;

            return (
              <div
                key={u.id}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-[var(--indigo-subtle-bg)] border-[var(--indigo-subtle-border)]'
                    : 'bg-theme-item border-theme-border'
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-theme-elevated flex items-center justify-center font-bold text-xs sm:text-sm text-theme-main mb-2">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-theme-sub truncate max-w-[100px] sm:max-w-[120px] mb-2 text-center">
                  {u.name} {isMe && '(Você)'}
                </span>

                {/* Card visual */}
                {hasVoted ? (
                  votesRevealed ? (
                    <div className="w-12 h-16 sm:w-14 sm:h-20 bg-amber-600 dark:bg-indigo-600 text-white font-bold text-lg sm:text-xl rounded-xl flex items-center justify-center shadow-lg border border-amber-400 dark:border-indigo-400">
                      {voteVal}
                    </div>
                  ) : (
                    <div className="w-12 h-16 sm:w-14 sm:h-20 bg-[var(--indigo-subtle-bg)] text-amber-600 dark:text-indigo-400 border border-[var(--indigo-subtle-border)] rounded-xl flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400" />
                    </div>
                  )
                ) : (
                  <div className="w-12 h-16 sm:w-14 sm:h-20 bg-[var(--card-unvoted-bg)] border border-dashed border-[var(--card-unvoted-border)] rounded-xl flex items-center justify-center text-[var(--card-unvoted-text)] text-[11px] sm:text-xs">
                    Votando...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats & score final quando os votos são revelados */}
        {votesRevealed && (
          <div className="mt-6 pt-5 border-t border-theme-border space-y-4">
            {averageScore !== null && (
              <div className="flex items-center justify-center gap-3 bg-theme-item rounded-xl p-3 border border-theme-border">
                <PlayingCardsFan className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-theme-muted">
                  Média de Esforço:
                </span>
                <span className="text-2xl font-bold font-mono text-amber-600 dark:text-indigo-400">
                  {averageScore}
                </span>
              </div>
            )}

            {/* Seletor de score final do organizador */}
            {isOrganizer && (
              <div className="bg-[var(--indigo-subtle-bg)] border border-[var(--indigo-subtle-border)] rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-indigo-300 mb-2.5">
                  Definir Pontuação Final da Tarefa
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {room.cardDeck &&
                    room.cardDeck.map((score, sIdx) => {
                      const isFinalSelected = currentTask.finalScore === score;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => handleSetFinalScore(score)}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            isFinalSelected
                              ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                              : 'bg-theme-card hover:bg-theme-elevated text-theme-main border border-theme-border-subtle hover:border-amber-500/50 dark:hover:border-indigo-500/50'
                          }`}
                        >
                          {score}
                        </button>
                      );
                    })}
                </div>

                <div className="mt-3.5 flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    onClick={handleResetVotes}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-500 font-medium cursor-pointer px-3 py-1.5 bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpar votos e revotar</span>
                  </button>

                  {currentIndex < room.tasks.length - 1 && (
                    <button
                      onClick={handleNextTask}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-indigo-400 hover:text-amber-500 dark:hover:text-indigo-500 font-medium cursor-pointer px-3 py-1.5 bg-theme-elevated hover:bg-theme-elevated-hover border border-theme-border-subtle rounded-xl transition-colors"
                    >
                      <span>Ir para próxima tarefa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Picker de esforco pra tarefa atual */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-theme-muted">
            Esforço da Tarefa
          </h3>
          {myVote !== undefined && (
            <button
              onClick={handleClearMyVote}
              className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar voto
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {room.cardDeck &&
            room.cardDeck.map((card, idx) => {
              const isSelected = myVote !== undefined && myVote !== true && String(myVote) === String(card);

              return (
                <button
                  key={idx}
                  onClick={() => handleCastVote(card)}
                  className={`w-12 h-16 xs:w-14 xs:h-20 sm:w-16 sm:h-24 rounded-xl sm:rounded-2xl font-mono text-lg xs:text-xl sm:text-2xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-md relative ${
                    isSelected
                      ? 'bg-amber-600 dark:bg-indigo-600 text-white -translate-y-2.5 border-2 shadow-xl shadow-amber-500/40 dark:shadow-indigo-500/40 scale-105'
                      : 'bg-theme-item hover:bg-theme-elevated text-theme-main border border-theme-border-subtle hover:border-amber-500/50 dark:hover:border-indigo-500/50 hover:-translate-y-1'
                  }`}
                >
                  
                  <span>{card}</span>
                </button>
              );
            })}
        </div>
      </div>

    </div>
  );
}
