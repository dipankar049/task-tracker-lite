import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, User } from "lucide-react";


const Navbar = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigateDashboard = () => {
    if(window.location.pathname === '/dashboard') return;
    navigate('/dashboard');
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold tracking-wide text-blue-400 hover:text-blue-300 transition">
        TaskManager
      </Link>
      <div className="space-x-4 flex items-center">
        {!token ? (
          <>
            <Link to="/login" className="hidden sm:block text-white hover:text-blue-400 transition duration-200 font-medium">
              Login
            </Link>
            <Link to="/login"><LogIn className="sm:hidden w-6 h-6 text-blue-500 cursor-pointer"/></Link>
            <Link to="/signup" className="hidden sm:block text-white hover:text-blue-400 transition duration-200 font-medium">
              Signup
            </Link>
            <Link to="/signup"><UserPlus className="sm:hidden w-6 h-6 text-green-500 cursor-pointer" /></Link>
          </>
        ) : (
          <>
            <button onClick={handleNavigateDashboard} className="hidden sm:block text-white hover:text-blue-400 transition duration-200 font-medium">
              Dashboard
            </button>
            <button onClick={handleNavigateDashboard}>
              <User className="sm:hidden w-6 h-6 text-gray-400 cursor-pointer" />
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:block bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded-md transition duration-200"
            >
              Logout
            </button>
            <button onClick={handleLogout}><LogOut className="sm:hidden w-6 h-6 text-red-500 cursor-pointer" /></button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;