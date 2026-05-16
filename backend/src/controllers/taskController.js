import * as taskService from '../services/taskService.js';
import {
  createTaskSchema,
  createDecomposedSchema,
  updateTaskSchema,
  listTasksQuerySchema,
} from '../utils/validation.js';

export async function listTasks(req, res, next) {
  try {
    const query = listTasksQuerySchema.parse(req.query);
    const tasks = await taskService.listTasks(query);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(data);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function createDecomposed(req, res, next) {
  try {
    const data = createDecomposedSchema.parse(req.body);
    const result = await taskService.createDecomposedTasks(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(req.params.id, data);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
