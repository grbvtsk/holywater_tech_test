import type {
  CreateTaskInput,
  DecomposeResult,
  DecomposeSubtask,
  ParsedVoiceTask,
  StatusUpdateResult,
  Task,
  TaskStatus,
} from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function fetchTasks(params: {
  status?: TaskStatus;
  sortBy?: 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}): Promise<Task[]> {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.sortBy) q.set('sortBy', params.sortBy);
  if (params.sortOrder) q.set('sortOrder', params.sortOrder);
  q.set('parentId', 'null');
  return request(`/api/tasks?${q}`);
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  return request('/api/tasks', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateTask(
  id: string,
  data: Partial<CreateTaskInput & { status: TaskStatus }>
): Promise<Task> {
  return request(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteTask(id: string): Promise<void> {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}

export async function decomposeTask(body: {
  title: string;
  description?: string;
}): Promise<DecomposeResult> {
  return request('/api/ai/decompose', { method: 'POST', body: JSON.stringify(body) });
}

export async function addDecomposedTasks(params: {
  title: string;
  description?: string;
  parentTaskId?: string;
  subtasks: DecomposeSubtask[];
}): Promise<{ parentTaskId: string; created: Task[] }> {
  let parentId = params.parentTaskId;

  if (!parentId) {
    const parent = await createTask({
      title: params.title,
      description: params.description ?? '',
      status: 'todo',
      priority: 'medium',
    });
    parentId = parent.id;
  }

  const created: Task[] = [];
  for (const st of params.subtasks) {
    const task = await createTask({
      title: st.title,
      description: st.description,
      priority: st.priority,
      status: 'todo',
      parentId,
    });
    created.push(task);
  }

  return { parentTaskId: parentId, created };
}

export async function generateStatusUpdate(body: {
  taskId: string;
  tone?: 'casual' | 'professional' | 'urgent';
}): Promise<StatusUpdateResult> {
  return request('/api/ai/status-update', { method: 'POST', body: JSON.stringify(body) });
}

export async function parseVoiceTask(transcript: string): Promise<ParsedVoiceTask> {
  return request('/api/ai/parse-voice-task', {
    method: 'POST',
    body: JSON.stringify({ transcript }),
  });
}
