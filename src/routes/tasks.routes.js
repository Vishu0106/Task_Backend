import express from 'express';
import { createTask, getAllTasks, updateTaskStatus, getDashboardStatistics } from '../controllers/tasks.controller.js';
import verifyToken from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks);
router.put('/', verifyToken, updateTaskStatus);
router.get('/dashboard', verifyToken, getDashboardStatistics);

export default router;
