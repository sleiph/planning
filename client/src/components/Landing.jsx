import React, { useState } from 'react';
import { PlusCircle, LogIn, PlayingCardsFan, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Landing({ onRoomCreated, onRoomJoined }) {
  const [mode, setMode] = useState('home'); // 'home' | 'create' | 'join'
  const [roomName, setRoomName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !organizerName.trim()) {
      setError('Por favor, preencha o nome da sala e o seu nome.');
      return;
    }
    setError('');
    setLoading(true);

    let organizerToken = localStorage.getItem('planning_poker_organizer_token');
    if (!organizerToken) {
      organizerToken = 'org_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem('planning_poker_organizer_token', organizerToken);
    }

    try {
      const API_URL = import.meta.env.PROD
        ? ''
        : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:4000'
            : window.location.origin.replace(/:\d+$/, ':4000'));

      const res = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, organizerName, organizerToken })
      });
      const room = await res.json();
      localStorage.setItem(`planning_poker_name_${room.id}`, organizerName);
      localStorage.setItem(`planning_poker_is_organizer_${room.id}`, 'true');
      onRoomCreated(room.id, organizerName, true);
    } catch (err) {
      console.error(err);
      setError('Erro ao criar a sala. Verifique se o servidor está rodando.');
      setLoading(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !userName.trim()) {
      setError('Por favor, informe o código da sala e o seu nome.');
      return;
    }
    setError('');
    const targetRoomId = roomId.trim();
    const isStoredOrganizer = localStorage.getItem(`planning_poker_is_organizer_${targetRoomId}`) === 'true';
    onRoomJoined(targetRoomId, userName.trim(), isStoredOrganizer);
  };

  return (
    <div className="min-h-screen bg-theme-page flex flex-col items-center justify-between p-4 py-8 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-theme-card border border-theme-border rounded-2xl shadow-2xl p-8 text-theme-main my-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 dark:bg-indigo-500/10 text-amber-600 dark:text-indigo-400 rounded-2xl mb-4 border border-amber-500/20 dark:border-indigo-500/20">
            <PlayingCardsFan className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-theme-heading">Planning Poker</h1>
          <p className="text-sm text-theme-muted mt-2">
            Planeje a Sprint estimando o esforço de cada tarefa com sua equipe em tempo real.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {mode === 'home' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-amber-600/20 dark:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Criar Nova Sala
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-3.5 px-4 bg-theme-elevated hover:bg-theme-elevated-hover text-theme-main font-medium rounded-xl border border-theme-border-subtle transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Entrar em uma Sala Existente
            </button>

            <div className="pt-6 border-t border-theme-border text-center text-xs text-theme-faint flex items-center justify-center gap-1">
              <Settings className="w-4 h-4 text-emerald-500" />
              <span>A sala pode ser customizada pelo organizador após a criação.</span>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                Nome da Sala / Sprint
              </label>
              <input
                type="text"
                placeholder="Ex: Sprint 14 Planning"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-theme-input border border-theme-input-border rounded-xl px-4 py-3 text-theme-main placeholder-theme-faint focus:outline-none focus:border-amber-500 dark:focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                Seu Nome (Organizador)
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full bg-theme-input border border-theme-input-border rounded-xl px-4 py-3 text-theme-main placeholder-theme-faint focus:outline-none focus:border-amber-500 dark:focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('home')}
                className="w-1/3 py-3 px-4 bg-theme-elevated hover:bg-theme-elevated-hover text-theme-sub font-medium rounded-xl transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 px-4 bg-amber-600 hover:bg-amber-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-amber-600/20 dark:shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Sala'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                Código da Sala (Room ID)
              </label>
              <input
                type="text"
                placeholder="Ex: a1b2c3d4"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-theme-input border border-theme-input-border rounded-xl px-4 py-3 text-theme-main placeholder-theme-faint focus:outline-none focus:border-amber-500 dark:focus:border-indigo-500 transition-colors uppercase font-mono"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                placeholder="Ex: Ana (Desenvolvedora)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-theme-input border border-theme-input-border rounded-xl px-4 py-3 text-theme-main placeholder-theme-faint focus:outline-none focus:border-amber-500 dark:focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('home')}
                className="w-1/3 py-3 px-4 bg-theme-elevated hover:bg-theme-elevated-hover text-theme-sub font-medium rounded-xl transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 px-4 bg-amber-600 hover:bg-amber-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-amber-600/20 dark:shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Entrar na Sala
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
