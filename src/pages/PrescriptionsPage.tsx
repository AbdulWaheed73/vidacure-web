import React from 'react';
import { Pill } from 'lucide-react';

export const PrescriptionsPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Pill className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">Prescriptions</h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          View and manage your medications and prescriptions
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="text-center py-12">
          <Pill className="size-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
            No prescriptions found
          </h2>
          <p className="text-gray-500 font-manrope">
            Your current and past prescriptions will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};