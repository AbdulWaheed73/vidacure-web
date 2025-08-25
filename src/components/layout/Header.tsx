import React from 'react';
import { getClientType } from '../../utils';

export const Header: React.FC = () => {
  const clientType = getClientType();

  const getClientTypeDisplay = () => {
    switch (clientType) {
      case 'web':
        return '🌐 Desktop Web';
      case 'mobile':
        return '📱 Mobile Browser';
      case 'app':
        return '📱 Native App';
      default:
        return clientType;
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          🏥 Vidacure Healthcare System
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Secure Authentication with BankID
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Detected as: {getClientTypeDisplay()}
        </p>
      </div>
    </header>
  );
};
