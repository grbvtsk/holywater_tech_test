import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/api/ai/aiApi';

export const aiKeys = {
  all: ['ai'] as const,
};

export function useDecomposeMutation() {
  return useMutation({
    mutationFn: aiApi.decompose,
  });
}

export function useStatusUpdateMutation() {
  return useMutation({
    mutationFn: aiApi.statusUpdate,
  });
}

export function useParseVoiceTaskMutation() {
  return useMutation({
    mutationFn: (transcript: string) => aiApi.parseVoiceTask(transcript),
  });
}
