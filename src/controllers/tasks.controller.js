import { Task } from '../models/task.model.js';

const createTask = async (req, res) => {
  const { title, startTime, endTime, priority, status } = req.body;

  if (!title || !startTime || !endTime || !priority) {
    return res.status(400).json({ message: 'Title, start time, end time, and priority are required' });
  }

  try {
    const newTask = new Task({
      title,
      startTime,
      endTime,
      priority,
      status: status || 'pending',
      userId: req.user.id,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  const { priority, status, sortBy } = req.query;

  const filter = {};
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  try {
    const tasks = await Task.find({ userId: req.user.id, ...filter })
      .sort(sortBy ? { [sortBy]: 1 } : {})
      .exec();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;

  if (!status || !['pending', 'finished'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const task = await Task.findById(id);

    if (!task || task.userId.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    if (status === 'finished') {
      task.status = status;
      task.endTime = new Date(); // Set actual end time when finished
    }

    await task.save();
    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStatistics = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'finished').length;
    const pendingTasks = totalTasks - completedTasks;

    let totalTimeLapsed = 0;
    let totalEstimatedTimeLeft = 0;
    let totalCompletionTime = 0;

    tasks.forEach((task) => {
      const currentTime = new Date();
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);

      if (task.status === 'finished') {
        const completionTime = (endTime - startTime) / 3600000; // in hours
        totalCompletionTime += completionTime;
      } else {
        const timeLapsed = (currentTime - startTime) / 3600000; // in hours
        totalTimeLapsed += timeLapsed;
        const estimatedTimeLeft = endTime > currentTime ? (endTime - currentTime) / 3600000 : 0;
        totalEstimatedTimeLeft += estimatedTimeLeft;
      }
    });

    const avgCompletionTime = completedTasks > 0 ? totalCompletionTime / completedTasks : 0;

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      totalTimeLapsed: totalTimeLapsed.toFixed(2),
      totalEstimatedTimeLeft: totalEstimatedTimeLeft.toFixed(2),
      avgCompletionTime: avgCompletionTime.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
    const { id } = req.query; // Get task ID from query parameter
    if (!id) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
  
    try {
      const task = await Task.findByIdAndDelete(id); // Find and delete the task by ID
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export { createTask, getAllTasks, updateTaskStatus, getDashboardStatistics, deleteTask };
