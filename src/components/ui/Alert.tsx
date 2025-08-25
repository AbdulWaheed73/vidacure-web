import React from 'react';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose, action }) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const icon = type === 'error' ? '⚠️' : '✅';
  const actionBgColor = type === 'error' ? 'bg-red-600' : 'bg-white';
  const actionTextColor = type === 'error' ? 'text-white' : 'text-green-600';

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg mb-8 flex justify-between items-center shadow-lg`}>
      <span className="flex items-center">
        <span className="text-xl mr-2">{icon}</span>
        {message}
      </span>
      <div className="flex items-center space-x-2">
        {action && (
          <button 
            onClick={action.onClick}
            className={`${actionBgColor} ${actionTextColor} px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors`}
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
