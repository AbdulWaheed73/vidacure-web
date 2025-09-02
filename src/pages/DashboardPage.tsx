import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui';
import { SubscriptionCard, SubscriptionStatusComponent } from '../components/subscription';
import { PaymentService, type SubscriptionStatus } from '../services';
import type { DashboardPageProps } from '../types';


export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, loading }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);



  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await PaymentService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleStatusChange = () => {
    fetchSubscriptionStatus();
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
      {/* User Info */}
      <div className="text-center mb-8 pb-8 border-b-2 border-blue-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          👋 Welcome back!
        </h2>
        {user && (
          <div className="inline-block bg-blue-50 px-6 py-4 rounded-xl">
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>
        )}
      </div>
      
      {/* Subscription Section */}
      {!subscriptionLoading && subscriptionStatus?.hasSubscription && (
        <div className="mb-8">
          <SubscriptionStatusComponent onStatusChange={handleStatusChange} />
        </div>
      )}

      {/* Subscription Plans */}
      {!subscriptionLoading && !subscriptionStatus?.hasSubscription && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💎 Choose Your Plan
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <SubscriptionCard 
              planType="lifestyle"
              onSubscribeClick={() => {
                PaymentService.createCheckoutSession('lifestyle')
                  .then(({ url }) => window.location.href = url)
                  .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to start checkout. Please try again.');
                  });
              }}
            />
            <SubscriptionCard 
              planType="medical"
              onSubscribeClick={() => {
                PaymentService.createCheckoutSession('medical')
                  .then(({ url }) => window.location.href = url)
                  .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to start checkout. Please try again.');
                  });
              }}
            />
          </div>
        </div>
      )}


      
      {/* Logout Button */}
      <div className="text-center">
        <Button 
          onClick={onLogout}
          disabled={loading}
          variant="destructive"
          size="lg"
        >
          {loading ? 'Logging out...' : '🚪 Logout'}
        </Button>
      </div>
    </div>
  );
};
