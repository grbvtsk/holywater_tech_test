import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';

const router = Router();

router.get('/', taskController.listTasks);
router.post('/decomposed', taskController.createDecomposed);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
