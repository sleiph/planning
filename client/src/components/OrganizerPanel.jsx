import React, { useState } from 'react';
import { socket } from '../socket';
import { Plus, Trash2, Edit2, Check, X, Layers, Settings, Play, Award } from 'lucide-react';

export default function OrganizerPanel({ room, roomId }) {
  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Card deck state
  const [newCardValue, setNewCardValue] = useState('');
  const [cardDeck, setCardDeck] = useState(room.cardDeck || []);

  // Room name state
  const [roomName, setRoomName] = useState(room.name || '');

  // Add task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    socket.emit('add-task', {
      roomId,
      task: { title: taskTitle.trim(), description: taskDesc.trim() }
    });
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleDeleteTask = (taskId) => {
    socket.emit('delete-task', { roomId, taskId });
  };

  const handleStartVoting = (taskId) => {
    socket.emit('set-current-task', { roomId, taskId });
  };

  const handleSaveEdit = (taskId) => {
    socket.emit('update-task', {
      roomId,
      taskId,
      task: { title: editTitle, description: editDesc }
    });
    setEditingTaskId(null);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardValue.trim() || cardDeck.includes(newCardValue.trim())) return;
    const updated = [...cardDeck, newCardValue.trim()];
    setCardDeck(updated);
    socket.emit('update-settings', { roomId, cardDeck: updated });
    setNewCardValue('');
  };

  const handleRemoveCard = (cardToRemove) => {
    const updated = cardDeck.filter(c => c !== cardToRemove);
    setCardDeck(updated);
    socket.emit('update-settings', { roomId, cardDeck: updated });
  };

  const handleResetDeck = () => {
    const defaultDeck = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕'];
    setCardDeck(defaultDeck);
    socket.emit('update-settings', { roomId, cardDeck: defaultDeck });
  };

  const handleUpdateRoomName = (e) => {
    e.preventDefault();
    socket.emit('update-settings', { roomId, roomName });
  };

  const handleSetFinalScore = (taskId, score) => {
    socket.emit('set-final-score', { roomId, taskId, score });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Room Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          Configurações da Sala
        </h2>
        <form onSubmit={handleUpdateRoomName} className="flex gap-3">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Nome da Sala"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors cursor-pointer"
          >
            Salvar Nome
          </button>
        </form>
      </div>

      {/* Card Deck Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Baralho de Cartas (Notas)
          </h2>
          <button
            type="button"
            onClick={handleResetDeck}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Restaurar Padrão (Fibonacci)
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {cardDeck.map((card, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-sm"
            >
              <span>{card}</span>
              <button
                type="button"
                onClick={() => handleRemoveCard(card)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddCard} className="flex gap-3 max-w-xs">
          <input
            type="text"
            value={newCardValue}
            onChange={(e) => setNewCardValue(e.target.value)}
            placeholder="Nova carta (ex: 40)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shrink-0"
          >
            Adicionar
          </button>
        </form>
      </div>

      {/* Task Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Gerenciar Tarefas da Sprint
        </h2>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="space-y-3 mb-6 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Título da Tarefa (ex: Autenticação OAuth)"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <input
              type="text"
              placeholder="Descrição curta (opcional)"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Tarefa para Votação
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {room.tasks && room.tasks.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">Nenhuma tarefa cadastrada ainda.</p>
          ) : (
            room.tasks.map((task) => {
              const isCurrent = room.currentTaskId === task.id;
              const isEditing = editingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md">
                              Em Votação
                            </span>
                          )}
                          {task.status === 'completed' && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md">
                              Concluída ({task.finalScore})
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isCurrent && (
                          <button
                            onClick={() => handleStartVoting(task.id)}
                            className="p-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
                            title="Iniciar Votação nesta Tarefa"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Votar
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditTitle(task.title);
                            setEditDesc(task.description);
                          }}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                          title="Editar Tarefa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                          title="Excluir Tarefa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Final score selector if voting is revealed or task active */}
                  {isCurrent && room.votesRevealed && (
                    <div className="mt-4 pt-4 border-t border-indigo-500/20 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-medium text-indigo-300">Definir Esforço Final:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {room.cardDeck.map((score, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSetFinalScore(task.id, score)}
                            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                              task.finalScore === score
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
