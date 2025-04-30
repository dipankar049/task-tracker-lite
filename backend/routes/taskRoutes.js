const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Create task
router.post('/', protect, createTask);

// Get tasks by project ID
router.get('/:projectId', protect, getTasksByProject);

// Update a task
router.put('/:id', protect, updateTask);

// Delete a task
router.delete('/:id', protect, deleteTask);

module.exports = router;
