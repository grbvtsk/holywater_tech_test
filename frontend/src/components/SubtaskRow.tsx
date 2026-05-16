'use client';

import type { Task } from '@/types/task';
import { btnDanger, btnSecondary, priorityBadge, statusBadge } from '@/lib/styles';

const STATUS_LABELS: Record<Task['status'], string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

interface SubtaskRowProps {
  subtask: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function SubtaskRow({ subtask, onEdit, onDelete }: SubtaskRowProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-slate-700/80 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-200">{subtask.title}</span>
          <span className={priorityBadge[subtask.priority]}>{subtask.priority}</span>
          <span className={statusBadge[subtask.status]}>{STATUS_LABELS[subtask.status]}</span>
        </div>
        {subtask.description && (
          <p className="mt-1 text-xs text-slate-500">{subtask.description}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button type="button" className={btnSecondary} onClick={() => onEdit(subtask)}>
          Edit
        </button>
        <button type="button" className={btnDanger} onClick={() => onDelete(subtask.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
