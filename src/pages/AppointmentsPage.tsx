import React from 'react';
import { Calendar } from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">Appointments</h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          Manage your medical appointments and consultations
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="text-center py-12">
          <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
            No appointments scheduled
          </h2>
          <p className="text-gray-500 font-manrope">
            Your upcoming appointments will appear here
          </p>
        </div>
      </div>
    </div>
  );
};