import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PaymentService } from '../services';

export const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    // Fetch subscription status to get the latest information
    fetchSubscriptionDetails();
  }, [sessionId]);

  const fetchSubscriptionDetails = async () => {
    try {
      // Give the webhook some time to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const status = await PaymentService.getSubscriptionStatus();
      setSubscriptionDetails(status);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      setError('Failed to fetch subscription details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing your subscription...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleGoToDashboard} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">🎉</div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Vidacure!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your subscription has been successfully activated. You now have access to all the features of your plan.
        </p>

        {subscriptionDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Subscription Details:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">
                  {subscriptionDetails.planType === 'lifestyle' ? 'Lifestyle Program' : 'Medical Program'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={handleGoToDashboard} className="w-full" size="lg">
            Go to Dashboard
          </Button>
          
          <p className="text-xs text-gray-500">
            You can manage your subscription anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};