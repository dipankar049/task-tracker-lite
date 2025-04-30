import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeProjectId, setActiveProjectId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        const projectRes = await axios.get(`${apiUrl}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectRes.data);

        // Fetch tasks for each project
        const taskPromises = projectRes.data.map(project =>
          axios.get(`${apiUrl}/api/tasks/${project._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const taskResponses = await Promise.all(taskPromises);
        const tasksData = taskResponses.reduce((acc, res, index) => {
          acc[projects[index]._id] = res.data;
          return acc;
        }, {});

        setTasks(tasksData);

      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async (projectId) => {
    if (!newTask.title || !newTask.description) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/tasks`, {
        ...newTask,
        projectId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update tasks state
      setTasks(prevTasks => ({
        ...prevTasks,
        [projectId]: [...prevTasks[projectId], res.data]
      }));

      // Reset form
      setNewTask({ title: '', description: '', status: 'pending' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding task');
    }
  };

  const handleDeleteTask = async (taskId, projectId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted task from state
      setTasks(prevTasks => ({
        ...prevTasks,
        [projectId]: prevTasks[projectId].filter(task => task._id !== taskId)
      }));

    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting task');
    }
  };

  const handleChange = (e) => {
    setNewTask(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <p>Country: {user?.country}</p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
            {projects.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded-md">
                {projects.map((project) => (
                  <div key={project._id} className="mb-4">
                    <h4 className="text-lg font-semibold">{project.title}</h4>
                    <p>{project.description}</p>

                    <div className="mt-4">
                      <button
                        onClick={() => setActiveProjectId(project._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Add Task
                      </button>

                      {activeProjectId === project._id && (
                        <div className="mt-4">
                          <input
                            type="text"
                            name="title"
                            value={newTask.title}
                            onChange={handleChange}
                            placeholder="Task Title"
                            className="p-2 border rounded-md"
                          />
                          <textarea
                            name="description"
                            value={newTask.description}
                            onChange={handleChange}
                            placeholder="Task Description"
                            className="p-2 border rounded-md mt-2"
                          />
                          <button
                            onClick={() => handleAddTask(project._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                          >
                            Add Task
                          </button>
                        </div>
                      )}

                      <div className="mt-4">
                        <h5 className="font-semibold">Tasks:</h5>
                        <div className="space-y-2">
                          {tasks[project._id] && tasks[project._id].map(task => (
                            <div key={task._id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md">
                              <div>
                                <h6>{task.title}</h6>
                                <p>{task.description}</p>
                              </div>
                              <div>
                                <button
                                  onClick={() => handleDeleteTask(task._id, project._id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No projects found. Create your first project!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
