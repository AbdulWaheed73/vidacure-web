import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

type ConsentRequiredCardProps = {
  title: string;
  className?: string;
};

export const isConsentError = (error: unknown): boolean => {
  return (error as { response?: { status?: number } })?.response?.status === 451;
};

export const ConsentRequiredCard: React.FC<ConsentRequiredCardProps> = ({ title, className = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className={`bg-white/95 backdrop-blur-md shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-manrope">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <ShieldAlert className="size-8 text-amber-400 mb-3" />
        <p className="text-gray-500 mb-1 text-center text-sm font-medium">{t('consent.errors.consentRequiredTitle')}</p>
        <p className="text-gray-400 mb-4 text-center text-xs">
          {t('consent.errors.consentRequiredData')}
        </p>
        <Button
          onClick={() => navigate(ROUTES.PATIENT_CONSENT)}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          {t('consent.errors.reviewConsent')}
        </Button>
      </CardContent>
    </Card>
  );
};
