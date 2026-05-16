import { prisma } from '../lib/prisma.js';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function sortByPriority(tasks, order = 'desc') {
  const dir = order === 'asc' ? 1 : -1;
  return [...tasks].sort((a, b) => {
    const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return diff * dir;
  });
}

export async function listTasks({ status, sortBy, sortOrder, parentId }) {
  const where = {
    ...(status ? { status } : {}),
    ...(parentId !== undefined ? { parentId } : { parentId: null }),
  };

  const tasks = await prisma.task.findMany({
    where,
    include: {
      subtasks: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy:
      sortBy === 'createdAt'
        ? { createdAt: sortOrder }
        : undefined,
  });

  if (sortBy === 'priority') {
    return sortByPriority(tasks, sortOrder);
  }

  return tasks;
}

export async function getTaskById(id) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      subtasks: { orderBy: { createdAt: 'asc' } },
      parent: true,
    },
  });

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  return task;
}

export async function createTask(data) {
  if (data.parentId) {
    const parent = await prisma.task.findUnique({ where: { id: data.parentId } });
    if (!parent) {
      const err = new Error('Parent task not found');
      err.status = 404;
      throw err;
    }
  }

  return prisma.task.create({
    data,
    include: { subtasks: true },
  });
}

export async function updateTask(id, data) {
  await getTaskById(id);
  return prisma.task.update({
    where: { id },
    data,
    include: { subtasks: { orderBy: { createdAt: 'asc' } } },
  });
}

export async function deleteTask(id) {
  await getTaskById(id);
  await prisma.task.delete({ where: { id } });
  return { success: true };
}

export async function createSubtasks(parentId, subtasks) {
  await getTaskById(parentId);

  const created = await prisma.$transaction(
    subtasks.map((st) =>
      prisma.task.create({
        data: {
          title: st.title,
          description: st.description || '',
          priority: st.priority || 'medium',
          status: 'todo',
          parentId,
        },
      })
    )
  );

  return created;
}
