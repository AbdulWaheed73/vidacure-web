import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { XCircle, ArrowLeft } from 'lucide-react';
import vidaCure from '../assets/vidacure_png.png';

export const SubscriptionCancel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <div className="w-full min-h-screen relative bg-amber-50 overflow-hidden">
      <Header />
      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg px-6 py-8 sm:px-8 sm:py-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-xl sm:rounded-2xl shadow-lg border border-stone-50 flex flex-col justify-center items-center gap-6 sm:gap-8">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-amber-600" />
        </div>

        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-sora text-zinc-800">
            {t('subscriptionCancel.title')}
          </h2>
          <p className="text-sm sm:text-base font-manrope text-zinc-600 leading-relaxed">
            {t('subscriptionCancel.message')}
          </p>
        </div>

        <div className="w-full bg-blue-50 rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold font-sora text-blue-800 mb-2">
            {t('subscriptionCancel.needHelp')}
          </h3>
          <p className="text-sm font-manrope text-blue-700">
            {t('subscriptionCancel.helpMessage')}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate('/subscribe')}
            className="w-full h-12 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full text-white font-semibold font-sora hover:from-teal-700 hover:to-teal-700 transition-colors"
          >
            {t('subscriptionCancel.tryAgain')}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full h-12 px-6 py-3 bg-white border border-zinc-300 rounded-full text-zinc-800 font-semibold font-sora hover:bg-zinc-50 transition-colors"
          >
            {t('subscriptionCancel.goToDashboard')}
          </button>
          <p className="text-xs font-manrope text-zinc-500 text-center">
            {t('subscriptionCancel.accountActive')}
          </p>
        </div>
      </div>
    </div>
  );
};
