import { apiClient } from '@/api/apiClient';
import type { CreateTaskInput, DecomposeSubtask, Task, TaskStatus } from '@/types/task';

export type TasksListParams = {
  status?: TaskStatus;
  sortBy?: 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export const taskApi = {
  list(params: TasksListParams): Promise<Task[]> {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.sortBy) q.set('sortBy', params.sortBy);
    if (params.sortOrder) q.set('sortOrder', params.sortOrder);
    q.set('parentId', 'null');
    return apiClient(`/api/tasks?${q}`);
  },

  create(data: CreateTaskInput): Promise<Task> {
    return apiClient('/api/tasks', { method: 'POST', body: JSON.stringify(data) });
  },

  update(id: string, data: Partial<CreateTaskInput>): Promise<Task> {
    return apiClient(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete(id: string): Promise<void> {
    return apiClient(`/api/tasks/${id}`, { method: 'DELETE' });
  },

  addDecomposed(params: {
    title: string;
    description?: string;
    parentTaskId?: string;
    subtasks: DecomposeSubtask[];
  }): Promise<{ parentTaskId: string; created: Task[] }> {
    return apiClient('/api/tasks/decomposed', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};
