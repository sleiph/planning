import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import ParticipantList from './ParticipantList';
import VotingArea from './VotingArea';
import OrganizerModal from './OrganizerModal';
import ThemeToggle from './ThemeToggle';
import { Copy, Check, Settings, LogOut, Crown, Eye, EyeOff, RotateCcw } from 'lucide-react';

export default function Room({ roomId, userName, isOrganizer, onLeave }) {
  const [room, setRoom] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.connect();

    let organizerToken = localStorage.getItem('planning_poker_organizer_token');
    socket.emit('join-room', { roomId, userName, isOrganizer, organizerToken });

    socket.on('room-update', (updatedRoom) => {
      setRoom(updatedRoom);
      setLoading(false);
    });

    return () => {
      socket.off('room-update');
      socket.disconnect();
    };
  }, [roomId, userName, isOrganizer]);

  useEffect(() => {
    if (room?.name) {
      document.title = `${room.name} - Planning | Scrum Poker`;
    }
    return () => {
      document.title = 'Planning | Scrum Poker';
    };
  }, [room?.name]);

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleReveal = () => {
    if (!room) return;
    socket.emit('reveal-votes', { roomId, revealed: !room.votesRevealed });
  };

  const handleResetVotes = () => {
    if (!room || !room.currentTaskId) return;
    socket.emit('reset-task-votes', { roomId, taskId: room.currentTaskId });
  };

  if (loading || !room) {
    return (
      <div className="min-h-screen bg-theme-page flex items-center justify-center text-theme-muted">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p>Entrando na sala...</p>
        </div>
      </div>
    );
  }

  const currentUserId = socket.id;
  const currentUserObj = room.users && room.users[currentUserId];
  const userIsOrganizer = currentUserObj ? currentUserObj.isOrganizer : isOrganizer;

  return (
    <div className="min-h-screen bg-theme-page flex flex-col text-theme-main">
      
      {/* header de navegacao */}
      <header className="bg-theme-card border-b border-theme-border px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-40 gap-2">
        
        {/* Sair + Titulo da sala & ID */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onLeave}
            className="p-2 bg-theme-elevated hover:bg-theme-elevated-hover text-theme-sub rounded-xl transition-colors cursor-pointer shrink-0"
            title="Sair da Sala"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-theme-heading truncate max-w-[130px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
                {room.name}
              </h1>

              {userIsOrganizer && (
                <>
                  {/* desktop */}
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0">
                    <Crown className="w-3 h-3" /> Organizador
                  </span>
                  {/* mobile */}
                  <span className="sm:hidden text-amber-500 dark:text-amber-400 shrink-0" title="Organizador">
                    <Crown className="w-3.5 h-3.5" />
                  </span>
                </>
              )}
            </div>

            <p className="text-[11px] sm:text-xs text-theme-muted flex items-center gap-1 truncate">
              <span>Sala:</span>
              <code className="text-indigo-600 dark:text-indigo-400 font-mono font-medium">{room.id}</code>
            </p>
          </div>
        </div>

        {/* acoes */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* revelar / esconder */}
          {userIsOrganizer && room.currentTaskId && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {room.votesRevealed && (
                <button
                  onClick={handleResetVotes}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-600/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer"
                  title="Limpar todos os votos e revotar tarefa"
                >
                  <RotateCcw className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span className="hidden sm:inline">Revotar</span>
                </button>
              )}
              <button
                onClick={handleToggleReveal}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  room.votesRevealed
                    ? 'bg-amber-500/10 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                }`}
                title={room.votesRevealed ? 'Ocultar Notas' : 'Revelar Notas'}
              >
                {room.votesRevealed ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="hidden sm:inline">Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-white shrink-0" />
                    <span className="hidden sm:inline">Revelar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* copiar link */}
          <button
            onClick={handleCopyLink}
            className="p-2 sm:px-3 sm:py-2 bg-theme-elevated hover:bg-theme-elevated-hover text-theme-main text-xs font-medium rounded-xl border border-theme-border-subtle transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            title={copied ? 'Link Copiado!' : 'Copiar Link da Sala'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="hidden md:inline text-emerald-600 dark:text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="hidden md:inline">Copiar Link</span>
              </>
            )}
          </button>

          {/* config do organizador */}
          {userIsOrganizer && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 sm:px-3 sm:py-2 bg-theme-elevated hover:bg-theme-elevated-hover text-theme-main text-xs font-medium rounded-xl border border-theme-border-subtle hover:border-indigo-500/50 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 relative"
              title="Configurações e Tarefas"
            >
              <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden md:inline">Configurações</span>
              {room.tasks && room.tasks.length > 0 && (
                <span className="md:hidden absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </button>
          )}

          <ThemeToggle />

        </div>
      </header>

      {/* main */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* voting area */}
        <main className="lg:col-span-3">
          <VotingArea
            room={room}
            roomId={roomId}
            currentUserId={currentUserId}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </main>

        {/* participantes */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)]">
            <ParticipantList room={room} currentUserId={currentUserId} />
          </div>
        </aside>

      </div>

      {/* modal de configurações do organizador */}
      {userIsOrganizer && isSettingsOpen && (
        <OrganizerModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          room={room}
          roomId={roomId}
        />
      )}

    </div>
  );
}
