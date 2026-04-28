import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Phone } from 'lucide-react';
import { WeightProgressCard, NextAppointmentCard, PrescriptionCard, BMICard, GoalsCard } from '../components/dashboard';
import { PaymentService } from '../services';
import { queryKeys } from '../lib/queryClient';
import { Button } from '../components/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import { CompletePhoneModal } from '../components/CompletePhoneModal';
import { usePatientProfile } from '../hooks/useDashboardQueries';
import { ROUTES } from '../constants';
import type { DashboardPageProps } from '../types';


export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: subscriptionStatus, isLoading: subscriptionLoading } = useQuery({
    queryKey: queryKeys.subscriptionStatus,
    queryFn: () => PaymentService.getSubscriptionStatus(),
  });

  const { data: profileData } = usePatientProfile();
  const profile = profileData?.profile;
  const needsPhone = !!profile && profile.hasCompletedOnboarding === true && !profile.phone;
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-8">
        {needsPhone && (
          <Alert className="mb-6 border-[#c0ebe5] bg-[#f0f7f4] flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#005044] mt-0.5 shrink-0" />
            <div className="flex-1">
              <AlertTitle className="font-sora text-[#005044]">
                {t('dashboard.completePhone.title')}
              </AlertTitle>
              <AlertDescription className="font-manrope text-[#282828]">
                {t('dashboard.completePhone.description')}
              </AlertDescription>
            </div>
            <Button
              onClick={() => setPhoneModalOpen(true)}
              className="bg-[#005044] hover:bg-[#003d33] text-white rounded-full px-5 py-2 font-sora text-sm shrink-0"
            >
              {t('dashboard.completePhone.cta')}
            </Button>
          </Alert>
        )}

        <CompletePhoneModal open={phoneModalOpen} onOpenChange={setPhoneModalOpen} />

        {/* <PromoBanner /> */}

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

        {/* No subscription — show subscribe prompt (only reachable after meeting gate passes) */}
        {!subscriptionLoading && !subscriptionStatus?.hasSubscription && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
                {t('dashboard.choosePlan')}
              </h2>
              <p className="text-gray-600 mb-6 font-manrope">
                {t('dashboard.subscribePrompt')}
              </p>
              <Button
                onClick={() => navigate(ROUTES.SUBSCRIBE)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                {t('dashboard.subscribeCTA')}
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};
