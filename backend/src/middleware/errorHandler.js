import { ZodError } from 'zod';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Task not found' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}
