'use client';

import { useCallback, useEffect, useState } from 'react';
import { AiPanel } from '@/components/AiPanel';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { VoiceTaskModal } from '@/components/VoiceTaskModal';
import { createTask, deleteTask, fetchTasks, updateTask } from '@/lib/api';
import { Mic, Sparkles } from 'lucide-react';
import { btnPrimary, btnVoice, formGroupClass, labelClass, panelClass, selectClass } from '@/lib/styles';
import type { CreateTaskInput, Task, TaskStatus } from '@/types/task';

type SortBy = 'priority' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selected, setSelected] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showVoiceTask, setShowVoiceTask] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setError('');
    try {
      const data = await fetchTasks({
        status: statusFilter || undefined,
        sortBy,
        sortOrder,
      });
      setTasks(data);
      setSelected((prev) => (prev ? data.find((t) => t.id === prev.id) ?? null : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(data: CreateTaskInput) {
    await createTask(data);
    setShowCreate(false);
    await loadTasks();
  }

  async function handleUpdate(data: CreateTaskInput) {
    if (!editing) return;
    await updateTask(editing.id, data);
    setEditing(null);
    await loadTasks();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this task and all subtasks?')) return;
    await deleteTask(id);
    if (selected?.id === id) setSelected(null);
    await loadTasks();
  }

  async function handleDeleteSubtask(id: string) {
    if (!confirm('Delete this subtask?')) return;
    await deleteTask(id);
    await loadTasks();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-6 border-b border-slate-700 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">DevLog</h1>
        <p className="mt-1 text-slate-400">Task tracker for engineering teams with AI assistance</p>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
        <main className="flex flex-col gap-4">
          <div className={`${panelClass} flex flex-wrap items-end gap-4`}>
            <div className={`${formGroupClass} mb-0 min-w-[140px]`}>
              <label htmlFor="filter-status" className={labelClass}>
                Status
              </label>
              <select
                id="filter-status"
                className={selectClass}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
              >
                <option value="">All</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className={`${formGroupClass} mb-0 min-w-[140px]`}>
              <label htmlFor="sort-by" className={labelClass}>
                Sort by
              </label>
              <select
                id="sort-by"
                className={selectClass}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
              >
                <option value="createdAt">Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className={`${formGroupClass} mb-0 min-w-[180px]`}>
              <label htmlFor="sort-order" className={labelClass}>
                Order
              </label>
              <select
                id="sort-order"
                className={selectClass}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              >
                <option value="desc">Higher / newer first</option>
                <option value="asc">Lower / older first</option>
              </select>
            </div>
            <div className={`${formGroupClass} mb-0 shrink-0`}>
              <span className={`${labelClass} invisible select-none`} aria-hidden="true">
                Action
              </span>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={btnPrimary} onClick={() => setShowCreate(true)}>
                  + New task
                </button>
                <button type="button" className={btnVoice} onClick={() => setShowVoiceTask(true)}>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                  Add task by voice
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <section className={panelClass}>
            <h2 className="mb-4 text-base font-semibold">Tasks ({tasks.length})</h2>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading…</p>
            ) : tasks.length === 0 ? (
              <p className="py-8 text-center text-slate-500">
                No tasks yet. Create one or use AI decomposition.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    selected={selected?.id === task.id}
                    onSelect={setSelected}
                    onEdit={setEditing}
                    onDelete={handleDelete}
                    onDeleteSubtask={handleDeleteSubtask}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <AiPanel selectedTask={selected} onSubtasksCreated={loadTasks} />
      </div>

      {showVoiceTask && (
        <VoiceTaskModal onClose={() => setShowVoiceTask(false)} onCreated={loadTasks} />
      )}

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">New task</h2>
            <TaskForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
              submitLabel="Create"
            />
          </div>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">
              {editing.parentId ? 'Edit subtask' : 'Edit task'}
            </h2>
            <TaskForm
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
