import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type LocalTask, type TaskStatus } from './db';
import { syncEngine } from './sync/engine';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Database
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: 'todo', label: 'Por hacer', dotColor: 'bg-zinc-400' },
  { id: 'in_progress', label: 'En progreso', dotColor: 'bg-amber-400' },
  { id: 'done', label: 'Completado', dotColor: 'bg-emerald-400' },
];

export default function App() {
  const [connState, setConnState] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Consultas reactivas en tiempo real desde IndexedDB
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || [];
  const queuedOps = useLiveQuery(() => db.mutation_queue.count(), []) || 0;

  useEffect(() => {
    return syncEngine.subscribeState(setConnState);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const taskId = crypto.randomUUID();
    await syncEngine.mutateTaskField(taskId, 'title', newTaskTitle.trim());
    setNewTaskTitle('');
  };

  const handleMoveStatus = async (task: LocalTask, nextStatus: TaskStatus) => {
    await syncEngine.mutateTaskField(task.id, 'status', nextStatus, task);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0e] text-zinc-100">
      {/* Barra superior de telemetría y estado */}
      <header className="border-b border-zinc-800/80 bg-[#121418]/60 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold tracking-tight">
            Δ
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide text-zinc-100">DeltaMesh Workspace</h1>
            <p className="text-xs text-zinc-500 font-mono">CRDT Engine • Rust + IndexedDB</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Indicador de cola de mutaciones */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Cola local:</span>
            <span className={`font-mono font-medium ${queuedOps > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
              {queuedOps} {queuedOps === 1 ? 'delta' : 'deltas'}
            </span>
          </div>

          {/* Badge dinámico de conectividad */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium">
            {connState === 'connected' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">En vivo (Axum)</span>
              </>
            )}
            {connState === 'connecting' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-400">Reconectando...</span>
              </>
            )}
            {connState === 'disconnected' && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400">Modo Offline</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Formulario de creación rápida */}
        <form onSubmit={handleCreateTask} className="flex gap-3 max-w-xl">
          <input
            type="text"
            placeholder="Escribe una tarea y presiona Enter..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-zinc-900/90 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear</span>
          </button>
        </form>

        {/* Tablero Kanban Reactivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div 
                key={col.id} 
                className="flex flex-col bg-[#121418]/40 border border-zinc-800/60 rounded-xl p-4 min-h-[450px]"
              >
                {/* Cabecera de Columna */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <span className="font-medium text-xs tracking-wider uppercase text-zinc-300">
                      {col.label}
                    </span>
                    {col.id === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-800/50">
                    {colTasks.length}
                  </span>
                </div>

                {/* Lista de Tarjetas */}
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800/40 rounded-lg p-6">
                      <span className="text-xs text-zinc-600">Sin tareas</span>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-lg p-4 transition-all shadow-sm hover:shadow-md flex flex-col justify-between gap-3"
                      >
                        <p className="text-sm font-normal text-zinc-200 leading-snug">
                          {task.title}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500 font-mono">
                          <span className="flex items-center gap-1" title={`HLC: ${task.wallTime}-${task.counter}`}>
                            <Clock className="w-3 h-3 text-zinc-600" />
                            {task.nodeId.substring(0, 10)}
                          </span>

                          {/* Acciones de transición de estado */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => handleMoveStatus(task, col.id === 'done' ? 'in_progress' : 'todo')}
                                className="p-1 hover:text-zinc-200 hover:bg-zinc-800 rounded transition cursor-pointer"
                                title="Mover atrás"
                              >
                                ←
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => handleMoveStatus(task, col.id === 'todo' ? 'in_progress' : 'done')}
                                className="p-1 hover:text-indigo-400 hover:bg-zinc-800 rounded transition cursor-pointer"
                                title="Avanzar etapa"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
