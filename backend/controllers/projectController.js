const Project = require('../models/Project');
const Task = require('../models/Task');

// Create new project (max 4 per user)
const createProject = async (req, res) => {
  const { title, description } = req.body;
  const existingProjects = await Project.find({ user: req.user._id });

  if (existingProjects.length >= 4) {
    return res.status(400).json({ message: 'Maximum 4 projects allowed per user.' });
  }

  const project = await Project.create({
    title,
    description,
    user: req.user._id,
  });

  res.status(201).json(project);
};

// Get all projects of logged-in user
const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.status(200).json(projects);
};

// Get project by ID (for TaskManagement page)
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Invalid project ID' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the project belongs to the user
    if (!project.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete all related tasks
    await Task.deleteMany({ project: project._id });

    // Delete the project itself
    await project.deleteOne();

    res.status(200).json({ message: 'Project and tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
};
