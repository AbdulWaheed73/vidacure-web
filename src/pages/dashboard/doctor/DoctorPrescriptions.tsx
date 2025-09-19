import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { doctorPrescriptionService } from '@/services/doctorPrescriptionService';
import type { DoctorPrescriptionRequest } from '@/types/doctor-prescription-types';
import { Clock, CheckCircle, XCircle, AlertCircle, User, Scale, AlertTriangle } from 'lucide-react';
import { PrescriptionRequestDetailModal } from '@/components/PrescriptionRequestDetailModal';

const DoctorPrescriptions: React.FC = () => {
  const [requests, setRequests] = useState<DoctorPrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DoctorPrescriptionRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPrescriptionRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await doctorPrescriptionService.getDoctorPrescriptionRequests();

      if (response.success) {
        setRequests(response.data.prescriptionRequests);
      }
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
    fetchPrescriptionRequests();
  }, []);

  const handleRequestClick = (request: DoctorPrescriptionRequest) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await doctorPrescriptionService.updatePrescriptionRequestStatus(requestId, 'approved');
      // Refresh the list to show updated status
      await fetchPrescriptionRequests();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to approve prescription request';
      console.error('Error approving prescription request:', errorMessage);
    }
  };

  const getStatusBadge = (status: DoctorPrescriptionRequest['status']) => {
    const statusConfig = {
      pending: {
        variant: 'outline' as const,
        icon: Clock,
        className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
      },
      approved: {
        variant: 'secondary' as const,
        icon: CheckCircle,
        className: 'border-green-500 text-green-700 bg-green-50',
      },
      denied: {
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'border-red-500 text-red-700 bg-red-50',
      },
      under_review: {
        variant: 'outline' as const,
        icon: AlertCircle,
        className: 'border-blue-500 text-blue-700 bg-blue-50',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
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
      <div className="p-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 font-manrope">
            Patient Prescription Requests
          </h1>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 font-manrope">
            Patient Prescription Requests
          </h1>
          <div className="text-center py-8">
            <div className="text-red-600 bg-red-50 p-4 rounded-md">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-manrope">
            Patient Prescription Requests
          </h1>
          <p className="text-lg text-gray-600 font-manrope">
            Review and manage prescription requests from your assigned patients
          </p>
        </div>


        {/* Prescription Requests List */}
        {requests?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💊</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
              No Prescription Requests
            </h2>
            <p className="text-gray-500 font-manrope">
              No prescription requests from your assigned patients yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800 font-manrope mb-4">
              Prescription Requests
            </h2>
            {requests?.map((request) => (
              <Card
                key={request._id}
                className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRequestClick(request)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-800 font-manrope">
                          {request.patient.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 font-manrope">
                          {request.currentWeight} kg
                        </span>
                      </div>

                      {request.hasSideEffects && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 text-sm font-manrope">
                            Side Effects
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 font-manrope">
                        {formatDate(request.createdAt)}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Prescription Request Detail Modal */}
        <PrescriptionRequestDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          request={selectedRequest}
          onApprove={handleApproveRequest}
        />
      </div>
    </div>
  );
};

export default DoctorPrescriptions;