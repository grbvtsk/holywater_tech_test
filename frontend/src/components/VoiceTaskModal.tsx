'use client';

import { useState } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { createTask, parseVoiceTask } from '@/lib/api';
import { Mic, Square, Sparkles } from 'lucide-react';
import { btnPrimary, btnRecordStart, btnRecordStop, btnSecondary } from '@/lib/styles';
import type { CreateTaskInput, ParsedVoiceTask } from '@/types/task';

interface VoiceTaskModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function VoiceTaskModal({ onClose, onCreated }: VoiceTaskModalProps) {
  const speech = useSpeechRecognition();
  const [step, setStep] = useState<'listen' | 'preview'>('listen');
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<ParsedVoiceTask | null>(null);
  const [error, setError] = useState('');

  function handleClose() {
    speech.reset();
    onClose();
  }

  async function handleProcessTranscript() {
    const text = speech.transcript.trim();
    if (!text) {
      setError('Say something first, or type your task below.');
      return;
    }

    setError('');
    setParsing(true);
    speech.stop();

    try {
      const parsed = await parseVoiceTask(text);
      setPreview(parsed);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse voice input');
    } finally {
      setParsing(false);
    }
  }

  async function handleConfirm(data: CreateTaskInput) {
    await createTask(data);
    onCreated();
    handleClose();
  }

  function handleRecordAgain() {
    setStep('listen');
    setPreview(null);
    setError('');
    speech.reset();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-violet-200">
          <Sparkles className="h-4 w-4 text-violet-300" aria-hidden />
          Add task by voice
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          {step === 'listen'
            ? 'Describe your task, then review it before adding.'
            : 'Review and edit the task, then confirm.'}
        </p>

        {(error || speech.error) && (
          <p className="mb-3 text-sm text-red-400">{error || speech.error}</p>
        )}

        {step === 'listen' ? (
          <>
            {!speech.supported ? (
              <p className="mb-4 text-sm text-amber-400">
                Voice input works best in Chrome or Edge. You can still type your task below.
              </p>
            ) : (
              <div className="mb-4 flex flex-wrap gap-2">
                {!speech.listening ? (
                  <button type="button" className={btnRecordStart} onClick={speech.start}>
                    <Mic className="h-4 w-4 shrink-0" aria-hidden />
                    Start recording
                  </button>
                ) : (
                  <button type="button" className={btnRecordStop} onClick={speech.stop}>
                    <Square className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden />
                    Stop recording
                  </button>
                )}
              </div>
            )}

            {speech.listening && (
              <p className="mb-3 flex items-center gap-2 text-sm text-violet-300">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet-400" />
                <Mic className="h-4 w-4" aria-hidden />
                Listening…
              </p>
            )}

            <label className="mb-1 block text-xs font-medium text-slate-400">
              What you said (editable)
            </label>
            <textarea
              className="mb-4 w-full resize-y rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={4}
              value={speech.transcript}
              onChange={(e) => speech.setTranscript(e.target.value)}
              placeholder="e.g. High priority task to fix login bug on staging by Friday"
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnPrimary}
                onClick={handleProcessTranscript}
                disabled={parsing || !speech.transcript.trim()}
              >
                {parsing ? 'Processing…' : 'Preview task'}
              </button>
              <button type="button" className={btnSecondary} onClick={handleClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          preview && (
            <>
              <p className="mb-3 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-500">
                Heard: &ldquo;{preview.transcript}&rdquo;
              </p>
              <TaskForm
                key={preview.transcript}
                initial={{
                  title: preview.title,
                  description: preview.description,
                  priority: preview.priority,
                  status: preview.status,
                }}
                onSubmit={handleConfirm}
                onCancel={handleRecordAgain}
                submitLabel="Add to tasks"
              />
            </>
          )
        )}
      </div>
    </div>
  );
}
