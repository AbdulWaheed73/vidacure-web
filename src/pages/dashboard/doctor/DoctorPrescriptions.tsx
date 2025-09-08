import React from 'react';

const DoctorPrescriptions: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-manrope">
          Doctor Prescriptions
        </h1>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">💊</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Prescription Management
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Create, manage, and track patient prescriptions. Monitor medication adherence and adjust treatments.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-lg">
            <span className="text-green-800 font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">New Prescription</h3>
            <p className="text-gray-600">Create prescription for patients</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Active Medications</h3>
            <p className="text-gray-600">Monitor current treatments</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Medication History</h3>
            <p className="text-gray-600">Review past prescriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;