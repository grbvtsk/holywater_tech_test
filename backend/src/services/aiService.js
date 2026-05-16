import OpenAI from 'openai';
import { config } from '../config/index.js';
import {
  DECOMPOSE_SYSTEM_PROMPT,
  PARSE_VOICE_TASK_SYSTEM_PROMPT,
  STATUS_UPDATE_SYSTEM_PROMPT,
  STATUS_UPDATE_TONE_HINTS,
} from '../constants/aiPrompts.js';
import * as taskService from './taskService.js';

const openai = config.openaiApiKey
  ? new OpenAI({ apiKey: config.openaiApiKey })
  : null;

function ensureOpenAI() {
  if (!openai) {
    const err = new Error('OPENAI_API_KEY is not configured');
    err.status = 503;
    throw err;
  }
  return openai;
}

async function chatJson(systemPrompt, userPrompt) {
  const client = ensureOpenAI();
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  return JSON.parse(content);
}

export async function decomposeTask({ title, description }) {
  const result = await chatJson(
    DECOMPOSE_SYSTEM_PROMPT,
    `Title: ${title}\nDescription: ${description || '(no description)'}`
  );

  if (result.needsClarification) {
    return {
      needsClarification: true,
      questions: result.questions || [],
    };
  }

  const subtasks = (result.subtasks || []).map((st) => ({
    title: st.title,
    description: st.description || '',
    priority: ['low', 'medium', 'high'].includes(st.priority) ? st.priority : 'medium',
  }));

  return {
    needsClarification: false,
    subtasks,
  };
}

export async function generateStatusUpdate({ taskId, tone }) {
  const task = await taskService.getTaskById(taskId);

  const toneHint = STATUS_UPDATE_TONE_HINTS[tone];

  const context = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    notes: task.notes,
    subtasks: task.subtasks.map((st) => ({
      title: st.title,
      status: st.status,
      priority: st.priority,
    })),
  };

  const result = await chatJson(
    STATUS_UPDATE_SYSTEM_PROMPT + `\nTone: ${toneHint}`,
    JSON.stringify(context, null, 2)
  );

  return { update: result.update || '' };
}

export async function parseVoiceTask({ transcript }) {
  const result = await chatJson(PARSE_VOICE_TASK_SYSTEM_PROMPT, transcript.trim());

  return {
    title: String(result.title || transcript).slice(0, 200),
    description: String(result.description || '').slice(0, 5000),
    priority: ['low', 'medium', 'high'].includes(result.priority) ? result.priority : 'medium',
    status: ['todo', 'in_progress', 'done'].includes(result.status) ? result.status : 'todo',
    transcript: transcript.trim(),
  };
}
