'use client';

import type { Task } from '@/types/task';
import { SubtaskRow } from '@/components/SubtaskRow';
import { btnDanger, btnSecondary, priorityBadge, statusBadge } from '@/lib/styles';

const STATUS_LABELS: Record<Task['status'], string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

interface TaskCardProps {
  task: Task;
  selected?: boolean;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDeleteSubtask: (id: string) => void;
}

export function TaskCard({
  task,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onDeleteSubtask,
}: TaskCardProps) {
  const subtasks = task.subtasks ?? [];

  return (
    <article
      className={`cursor-pointer rounded-xl border bg-slate-900 p-4 transition hover:bg-slate-800/80 ${
        selected
          ? 'border-blue-500 ring-1 ring-blue-500'
          : 'border-slate-700 hover:border-slate-600'
      }`}
      onClick={() => onSelect(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-100">{task.title}</h3>
        <span className={priorityBadge[task.priority]}>{PRIORITY_LABELS[task.priority]}</span>
      </div>

      {task.description && (
        <p className="mt-2 text-sm text-slate-400">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={statusBadge[task.status]}>{STATUS_LABELS[task.status]}</span>
        <time className="text-xs text-slate-500" dateTime={task.createdAt}>
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>

      {subtasks.length > 0 && (
        <ul
          className="mt-3 space-y-2 border-t border-slate-700 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <li className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Subtasks ({subtasks.filter((s) => s.status === 'done').length}/{subtasks.length} done)
          </li>
          {subtasks.map((subtask) => (
            <SubtaskRow
              key={subtask.id}
              subtask={subtask}
              onEdit={onEdit}
              onDelete={onDeleteSubtask}
            />
          ))}
        </ul>
      )}

      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={btnSecondary} onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className={btnDanger} onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
