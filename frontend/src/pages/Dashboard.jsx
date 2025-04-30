import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [tasks, setTasks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        const projectRes = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectRes.data);

        const tasksData = {};
        for (const project of projectRes.data) {
          const taskRes = await axios.get(`http://localhost:5000/api/tasks/${project._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          tasksData[project._id] = taskRes.data;
        }
        setTasks(tasksData);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      return toast.error("Please fill in both title and description");
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/projects', newProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, res.data]);
      toast.success(`Project "${newProject.title}" added successfully`);
      setNewProject({ title: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add Project");
    }
  };

  // Add this at the top of your component or file
  const openDeleteToasts = new Set();

  const handleDeleteProject = (projectId, projectTitle) => {
    // Prevent multiple toasts for the same project
    if (openDeleteToasts.has(projectId)) return;

    openDeleteToasts.add(projectId);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const toastId = toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-medium">
            Delete project "<span className="text-red-600">{projectTitle}</span>"?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(toastId);
                openDeleteToasts.delete(projectId);
              }}
              className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setProjects((prev) => prev.filter((p) => p._id !== projectId));
                  const updatedTasks = { ...tasks };
                  delete updatedTasks[projectId];
                  setTasks(updatedTasks);
                  toast.dismiss(toastId);
                  toast.success('Project deleted successfully');
                } catch (err) {
                  toast.dismiss(toastId);
                  toast.error(err.response?.data?.message || 'Failed to delete project');
                } finally {
                  openDeleteToasts.delete(projectId);
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        limit: 1,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        onClose: () => openDeleteToasts.delete(projectId),
      }
    );
  };


  const handleGoToTaskManagement = (projectId) => {
    navigate(`/task-management/${projectId}`);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <div className="mt-8 px-4">

          {/* User Info Section */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.name}!</h2>
            <p>Email: {user?.email}</p>
            <p>Country: {user?.country}</p>
          </div>

          {/* Add Project Section */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="border px-4 py-2 rounded-md w-full md:w-1/3"
              />
              <input
                type="text"
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="border px-4 py-2 rounded-md w-full md:w-1/3"
              />
              <button
                onClick={handleAddProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Add Project
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Your Projects</h3>
            {projects.length > 0 ? (
              <div className="space-y-6 px-4 sm:px-0 overflow-x-hidden">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden"
                  >
                    {/* Project Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div className="min-w-0 break-words w-full">
                        <h4 className="text-xl font-semibold break-words break-all whitespace-normal w-full">
                          {project.title}
                        </h4>
                        <p className="text-gray-600 break-words break-all whitespace-normal w-full">
                          {project.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteProject(project._id, project.title)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm w-fit"
                        style={{ marginTop: '0.5rem' }}
                      >
                        Delete
                      </button>
                    </div>

                    {/* Tasks */}
                    <div>
                      <h5 className="font-medium mb-2">Tasks</h5>
                      {tasks[project._id]?.length > 0 ? (
                        <ul className="space-y-2 mb-4">
                          {tasks[project._id].map((task) => (
                            <li
                              key={task._id}
                              className="bg-gray-100 px-4 py-2 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                            >
                              <span className="font-medium break-words break-all whitespace-normal w-full">
                                {task.title}
                              </span>

                              <span className="text-sm text-gray-600 capitalize">
                                {task.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 mb-4">No tasks yet. Add your first task!</p>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleGoToTaskManagement(project._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                          View & Manage Tasks
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            ) : (
              <p className="text-gray-500">No projects found. Create your first project!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;