import { apiClient } from '@/api/apiClient';
import type { DecomposeResult, ParsedVoiceTask, StatusUpdateResult } from '@/types/task';

export const aiApi = {
  decompose(body: { title: string; description?: string }): Promise<DecomposeResult> {
    return apiClient('/api/ai/decompose', { method: 'POST', body: JSON.stringify(body) });
  },

  statusUpdate(body: {
    taskId: string;
    tone?: 'casual' | 'professional' | 'urgent';
  }): Promise<StatusUpdateResult> {
    return apiClient('/api/ai/status-update', { method: 'POST', body: JSON.stringify(body) });
  },

  parseVoiceTask(transcript: string): Promise<ParsedVoiceTask> {
    return apiClient('/api/ai/parse-voice-task', {
      method: 'POST',
      body: JSON.stringify({ transcript }),
    });
  },
};
