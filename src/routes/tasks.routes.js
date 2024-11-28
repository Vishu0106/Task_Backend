import express from 'express';
import { createTask, getAllTasks, updateTaskStatus, getDashboardStatistics, deleteTask } from '../controllers/tasks.controller.js';
import verifyToken from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks);
router.put('/', verifyToken, updateTaskStatus);
router.get('/dashboard', verifyToken, getDashboardStatistics);
router.delete('/', verifyToken, deleteTask);

export default router;
