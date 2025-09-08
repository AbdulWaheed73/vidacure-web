import React from 'react';

const DoctorInbox: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-manrope">
          Doctor Inbox
        </h1>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Communication Hub
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Manage patient communications, review messages, and handle consultation requests.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-purple-100 rounded-lg">
            <span className="text-purple-800 font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">New Messages</h3>
            <p className="text-gray-600">Unread patient communications</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Consultation Requests</h3>
            <p className="text-gray-600">Pending appointment requests</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Follow-up Tasks</h3>
            <p className="text-gray-600">Patient care reminders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInbox;