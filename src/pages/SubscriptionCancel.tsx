import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const SubscriptionCancel: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTryAgain = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-yellow-500 text-6xl mb-4">😔</div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Cancelled
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled and no charges were made. You can try again anytime or contact our support if you need help.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Need help?</h3>
          <p className="text-sm text-blue-700">
            If you encountered any issues during checkout, our support team is here to help. Contact us and we'll get you set up quickly.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleTryAgain} className="w-full" size="lg">
            Try Again
          </Button>
          
          <Button 
            onClick={handleGoToDashboard} 
            variant="outline" 
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <p className="text-xs text-gray-500">
            Your account is still active and you can subscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};