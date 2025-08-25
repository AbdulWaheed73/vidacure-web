import React from 'react';
import { Button } from '../components/ui';
import type { User } from '../types';

interface DashboardPageProps {
  user: User | null;
  onLogout: () => void;
  loading: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, loading }) => {
  const dashboardActions = [
    { title: '📋 View Medical Records', description: 'Access your medical history and records' },
    { title: '📅 Schedule Appointments', description: 'Book appointments with healthcare providers' },
    { title: '💊 Manage Prescriptions', description: 'View and manage your prescriptions' },
    { title: '📊 Health Analytics', description: 'View your health data and analytics' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
      {/* User Info */}
      <div className="text-center mb-8 pb-8 border-b-2 border-blue-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          👋 Welcome back!
        </h2>
        {user && (
          <div className="inline-block bg-blue-50 px-6 py-4 rounded-xl">
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>
        )}
      </div>
      
      {/* Dashboard Actions */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🚀 Available Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardActions.map((action, index) => (
            <button 
              key={index}
              className="bg-white border-2 border-blue-200 p-6 rounded-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg text-left"
            >
              <div className="text-lg font-medium mb-2">
                {action.title}
              </div>
              <div className="text-sm text-gray-600">
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="text-center">
        <Button 
          onClick={onLogout}
          disabled={loading}
          variant="danger"
          size="lg"
        >
          {loading ? 'Logging out...' : '🚪 Logout'}
        </Button>
      </div>
    </div>
  );
};
