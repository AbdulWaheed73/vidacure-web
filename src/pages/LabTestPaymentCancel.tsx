import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export const LabTestPaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-yellow-500 text-6xl mb-4">!</div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('labTests.paymentCanceled')}
        </h2>

        <p className="text-gray-600 mb-6">
          {t('labTests.paymentCanceledMessage')}
        </p>

        <div className="space-y-3">
          <Button onClick={() => navigate('/lab-tests')} className="w-full" size="lg">
            {t('labTests.tryAgain')}
          </Button>
        </div>
      </div>
    </div>
  );
};
