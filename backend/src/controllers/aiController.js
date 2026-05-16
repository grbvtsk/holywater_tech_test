import * as aiService from '../services/aiService.js';
import { decomposeSchema, parseVoiceTaskSchema, statusUpdateSchema } from '../utils/validation.js';

export async function decompose(req, res, next) {
  try {
    const data = decomposeSchema.parse(req.body);
    const result = await aiService.decomposeTask(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function statusUpdate(req, res, next) {
  try {
    const data = statusUpdateSchema.parse(req.body);
    const result = await aiService.generateStatusUpdate(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function parseVoiceTask(req, res, next) {
  try {
    const data = parseVoiceTaskSchema.parse(req.body);
    const result = await aiService.parseVoiceTask(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
