'use client';

import { useState } from 'react';
import type { DecomposeResult, Task } from '@/types/task';
import { addDecomposedTasks, decomposeTask, generateStatusUpdate } from '@/lib/api';
import {
  btnPrimary,
  btnSecondary,
  formGroupClass,
  inputClass,
  labelClass,
  panelClass,
  priorityBadge,
  selectClass,
  textareaClass,
} from '@/lib/styles';

interface AiPanelProps {
  selectedTask: Task | null;
  onSubtasksCreated: () => void;
}

export function AiPanel({ selectedTask, onSubtasksCreated }: AiPanelProps) {
  const [decomposeTitle, setDecomposeTitle] = useState('');
  const [decomposeDesc, setDecomposeDesc] = useState('');
  const [decomposeResult, setDecomposeResult] = useState<DecomposeResult | null>(null);
  const [addedToDevLog, setAddedToDevLog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [tone, setTone] = useState<'casual' | 'professional' | 'urgent'>('casual');
  const [loadingDecompose, setLoadingDecompose] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState('');

  async function handleDecompose(e: React.FormEvent) {
    e.preventDefault();
    if (!decomposeTitle.trim()) return;

    setError('');
    setLoadingDecompose(true);
    setDecomposeResult(null);
    setAddedToDevLog(false);

    try {
      const result = await decomposeTask({
        title: decomposeTitle.trim(),
        description: decomposeDesc,
      });
      setDecomposeResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoadingDecompose(false);
    }
  }

  async function handleAddToDevLog() {
    if (!decomposeResult?.subtasks?.length) return;

    setError('');
    setLoadingAdd(true);

    try {
      await addDecomposedTasks({
        title: decomposeTitle.trim(),
        description: decomposeDesc,
        parentTaskId: selectedTask?.id,
        subtasks: decomposeResult.subtasks,
      });
      setAddedToDevLog(true);
      onSubtasksCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tasks');
    } finally {
      setLoadingAdd(false);
    }
  }

  async function handleStatusUpdate() {
    if (!selectedTask) return;

    setError('');
    setLoadingStatus(true);
    setStatusUpdate('');

    try {
      const result = await generateStatusUpdate({ taskId: selectedTask.id, tone });
      setStatusUpdate(result.update);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoadingStatus(false);
    }
  }

  function fillFromSelected() {
    if (!selectedTask) return;
    setDecomposeTitle(selectedTask.title);
    setDecomposeDesc(selectedTask.description);
    setDecomposeResult(null);
    setAddedToDevLog(false);
  }

  const showSubtasks =
    decomposeResult &&
    !decomposeResult.needsClarification &&
    decomposeResult.subtasks &&
    decomposeResult.subtasks.length > 0;

  return (
    <aside className={`${panelClass} sticky top-4`}>
      <h2 className="mb-4 text-lg font-semibold">AI Assistant</h2>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <section className="mb-6 border-b border-slate-700 pb-6">
        <h3 className="mb-1 text-sm font-semibold">Task decomposition</h3>
        <p className="mb-3 text-sm text-slate-400">
          AI breaks a task into subtasks. If the description is unclear, it will ask clarifying questions.
        </p>

        {selectedTask && (
          <button type="button" className={`${btnSecondary} mb-3 w-full`} onClick={fillFromSelected}>
            Use selected task
          </button>
        )}

        <form onSubmit={handleDecompose}>
          <div className={formGroupClass}>
            <label htmlFor="ai-title" className={labelClass}>
              Title
            </label>
            <input
              id="ai-title"
              className={inputClass}
              value={decomposeTitle}
              onChange={(e) => setDecomposeTitle(e.target.value)}
              placeholder="e.g. Refactor auth module"
              required
            />
          </div>

          <div className={formGroupClass}>
            <label htmlFor="ai-desc" className={labelClass}>
              Description
            </label>
            <textarea
              id="ai-desc"
              className={textareaClass}
              value={decomposeDesc}
              onChange={(e) => setDecomposeDesc(e.target.value)}
              rows={3}
              placeholder="Context, constraints, goals…"
            />
          </div>

          <button type="submit" className={btnPrimary} disabled={loadingDecompose}>
            {loadingDecompose ? 'Generating…' : 'Break into subtasks'}
          </button>
        </form>

        {decomposeResult?.needsClarification && (
          <div className="mt-4 rounded-lg border-l-4 border-amber-500 bg-slate-950 p-3 text-sm">
            <strong className="text-amber-400">Clarification needed:</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
              {decomposeResult.questions?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {showSubtasks && (
          <div className="mt-4 rounded-lg bg-slate-950 p-3 text-sm">
            <strong className="text-slate-200">Subtasks:</strong>
            <ul className="mt-2 space-y-2">
              {decomposeResult.subtasks!.map((st, i) => (
                <li key={i} className="text-slate-300">
                  <span className={`${priorityBadge[st.priority]} mr-2`}>{st.priority}</span>
                  {st.title}
                  {st.description && (
                    <small className="mt-0.5 block text-slate-500">{st.description}</small>
                  )}
                </li>
              ))}
            </ul>

            {!addedToDevLog && (
              <button
                type="button"
                className={`${btnPrimary} mt-3 w-full`}
                onClick={handleAddToDevLog}
                disabled={loadingAdd}
              >
                {loadingAdd
                  ? 'Adding…'
                  : selectedTask
                    ? 'Add subtasks to DevLog'
                    : 'Add task & subtasks to DevLog'}
              </button>
            )}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Status update</h3>
        <p className="mb-3 text-sm text-slate-400">
          Short Slack-style update based on the task, subtasks, and notes.
        </p>

        {!selectedTask ? (
          <p className="text-sm text-slate-500">Select a task from the list on the left.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-slate-300">Task: {selectedTask.title}</p>
            <div className={formGroupClass}>
              <label htmlFor="tone" className={labelClass}>
                Tone
              </label>
              <select
                id="tone"
                className={selectClass}
                value={tone}
                onChange={(e) => setTone(e.target.value as typeof tone)}
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <button type="button" className={btnPrimary} onClick={handleStatusUpdate} disabled={loadingStatus}>
              {loadingStatus ? 'Generating…' : 'Generate update'}
            </button>
            {statusUpdate && (
              <div className="mt-4 rounded-lg bg-slate-950 p-3 text-sm">
                <strong className="text-slate-200">Update:</strong>
                <p className="my-2 whitespace-pre-wrap text-slate-300">{statusUpdate}</p>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => navigator.clipboard.writeText(statusUpdate)}
                >
                  Copy
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </aside>
  );
}
