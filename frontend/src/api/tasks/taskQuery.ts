import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi, type TasksListParams } from '@/api/tasks/taskApi';
import type { CreateTaskInput } from '@/types/task';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: TasksListParams) => [...taskKeys.lists(), params] as const,
};

export function useTasksQuery(params: TasksListParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => taskApi.list(params),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskInput> }) =>
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useAddDecomposedTasksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.addDecomposed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
