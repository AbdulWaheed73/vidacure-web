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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { DoctorPrescriptionRequest, PrescriptionRequestDetailModalProps } from '@/types/doctor-prescription-types';
import { PrescriptionRequestStatus } from '@/types/doctor-prescription-types';
import { User, Scale, AlertTriangle, Calendar, Pill } from 'lucide-react';



export const PrescriptionRequestDetailModal: React.FC<PrescriptionRequestDetailModalProps> = ({
  open,
  onOpenChange,
  request,
  onApprove,
}) => {
  const [loading, setLoading] = useState(false);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [validTill, setValidTill] = useState('');

  if (!request) return null;

  const handleApprove = async () => {
    // Validate required fields
    if (!medicationName || !dosage || !usageInstructions || !dateIssued || !validTill) {
      alert('Please fill in all prescription fields');
      return;
    }

    const prescriptionData = {
      medicationName: medicationName.trim(),
      dosage: dosage.trim(),
      usageInstructions: usageInstructions.trim(),
      dateIssued,
      validTill,
    };

    console.log('Approving prescription with data:', prescriptionData);

    try {
      setLoading(true);
      await onApprove(request._id, prescriptionData);
      // Reset form
      setMedicationName('');
      setDosage('');
      setUsageInstructions('');
      setDateIssued('');
      setValidTill('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving prescription request:', error);
      alert('Failed to approve prescription. Please try again.');
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
      [PrescriptionRequestStatus.PENDING]: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'PENDING'
      },
      [PrescriptionRequestStatus.APPROVED]: {
        className: 'bg-green-100 text-green-800 border-green-300',
        label: 'APPROVED'
      },
      [PrescriptionRequestStatus.DENIED]: {
        className: 'bg-red-100 text-red-800 border-red-300',
        label: 'DENIED'
      },
      [PrescriptionRequestStatus.UNDER_REVIEW]: {
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'UNDER REVIEW'
      },
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Prescription Request Details</span>
            {getStatusBadge(request.status)}
          </DialogTitle>
          <DialogDescription>
            Review the patient's prescription request details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Patient Information */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-800 font-manrope">{request.patient.name}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">#{request._id.slice(-8)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Weight:</span>
                  <span className="text-sm font-semibold text-gray-800">{request.currentWeight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Side Effects:</span>
                  <Badge variant={request.hasSideEffects ? "destructive" : "secondary"} className="text-xs">
                    {request.hasSideEffects ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              {request.hasSideEffects && request.sideEffectsDescription && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                  <p className="text-xs font-medium text-red-800 mb-1">Side Effects Description:</p>
                  <p className="text-xs text-red-700 font-manrope">
                    {request.sideEffectsDescription}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescription Details - Show existing or form for approval */}
          {request.status === PrescriptionRequestStatus.PENDING ? (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Prescription Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="medicationName" className="text-xs">Medication Name *</Label>
                      <Input
                        id="medicationName"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                        placeholder="e.g., Wegovy"
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage" className="text-xs">Dosage *</Label>
                      <Input
                        id="dosage"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="e.g., 2.4mg weekly"
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="usageInstructions" className="text-xs">Usage Instructions *</Label>
                    <Textarea
                      id="usageInstructions"
                      value={usageInstructions}
                      onChange={(e) => setUsageInstructions(e.target.value)}
                      placeholder="Instructions for taking the medication..."
                      rows={3}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="dateIssued" className="text-xs">Date Issued *</Label>
                      <Input
                        id="dateIssued"
                        type="date"
                        value={dateIssued}
                        onChange={(e) => setDateIssued(e.target.value)}
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validTill" className="text-xs">Valid Till *</Label>
                      <Input
                        id="validTill"
                        type="date"
                        value={validTill}
                        onChange={(e) => setValidTill(e.target.value)}
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (request.medicationName || request.dosage || request.usageInstructions) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-800">Prescription Details</h3>
                </div>
                <div className="space-y-4">
                  {request.medicationName && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Medication Name</p>
                      <p className="text-base text-gray-800 font-manrope">{request.medicationName}</p>
                    </div>
                  )}
                  {request.dosage && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dosage</p>
                      <p className="text-base text-gray-800 font-manrope">{request.dosage}</p>
                    </div>
                  )}
                  {request.usageInstructions && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Usage Instructions</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-900 font-manrope">
                          {request.usageInstructions}
                        </p>
                      </div>
                    </div>
                  )}
                  {(request.dateIssued || request.validTill) && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      {request.dateIssued && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Date Issued</p>
                          <p className="text-sm text-gray-800">{formatDate(request.dateIssued)}</p>
                        </div>
                      )}
                      {request.validTill && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Valid Till</p>
                          <p className="text-sm text-gray-800">{formatDate(request.validTill)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Submitted: {formatDate(request.createdAt)}</span>
            </div>
            {request.updatedAt !== request.createdAt && (
              <span>• Updated: {formatDate(request.updatedAt)}</span>
            )}
          </div>
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
          {request.status === PrescriptionRequestStatus.PENDING && (
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