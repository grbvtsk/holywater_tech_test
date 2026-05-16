'use client';

import { useState } from 'react';
import type { CreateTaskInput, Task, TaskPriority, TaskStatus } from '@/types/task';
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  formGroupClass,
  inputClass,
  labelClass,
  selectClass,
  textareaClass,
} from '@/lib/styles';

interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TaskForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo');
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description, status, priority, notes });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <div className={formGroupClass}>
        <label htmlFor="title" className={labelClass}>
          Title *
        </label>
        <input
          id="title"
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={formGroupClass}>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          className={textareaClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={formGroupClass}>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className={formGroupClass}>
          <label htmlFor="priority" className={labelClass}>
            Priority
          </label>
          <select
            id="priority"
            className={selectClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="notes" className={labelClass}>
          Notes (for AI status updates)
        </label>
        <textarea
          id="notes"
          className={textareaClass}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className={btnPrimary} disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className={btnSecondary} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
