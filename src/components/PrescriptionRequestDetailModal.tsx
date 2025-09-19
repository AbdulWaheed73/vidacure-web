import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { DoctorPrescriptionRequest } from '@/types/doctor-prescription-types';
import { User, Scale, AlertTriangle, Calendar } from 'lucide-react';

type PrescriptionRequestDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DoctorPrescriptionRequest | null;
  onApprove: (requestId: string) => Promise<void>;
};

export const PrescriptionRequestDetailModal: React.FC<PrescriptionRequestDetailModalProps> = ({
  open,
  onOpenChange,
  request,
  onApprove,
}) => {
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      await onApprove(request._id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving prescription request:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: DoctorPrescriptionRequest['status']) => {
    const statusConfig = {
      pending: { className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { className: 'bg-green-100 text-green-800 border-green-300' },
      denied: { className: 'bg-red-100 text-red-800 border-red-300' },
      under_review: { className: 'bg-blue-100 text-blue-800 border-blue-300' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Prescription Request Details</span>
            {getStatusBadge(request.status)}
          </DialogTitle>
          <DialogDescription>
            Review the patient's prescription request details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-800">Patient Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patient Name</p>
                  <p className="text-base text-gray-800 font-manrope">{request.patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Request ID</p>
                  <p className="text-base text-gray-800 font-mono">#{request._id.slice(-8)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Request Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Weight</p>
                    <p className="text-lg text-gray-800 font-semibold">{request.currentWeight} kg</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Side Effects</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={request.hasSideEffects ? "destructive" : "secondary"}>
                        {request.hasSideEffects ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {request.hasSideEffects && request.sideEffectsDescription && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm font-medium text-red-800 mb-1">Side Effects Description:</p>
                        <p className="text-sm text-red-700 font-manrope">
                          {request.sideEffectsDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-800">Timeline</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="text-sm text-gray-800">{formatDate(request.createdAt)}</p>
                </div>
                {request.updatedAt !== request.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-sm text-gray-800">{formatDate(request.updatedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Close
          </Button>
          {request.status === 'pending' && (
            <Button
              type="button"
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Approving...' : 'Approve Request'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};