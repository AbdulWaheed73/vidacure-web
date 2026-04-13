import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '../constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import vidaCure from '../assets/vidacure_png.png';

export const HypnotherapistPaymentSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem('vidacure_hypno_intent');
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F7F4] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <img src={vidaCure} alt="Vidacure" className="h-10 mx-auto mb-4" />

        <Card className="shadow-lg">
          <CardContent className="pt-8 space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="size-16 text-teal-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 font-sora">
              {t('hypnotherapist.successTitle')}
            </h1>

            <p className="text-gray-600 font-manrope leading-relaxed">
              {t('hypnotherapist.successMessage')}
            </p>

            <div className="bg-teal-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-teal-800 font-sora">
                {t('hypnotherapist.title')}
              </p>
              <p className="text-xs text-teal-600 font-manrope mt-1">
                {t('hypnotherapist.price')} {t('hypnotherapist.currency')} · {t('hypnotherapist.oneTimePayment')}
              </p>
            </div>

            <Button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="w-full rounded-full bg-teal-600 hover:bg-teal-700 text-white font-sora font-semibold h-11"
            >
              {t('hypnotherapist.goToDashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HypnotherapistPaymentSuccess;
