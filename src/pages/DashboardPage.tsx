import React, { useState, useEffect } from 'react';
import { SubscriptionCard, SubscriptionStatusComponent } from '../components/subscription';
import { PaymentService, type SubscriptionStatus } from '../services';
import type { DashboardPageProps } from '../types';


export const DashboardPage: React.FC<DashboardPageProps> = ({ }) => {
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
    <div className="p-8">
      
      {/* Subscription Section */}
      {!subscriptionLoading && subscriptionStatus?.hasSubscription && (
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <SubscriptionStatusComponent onStatusChange={handleStatusChange} />
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      {!subscriptionLoading && !subscriptionStatus?.hasSubscription && (
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center font-manrope">
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
        </div>
      )}
    </div>
  );
};
