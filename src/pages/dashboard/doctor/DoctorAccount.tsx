import React from 'react';

const DoctorAccount: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-manrope">
          Doctor Account
        </h1>
        
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Account Management
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Manage your doctor profile, preferences, and account settings. Update your information and customize your experience.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-indigo-100 rounded-lg">
            <span className="text-indigo-800 font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Profile Information</h3>
            <p className="text-gray-600">Update your professional details</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Notification Settings</h3>
            <p className="text-gray-600">Manage your alert preferences</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Security Settings</h3>
            <p className="text-gray-600">Password and security options</p>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="font-medium text-gray-800">Update Profile Picture</div>
              <div className="text-gray-600 text-sm">Change your profile photo</div>
            </button>
            
            <button className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="font-medium text-gray-800">Change Password</div>
              <div className="text-gray-600 text-sm">Update your login credentials</div>
            </button>
            
            <button className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="font-medium text-gray-800">Notification Preferences</div>
              <div className="text-gray-600 text-sm">Customize your alerts</div>
            </button>
            
            <button className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="font-medium text-gray-800">Privacy Settings</div>
              <div className="text-gray-600 text-sm">Manage data and privacy</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAccount;