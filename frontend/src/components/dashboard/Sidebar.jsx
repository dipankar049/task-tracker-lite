import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Task Tracker</h2>
      <ul>
        <li><Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li><Link to="/projects" className="block py-2 px-4 hover:bg-gray-700 rounded">Projects</Link></li>
        <li><Link to="/tasks" className="block py-2 px-4 hover:bg-gray-700 rounded">Tasks</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
