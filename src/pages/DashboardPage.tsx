import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionCard, MeetingRequired } from '../components/subscription';
import { WeightProgressCard, NextAppointmentCard, PrescriptionCard, BMICard, GoalsCard } from '../components/dashboard';
import { PaymentService } from '../services';
import { queryKeys } from '../lib/queryClient';
import type { DashboardPageProps } from '../types';


export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const { t } = useTranslation();

  const { data: subscriptionStatus, isLoading: subscriptionLoading } = useQuery({
    queryKey: queryKeys.subscriptionStatus,
    queryFn: () => PaymentService.getSubscriptionStatus(),
  });

  return (
    <div className="p-8">

      {/* Active subscription — show full dashboard */}
      {!subscriptionLoading && subscriptionStatus?.hasSubscription && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1: Weight Progress (2 cols) + Next Appointment (1 col) */}
          <WeightProgressCard />
          <NextAppointmentCard />

          {/* Row 2: Prescription + BMI + Goals */}
          <PrescriptionCard />
          <BMICard />
          <GoalsCard />
        </div>
      )}

      {/* No subscription — show subscription plans with meeting gate */}
      {!subscriptionLoading && !subscriptionStatus?.hasSubscription && (
        <div className="mb-8">
          <MeetingRequired>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center font-manrope">
                {t('dashboard.choosePlan')}
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
          </MeetingRequired>
        </div>
      )}
    </div>
  );
};
