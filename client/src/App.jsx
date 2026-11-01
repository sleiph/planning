import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Room from './components/Room';

export default function App() {
  const [roomId, setRoomId] = useState(null);
  const [userName, setUserName] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [needsNamePrompt, setNeedsNamePrompt] = useState(false);

  // Check URL path on mount (e.g. /room/xxxx)
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/room\/([a-zA-Z0-9_-]+)$/);
    if (match) {
      const targetRoomId = match[1];
      const savedName = localStorage.getItem(`planning_poker_name_${targetRoomId}`);
      if (savedName) {
        setRoomId(targetRoomId);
        setUserName(savedName);
        setIsOrganizer(false);
      } else {
        setRoomId(targetRoomId);
        setNeedsNamePrompt(true);
      }
    }
  }, []);

  const handleRoomCreated = (newRoomId, name, organizerStatus) => {
    setUserName(name);
    setIsOrganizer(organizerStatus);
    localStorage.setItem(`planning_poker_name_${newRoomId}`, name);
    window.history.pushState({}, '', `/room/${newRoomId}`);
    setRoomId(newRoomId);
    setNeedsNamePrompt(false);
  };

  const handleRoomJoined = (targetRoomId, name) => {
    setUserName(name);
    setIsOrganizer(false);
    localStorage.setItem(`planning_poker_name_${targetRoomId}`, name);
    window.history.pushState({}, '', `/room/${targetRoomId}`);
    setRoomId(targetRoomId);
    setNeedsNamePrompt(false);
  };

  const handleLeaveRoom = () => {
    window.history.pushState({}, '', '/');
    setRoomId(null);
    setUserName('');
    setIsOrganizer(false);
    setNeedsNamePrompt(false);
  };

  // If user opened a room link directly but needs to provide name
  if (needsNamePrompt && roomId) {
    const [inputName, setInputName] = useState('');
    const handleSubmitName = (e) => {
      e.preventDefault();
      if (!inputName.trim()) return;
      handleRoomJoined(roomId, inputName.trim());
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">Entrar na Sala</h2>
          <p className="text-sm text-slate-400 mb-6">Informe seu nome para participar da votação na sala <code className="text-indigo-400">{roomId}</code>.</p>
          <form onSubmit={handleSubmitName} className="space-y-4">
            <input
              type="text"
              placeholder="Seu Nome"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Entrar na Sala
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!roomId) {
    return <Landing onRoomCreated={handleRoomCreated} onRoomJoined={handleRoomJoined} />;
  }

  return (
    <Room
      roomId={roomId}
      userName={userName}
      isOrganizer={isOrganizer}
      onLeave={handleLeaveRoom}
    />
  );
}
