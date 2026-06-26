import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { prescriptionService } from '../services/prescriptionService';
import type { PrescriptionRequest } from '../types/prescription-types';
import { PrescriptionRequestStatus } from '../types/prescription-types';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type PrescriptionRequestsListProps = {
  refreshTrigger?: number;
};

export const PrescriptionRequestsList: React.FC<PrescriptionRequestsListProps> = ({
  refreshTrigger = 0,
}) => {
  const { t, i18n } = useTranslation();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await prescriptionService.getPrescriptionRequests();
      setRequests(response.prescriptionRequests);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : t('prescriptions.requests.loadFailed');
      setError(errorMessage || t('prescriptions.requests.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  const getStatusBadge = (status: PrescriptionRequest['status']) => {
    const statusConfig = {
      [PrescriptionRequestStatus.PENDING]: {
        variant: 'outline' as const,
        icon: Clock,
        className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
        label: t('prescriptions.requests.pending'),
      },
      [PrescriptionRequestStatus.APPROVED]: {
        variant: 'secondary' as const,
        icon: CheckCircle,
        className: 'border-green-500 text-green-700 bg-green-50',
        label: t('prescriptions.requests.approved'),
      },
      [PrescriptionRequestStatus.DENIED]: {
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'border-red-500 text-red-700 bg-red-50',
        label: t('prescriptions.requests.denied'),
      },
      [PrescriptionRequestStatus.UNDER_REVIEW]: {
        variant: 'outline' as const,
        icon: AlertCircle,
        className: 'border-blue-500 text-blue-700 bg-blue-50',
        label: t('prescriptions.requests.underReview'),
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-manrope">
          {t('prescriptions.requests.noRequests')}
        </p>
      </div>
    );
  }

  // Find the latest approved request — that's the "active" prescription
  const activeRequestId = requests.find(
    (r) => r.status === PrescriptionRequestStatus.APPROVED
  )?._id;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 font-manrope mb-4">
        {t('prescriptions.requests.previousRequests')}
      </h2>
      {requests.map((request) => {
        const isActive = request._id === activeRequestId;
        return (
        <Card key={request._id} className={`bg-white/95 backdrop-blur-md ${isActive ? 'ring-2 ring-teal-500' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-manrope">
                  {t('prescriptions.requests.request')} #{request._id.slice(-6)}
                </CardTitle>
                {isActive && (
                  <Badge className="border-teal-500 text-teal-700 bg-teal-50">
                    {t('prescriptions.requests.active')}
                  </Badge>
                )}
              </div>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope">{t('prescriptions.requests.currentWeight')}</p>
                <p className="text-base text-gray-800 font-manrope">{request.currentWeight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope">{t('prescriptions.requests.sideEffects')}</p>
                <p className="text-base text-gray-800 font-manrope">
                  {request.hasSideEffects ? t('prescriptions.yes') : t('prescriptions.no')}
                </p>
              </div>
            </div>

            {request.status === PrescriptionRequestStatus.DENIED && request.rejectionNote && (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-sm font-semibold text-red-700 font-manrope mb-1">
                  {t('prescriptions.requests.rejectionReason')}
                </p>
                <p className="text-sm text-red-700 font-manrope whitespace-pre-wrap">
                  {request.rejectionNote}
                </p>
              </div>
            )}

            {request.hasSideEffects && request.sideEffectsDescription && (
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope mb-1">
                  {t('prescriptions.requests.sideEffectsDesc')}
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md font-manrope">
                  {request.sideEffectsDescription}
                </p>
              </div>
            )}

            {request.currentMedications && request.currentMedications.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope mb-1">
                  {t('prescriptions.requests.currentMedications')}
                </p>
                <ul className="space-y-1.5 bg-gray-50 p-3 rounded-md">
                  {request.currentMedications.map((med, i) => (
                    <li key={i} className="text-sm text-gray-700 font-manrope flex items-baseline justify-between gap-3">
                      <span className="font-medium text-gray-800">{med.name}</span>
                      {med.dosage && <span className="text-gray-500">{med.dosage}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(() => {
              const meds = request.prescribedMedications && request.prescribedMedications.length > 0
                ? request.prescribedMedications
                : request.medicationName
                  ? [{ name: request.medicationName, dosage: request.dosage }]
                  : [];
              if (meds.length === 0 && !request.usageInstructions) return null;
              return (
                <div className="pt-2 border-t space-y-3">
                  {meds.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-manrope mb-1">{t('prescriptions.requests.prescribedMedications')}</p>
                      <ul className="space-y-1.5 bg-gray-50 p-3 rounded-md">
                        {meds.map((med, i) => (
                          <li key={i} className="text-sm text-gray-700 font-manrope flex items-baseline justify-between gap-3">
                            <span className="font-medium text-gray-800">{med.name}</span>
                            {med.dosage && <span className="text-gray-500">{med.dosage}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {request.usageInstructions && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-manrope mb-1">{t('prescriptions.requests.usageInstructions')}</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md font-manrope">
                        {request.usageInstructions}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {(request.dateIssued || request.validTill) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {request.dateIssued && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-manrope">{t('prescriptions.requests.dateIssued')}</p>
                    <p className="text-base text-gray-800 font-manrope">{formatDate(request.dateIssued)}</p>
                  </div>
                )}
                {request.validTill && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-manrope">{t('prescriptions.requests.validTill')}</p>
                    <p className="text-base text-gray-800 font-manrope">{formatDate(request.validTill)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t">
              <div>
                <p className="text-xs text-gray-500 font-manrope">{t('prescriptions.requests.submitted')}</p>
                <p className="text-sm text-gray-700 font-manrope">
                  {formatDate(request.createdAt)}
                </p>
              </div>
              {request.updatedAt !== request.createdAt && (
                <div>
                  <p className="text-xs text-gray-500 font-manrope">{t('prescriptions.requests.lastUpdated')}</p>
                  <p className="text-sm text-gray-700 font-manrope">
                    {formatDate(request.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
};
