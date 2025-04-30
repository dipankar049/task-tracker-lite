import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
const apiUrl = import.meta.env.VITE_API_URL;

const TaskManagementPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!token) return;

      try {
        // Fetch Project Title
        const projectRes = await axios.get(`${apiUrl}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectTitle(projectRes.data.title);

        // Fetch Tasks
        const taskRes = await axios.get(`${apiUrl}/api/tasks/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(taskRes.data);
      } catch (err) {
        toast.error('Failed to load data');
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description) {
      return toast.warn('Please fill in both title and description');
    }

    try {
      const res = await axios.post(`${apiUrl}/api/tasks`, {
        ...newTask,
        projectId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks([...tasks, res.data]);
      toast.success('Task added successfully');
      setNewTask({ title: '', description: '', status: 'pending' });
    } catch (err) {
      toast.error('Failed to add task');
      setError('Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${apiUrl}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
      setError('Failed to delete task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      const res = await axios.put(`${apiUrl}/api/tasks/${taskId}`, {
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.map(task => (task._id === taskId ? res.data : task)));
      toast.info('Task status updated');
    } catch (err) {
      toast.error('Failed to update task');
      setError('Failed to update task');
    }
  };

  const handleChange = (e) => {
    setNewTask(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Tasks - {projectTitle}</h2>
          </div>

          {/* Add Task */}
          <div className="mt-6 bg-white shadow-md p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>

            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleChange}
              placeholder="Task Title"
              className="w-full p-2 border rounded-md mb-4"
            />

            <textarea
              name="description"
              value={newTask.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full p-2 border rounded-md mb-4"
            />

            <select
              name="status"
              value={newTask.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="text-right">
              <button
                onClick={handleAddTask}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="mt-8 overflow-x-hidden">
            <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>
            {tasks.length === 0 ? (
              <p className="text-gray-600">No tasks found. Add your first task!</p>
            ) : (
              <div className="space-y-4">
                {tasks.map(task => (
                  <div
                    key={task._id}
                    className="bg-gray-100 p-4 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 overflow-hidden"
                  >
                    {/* Text Section */}
                    <div className="flex-1 min-w-0 break-words">
                      <h4 className="font-bold text-base mb-1 break-words">{task.title}</h4>
                      <p className="text-sm mb-1 break-words">{task.description}</p>
                      <p className="text-sm">
                        Status: <span className="font-medium">{task.status}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {dayjs(task.createdAt).format('MMM D, YYYY h:mm A')}
                      </p>
                      {task.status === 'completed' && (
                        <p className="text-xs text-gray-500">
                          Completed: {dayjs(task.completedAt).format('MMM D, YYYY h:mm A')}
                        </p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                        className="border p-1 rounded-md text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskManagementPage;
