import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import {
  X,
  Layers,
  Award,
  Plus,
  Trash2,
  Edit2,
  Play,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

export default function OrganizerModal({ isOpen, onClose, room, roomId }) {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'settings'

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
  const [nameSaved, setNameSaved] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const handleResetTaskVotes = (taskId) => {
    socket.emit('reset-task-votes', { roomId, taskId });
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
    const val = newCardValue.trim();
    if (!val || cardDeck.includes(val)) return;
    const updated = [...cardDeck, val];
    setCardDeck(updated);
    socket.emit('update-settings', { roomId, cardDeck: updated });
    setNewCardValue('');
  };

  const handleRemoveCard = (cardToRemove) => {
    const updated = cardDeck.filter((c) => c !== cardToRemove);
    setCardDeck(updated);
    socket.emit('update-settings', { roomId, cardDeck: updated });
  };

  const handleResetDeck = () => {
    const defaultDeck = ['1', '2', '3', '5', '?', '☕'];
    setCardDeck(defaultDeck);
    socket.emit('update-settings', { roomId, cardDeck: defaultDeck });
  };

  const handleUpdateRoomName = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    socket.emit('update-settings', { roomId, roomName: roomName.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Configurações da Sala</h2>
              <p className="text-xs text-slate-400">Gerencie tarefas e personalize o baralho</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'tasks'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Tarefas da Sprint</span>
            {room.tasks && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-800 rounded-full text-[11px] text-slate-300">
                {room.tasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Baralho & Nome</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              
              {/* Add Task Form */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Nova Tarefa para Estimativa
                </h3>
                <form onSubmit={handleAddTask} className="space-y-3">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Título da Tarefa (ex: Autenticação OAuth)"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Descrição ou critérios de aceite (opcional)"
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Tarefa
                  </button>
                </form>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tarefas Cadastradas ({room.tasks?.length || 0})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Selecione uma tarefa para votar
                  </span>
                </div>

                {(!room.tasks || room.tasks.length === 0) ? (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-xl">
                    <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">Nenhuma tarefa adicionada</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Adicione tarefas acima para que o time possa estimar o esforço na mesa.
                    </p>
                  </div>
                ) : (
                  room.tasks.map((task) => {
                    const isCurrent = room.currentTaskId === task.id;
                    const isEditing = editingTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-indigo-950/20 border-indigo-500/50 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800'
                        }`}
                      >
                        {isEditing ? (
                          <div className="space-y-2.5">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              placeholder="Descrição (opcional)"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
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
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-semibold text-white break-words">
                                  {task.title}
                                </h4>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                    Em Votação
                                  </span>
                                )}
                                {task.status === 'completed' && (
                                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Concluída ({task.finalScore})
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-xs text-slate-400 mt-1 break-words">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {!isCurrent ? (
                                <button
                                  onClick={() => handleStartVoting(task.id)}
                                  className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
                                  title="Iniciar Votação nesta Tarefa"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  <span className="hidden xs:inline">Votar</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded-lg">
                                  Ativa
                                </span>
                              )}

                              <button
                                onClick={() => handleResetTaskVotes(task.id)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-colors cursor-pointer"
                                title="Limpar Votos e Revotar Tarefa"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  setEditingTaskId(task.id);
                                  setEditTitle(task.title);
                                  setEditDesc(task.description || '');
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                                title="Editar Tarefa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="Excluir Tarefa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Room Name */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nome da Sala / Sprint
                </h3>
                <form onSubmit={handleUpdateRoomName} className="flex gap-2">
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Ex: Sprint 15 Planning"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors cursor-pointer text-xs shrink-0"
                  >
                    {nameSaved ? 'Salvo!' : 'Salvar'}
                  </button>
                </form>
              </div>

              {/* Card Deck Configuration */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Baralho de Cartas (Valores)
                  </h3>
                  <button
                    type="button"
                    onClick={handleResetDeck}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar Padrão
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cardDeck.map((card, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl text-slate-200 font-mono text-sm shadow-sm"
                    >
                      <span className="font-bold">{card}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(card)}
                        className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title={`Remover carta ${card}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new card form */}
                <form onSubmit={handleAddCard} className="flex gap-2 max-w-sm pt-2">
                  <input
                    type="text"
                    value={newCardValue}
                    onChange={(e) => setNewCardValue(e.target.value)}
                    placeholder="Nova carta (ex: 8, 13, XS, XL)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0"
                  >
                    Adicionar
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 flex justify-end shrink-0 bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors cursor-pointer text-xs sm:text-sm shadow-md"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
}
