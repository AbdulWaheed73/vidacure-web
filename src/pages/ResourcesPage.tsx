import React from 'react';
import { BookOpen } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">Resources</h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          Access health articles, guides, and educational materials
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="text-center py-12">
          <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
            Health resources coming soon
          </h2>
          <p className="text-gray-500 font-manrope">
            Educational content and health resources will be available here
          </p>
        </div>
      </div>
    </div>
  );
};