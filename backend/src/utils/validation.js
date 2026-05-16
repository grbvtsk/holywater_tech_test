import { z } from 'zod';

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().default(''),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  parentId: z.string().cuid().optional().nullable(),
  notes: z.string().max(5000).optional().default(''),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    notes: z.string().max(5000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  sortBy: z.enum(['priority', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  parentId: z
    .union([z.literal('null'), z.string().cuid()])
    .optional()
    .transform((v) => (v === 'null' ? null : v)),
});

export const decomposeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().default(''),
});

export const statusUpdateSchema = z.object({
  taskId: z.string().cuid(),
  tone: z.enum(['casual', 'professional', 'urgent']).optional().default('casual'),
});

export const parseVoiceTaskSchema = z.object({
  transcript: z.string().min(1, 'Transcript is required').max(5000),
});
