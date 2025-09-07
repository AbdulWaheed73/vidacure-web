import React from 'react';
import { TrendingUp } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">My Progress</h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          Track your health journey and wellness goals
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="text-center py-12">
          <TrendingUp className="size-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
            Start tracking your progress
          </h2>
          <p className="text-gray-500 font-manrope">
            Your health metrics and progress charts will be shown here
          </p>
        </div>
      </div>
    </div>
  );
};