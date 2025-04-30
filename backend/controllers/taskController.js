const Task = require('../models/Task');

// Create new task under a project
const createTask = async (req, res) => {
  const { title, description, status, projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  const task = await Task.create({
    title,
    description,
    status,
    project: projectId,
  });

  res.status(201).json(task);
};

// Get all tasks for a specific project
const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId });
  res.status(200).json(tasks);
};

// Update a task (title, description, status)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;

  // If status becomes completed, set completedAt
  if (status === 'completed') {
    task.completedAt = new Date();
  }

  const updatedTask = await task.save();
  res.status(200).json(updatedTask);
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await task.deleteOne();
  res.status(200).json({ message: 'Task deleted successfully' });
};

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
