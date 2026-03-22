import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { PaymentService } from '../services';
import vidaCure from '../assets/vidacure_png.png';

export const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError(t('subscriptionSuccess.noSessionId'));
      setIsLoading(false);
      return;
    }

    fetchSubscriptionDetails();
  }, [sessionId]);

  const fetchSubscriptionDetails = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const status = await PaymentService.getSubscriptionStatus();
      setSubscriptionDetails(status);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      setError(t('subscriptionSuccess.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const Header = () => (
    <div className="w-full left-0 top-0 absolute bg-white shadow-sm flex flex-col justify-center items-start z-10">
      <div className="w-full max-w-7xl mx-auto py-3 px-4 sm:py-5 sm:px-6 flex justify-start items-center gap-4 sm:gap-8">
        <div
          className="w-6 h-6 relative overflow-hidden cursor-pointer"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 absolute left-1 top-1 text-zinc-800" />
        </div>
        <div className="flex justify-start items-center">
          <img className="w-28 h-4 sm:w-36 sm:h-5" src={vidaCure} alt="VidaCure Logo" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen relative bg-emerald-50 overflow-hidden">
        <Header />
        <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg px-6 py-8 sm:px-8 sm:py-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-xl sm:rounded-2xl shadow-lg border border-stone-50 flex flex-col justify-center items-center gap-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold font-sora text-zinc-800">
              {t('subscriptionSuccess.processing')}
            </h2>
            <p className="text-sm sm:text-base font-manrope text-teal-700">
              {t('subscriptionSuccess.pleaseWait')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen relative bg-red-50 overflow-hidden">
        <Header />
        <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg px-6 py-8 sm:px-8 sm:py-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-xl sm:rounded-2xl shadow-lg border border-stone-50 flex flex-col justify-center items-center gap-6">
          <AlertTriangle className="w-16 h-16 text-error-red" />
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-xl sm:text-2xl font-bold font-sora text-zinc-800">
              {t('subscriptionSuccess.errorTitle')}
            </h2>
            <p className="text-sm sm:text-base font-manrope text-zinc-600">
              {error}
            </p>
          </div>
          <button
            onClick={handleGoToDashboard}
            className="w-full h-12 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full text-white font-semibold font-sora hover:from-teal-700 hover:to-teal-700 transition-colors"
          >
            {t('subscriptionSuccess.goToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative bg-emerald-50 overflow-hidden">
      <Header />
      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg px-6 py-8 sm:px-8 sm:py-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-xl sm:rounded-2xl shadow-lg border border-stone-50 flex flex-col justify-center items-center gap-6 sm:gap-8">
        <div className="w-20 h-20 rounded-full bg-hover-teal-buttons flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-teal-action" />
        </div>

        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-sora text-zinc-800">
            {t('subscriptionSuccess.welcome')}
          </h2>
          <p className="text-sm sm:text-base font-manrope text-teal-700 leading-relaxed">
            {t('subscriptionSuccess.activated')}
          </p>
        </div>

        {subscriptionDetails && (
          <div className="w-full bg-hover-teal-buttons rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold font-sora text-dark-teal mb-3">
              {t('subscriptionSuccess.details')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-manrope text-zinc-600">{t('subscriptionSuccess.plan')}</span>
                <span className="text-sm font-medium font-manrope text-zinc-800">
                  {subscriptionDetails.planType === 'lifestyle'
                    ? t('subscriptionSuccess.lifestyleProgram')
                    : t('subscriptionSuccess.medicalProgram')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-manrope text-zinc-600">{t('subscriptionSuccess.status')}</span>
                <span className="text-sm font-semibold font-manrope text-teal-action">
                  {t('subscriptionSuccess.active')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full h-12 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full text-white font-semibold font-sora hover:from-teal-700 hover:to-teal-700 transition-colors"
          >
            {t('subscriptionSuccess.goToDashboard')}
          </button>
          <p className="text-xs font-manrope text-zinc-500 text-center">
            {t('subscriptionSuccess.manageNote')}
          </p>
        </div>
      </div>
    </div>
  );
};
