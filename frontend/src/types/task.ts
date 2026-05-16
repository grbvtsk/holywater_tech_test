export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  notes: string;
  subtasks?: Task[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  notes?: string;
  parentId?: string | null;
}

export interface DecomposeSubtask {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface DecomposeResult {
  needsClarification: boolean;
  questions?: string[];
  subtasks?: DecomposeSubtask[];
  parentTaskId?: string;
  created?: Task[];
}

export interface StatusUpdateResult {
  update: string;
}

export interface ParsedVoiceTask extends CreateTaskInput {
  transcript: string;
}
