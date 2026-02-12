import React, { useEffect, useState } from 'react';

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
        : 'Failed to load prescription requests';
      setError(errorMessage || 'Failed to load prescription requests');
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
        label: 'PENDING',
      },
      [PrescriptionRequestStatus.APPROVED]: {
        variant: 'secondary' as const,
        icon: CheckCircle,
        className: 'border-green-500 text-green-700 bg-green-50',
        label: 'APPROVED',
      },
      [PrescriptionRequestStatus.DENIED]: {
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'border-red-500 text-red-700 bg-red-50',
        label: 'DENIED',
      },
      [PrescriptionRequestStatus.UNDER_REVIEW]: {
        variant: 'outline' as const,
        icon: AlertCircle,
        className: 'border-blue-500 text-blue-700 bg-blue-50',
        label: 'UNDER REVIEW',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
          No prescription requests found. Click "Request Prescription" to submit your first request.
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
        Previous Requests
      </h2>
      {requests.map((request) => {
        const isActive = request._id === activeRequestId;
        return (
        <Card key={request._id} className={`bg-white/95 backdrop-blur-md ${isActive ? 'ring-2 ring-teal-500' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-manrope">
                  Request #{request._id.slice(-6)}
                </CardTitle>
                {isActive && (
                  <Badge className="border-teal-500 text-teal-700 bg-teal-50">
                    ACTIVE
                  </Badge>
                )}
              </div>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope">Current Weight</p>
                <p className="text-base text-gray-800 font-manrope">{request.currentWeight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope">Side Effects</p>
                <p className="text-base text-gray-800 font-manrope">
                  {request.hasSideEffects ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {request.hasSideEffects && request.sideEffectsDescription && (
              <div>
                <p className="text-sm font-medium text-gray-600 font-manrope mb-1">
                  Side Effects Description
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md font-manrope">
                  {request.sideEffectsDescription}
                </p>
              </div>
            )}

            {(request.medicationName || request.dosage || request.usageInstructions) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                {request.medicationName && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-manrope">Medication Name</p>
                    <p className="text-base text-gray-800 font-manrope">{request.medicationName}</p>
                  </div>
                )}
                {request.dosage && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-manrope">Dosage</p>
                    <p className="text-base text-gray-800 font-manrope">{request.dosage}</p>
                  </div>
                )}
                {request.usageInstructions && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600 font-manrope mb-1">Usage Instructions</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md font-manrope">
                      {request.usageInstructions}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(request.dateIssued || request.validTill) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {request.dateIssued && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-manrope">Date Issued</p>
                    <p className="text-base text-gray-800 font-manrope">{formatDate(request.dateIssued)}</p>
                  </div>
                )}
                {request.validTill && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-manrope">Valid Till</p>
                    <p className="text-base text-gray-800 font-manrope">{formatDate(request.validTill)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t">
              <div>
                <p className="text-xs text-gray-500 font-manrope">Submitted</p>
                <p className="text-sm text-gray-700 font-manrope">
                  {formatDate(request.createdAt)}
                </p>
              </div>
              {request.updatedAt !== request.createdAt && (
                <div>
                  <p className="text-xs text-gray-500 font-manrope">Last Updated</p>
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