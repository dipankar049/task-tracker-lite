import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let timeoutReached = false;

    // Set a timeout to show a message if the server takes too long (8 seconds in this case)
    const timeoutId = setTimeout(() => {
      timeoutReached = true;
      toast.info('Server is waking up. Please wait up to 1 minute...', { autoClose: 5000 });
    }, 8000);  // Change timeout to 8000ms (8 seconds)

    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        ...formData,
        rememberMe,
      });

      if (timeoutReached) {
        clearTimeout(timeoutId); // Clear timeout if the request completed before 8 seconds
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', res.data.token);

      toast.success('Login successful', { autoClose: 2000 });
      navigate('/dashboard');
    } catch (err) {
      if (timeoutReached) {
        clearTimeout(timeoutId); // Clear timeout if the request completed before 8 seconds
      }

      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Welcome Back 👋</h1>
        <p className="text-center text-gray-600 mb-6">Please login to your account</p>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-blue-500"
                required
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* 🔽 Add this loading message block here */}
          {loading && (
            <div className="text-center text-sm text-gray-600 mt-2 animate-pulse">
              Please wait... waking up the server.
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?
          <a onClick={() => navigate('/signup')} className="text-blue-600 ml-1 hover:underline cursor-pointer">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;