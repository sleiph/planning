import React, { useState } from 'react';
import { Users, PlusCircle, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

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

    try {
      const res = await fetch('http://localhost:4000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, organizerName })
      });
      const room = await res.json();
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
    onRoomJoined(roomId.trim(), userName.trim());
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-slate-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl mb-4 border border-indigo-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Planning Poker</h1>
          <p className="text-sm text-slate-400 mt-2">
            Estime tarefas de sprint com sua equipe de forma ágil, colaborativa e em tempo real.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {mode === 'home' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Criar Nova Sala (Organizador)
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Entrar em uma Sala Existente
            </button>

            <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Salas protegidas com votação oculta e revelação em tempo real</span>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nome da Sala / Sprint
              </label>
              <input
                type="text"
                placeholder="Ex: Sprint 14 Planning"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Seu Nome (Organizador)
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos (Scrum Master)"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('home')}
                className="w-1/3 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Sala'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Código da Sala (Room ID)
              </label>
              <input
                type="text"
                placeholder="Ex: a1b2c3d4"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors uppercase font-mono"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                placeholder="Ex: Ana (Desenvolvedora)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('home')}
                className="w-1/3 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
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
