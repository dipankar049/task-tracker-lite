import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold tracking-wide text-blue-400 hover:text-blue-300 transition">
        TaskManager
      </Link>
      <div className="space-x-4 flex items-center">
        {!token ? (
          <>
            <Link to="/login" className="text-white hover:text-blue-400 transition duration-200 font-medium">
              Login
            </Link>
            <Link to="/signup" className="text-white hover:text-blue-400 transition duration-200 font-medium">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-white hover:text-blue-400 transition duration-200 font-medium">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded-md transition duration-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;