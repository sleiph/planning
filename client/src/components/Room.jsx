import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import ParticipantList from './ParticipantList';
import VotingArea from './VotingArea';
import OrganizerPanel from './OrganizerPanel';
import { Copy, Check, Users, Settings, Play, ArrowLeft, LogOut, Crown, Eye, EyeOff } from 'lucide-react';

export default function Room({ roomId, userName, isOrganizer, onLeave }) {
  const [room, setRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('voting'); // 'voting' | 'settings'
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

  if (loading || !room) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
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
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      
      {/* Top Navigation / Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onLeave}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Sair da Sala"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{room.name}</h1>
              {userIsOrganizer && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Organizador
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Código da Sala: <code className="text-indigo-400 font-mono">{room.id}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Organizer Reveal / Hide Button */}
          {userIsOrganizer && room.currentTaskId && (
            <button
              onClick={handleToggleReveal}
              className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer ${
                room.votesRevealed
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
              }`}
            >
              {room.votesRevealed ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Ocultar Notas</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Revelar Notas</span>
                </>
              )}
            </button>
          )}

          {/* Share room link */}
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-indigo-400" />
                <span>Copiar Link da Sala</span>
              </>
            )}
          </button>

          {/* Navigation tabs if organizer */}
          {userIsOrganizer && (
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('voting')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'voting'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Votação
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Configuração
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Board / Panel (3 cols) */}
        <main className="lg:col-span-3">
          {activeTab === 'voting' || !userIsOrganizer ? (
            <VotingArea room={room} roomId={roomId} currentUserId={currentUserId} />
          ) : (
            <OrganizerPanel room={room} roomId={roomId} currentUserId={currentUserId} />
          )}
        </main>

        {/* Sidebar / Participants (1 col) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 h-[calc(100vh-7rem)]">
            <ParticipantList room={room} currentUserId={currentUserId} />
          </div>
        </aside>

      </div>

    </div>
  );
}
