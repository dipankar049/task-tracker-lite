import { CheckCircle, List, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center mb-6 text-gray-800 leading-tight">
          Welcome to <span className="text-blue-600">Task Manager</span>
        </h1>

        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Simplify your daily planning with a clean, responsive, and intuitive task management system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<List className="w-12 h-12 text-blue-500 mb-4" />}
            title="Organize Tasks"
            description="Create, update, and track your tasks efficiently."
          />
          <FeatureCard
            icon={<CheckCircle className="w-12 h-12 text-green-500 mb-4" />}
            title="Status Management"
            description="Manage status easily: Pending, In Progress, or Completed."
          />
          <FeatureCard
            icon={<Lock className="w-12 h-12 text-purple-500 mb-4" />}
            title="User Authentication"
            description="Secure signup, login, and dashboard access."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300">
    {icon}
    <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Home;
