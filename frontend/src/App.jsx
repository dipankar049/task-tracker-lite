import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import TaskManagementPage from './pages/TaskManagementPage';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Navbar from './components/dashboard/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task-management/:projectId" element={<TaskManagementPage />} />
        </Route>
      </Routes>
      <ToastContainer
        autoClose={3000}
        limit={3}
      />
    </BrowserRouter>
  );
}

export default App;
