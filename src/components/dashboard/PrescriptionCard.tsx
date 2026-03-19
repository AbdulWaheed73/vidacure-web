import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrescriptionRequests } from '@/hooks/useDashboardQueries';
import { ConsentRequiredCard, isConsentError } from './ConsentRequiredCard';

export const PrescriptionCard: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isLoading, error } = usePrescriptionRequests();

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: t('dashboard.statusPendingReview'), className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    approved: { label: t('dashboard.statusActive'), className: "bg-green-100 text-green-800 border-green-200" },
    denied: { label: t('dashboard.statusDenied'), className: "bg-red-100 text-red-800 border-red-200" },
    under_review: { label: t('dashboard.statusUnderReview'), className: "bg-orange-100 text-orange-800 border-orange-200" },
  };

  const prescriptions = [...(data?.prescriptionRequests ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prescriptions.length - 1, prev + 1));
  };

  if (isConsentError(error)) {
    return <ConsentRequiredCard title={t('dashboard.myPrescription')} />;
  }

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-3/4 mb-3" />
          <Skeleton className="h-5 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-manrope">{t('dashboard.myPrescription')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Pill className="size-8 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4 text-center text-sm">{t('dashboard.noPrescriptions')}</p>
          <Button onClick={() => navigate('/prescriptions')} className="bg-teal-600 hover:bg-teal-700 text-white">
            {t('dashboard.requestPrescription')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const safeIndex = Math.min(currentIndex, prescriptions.length - 1);
  const current = prescriptions[safeIndex];
  const status = statusConfig[current.status] || statusConfig.pending;

  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "\u2014";
    return new Date(dateStr).toLocaleDateString(dateLocale, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-manrope">{t('dashboard.myPrescription')}</CardTitle>
        {prescriptions.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs text-gray-500">{safeIndex + 1}/{prescriptions.length}</span>
            <button
              onClick={handleNext}
              disabled={safeIndex === prescriptions.length - 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            {current.medicationName || t('dashboard.pendingMedication')}
          </span>
          <Badge className={status.className}>{status.label}</Badge>
        </div>

        {current.dosage && (
          <p className="text-sm text-gray-600">{t('dashboard.dosage')} {current.dosage}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <span className="block text-gray-400">{t('dashboard.dateIssued')}</span>
            {formatDate(current.dateIssued)}
          </div>
          <div>
            <span className="block text-gray-400">{t('dashboard.validTill')}</span>
            {formatDate(current.validTill)}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => navigate('/prescriptions')}
        >
          {t('dashboard.viewDetails')}
        </Button>
      </CardContent>
    </Card>
  );
};
