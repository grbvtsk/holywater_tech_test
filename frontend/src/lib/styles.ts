export const labelClass = 'mb-1 block text-xs font-medium text-slate-400';

export const inputClass =
  'w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40';

export const selectClass = inputClass;

export const textareaClass = `${inputClass} min-h-[80px] resize-y`;

export const btnPrimary =
  'rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50';

export const btnSecondary =
  'rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50';

export const btnVoice =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-600/40 ring-1 ring-violet-400/60 transition hover:bg-violet-500 hover:shadow-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-400/80 disabled:cursor-not-allowed disabled:opacity-50';

export const btnRecordStart =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400/50 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50';

export const btnRecordStop =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/50 bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50';

export const btnDanger =
  'rounded-lg border border-red-500/60 bg-transparent px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50';

export const formGroupClass = 'mb-4';

export const panelClass = 'rounded-xl border border-slate-700 bg-slate-900 p-5';

export const badgeBase = 'rounded px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide';

export const priorityBadge: Record<string, string> = {
  high: `${badgeBase} bg-red-500/20 text-red-400`,
  medium: `${badgeBase} bg-amber-500/20 text-amber-400`,
  low: `${badgeBase} bg-slate-500/20 text-slate-400`,
};

export const statusBadge: Record<string, string> = {
  todo: `${badgeBase} bg-slate-700 text-slate-300`,
  in_progress: `${badgeBase} bg-blue-500/20 text-blue-300`,
  done: `${badgeBase} bg-emerald-500/20 text-emerald-400`,
};
