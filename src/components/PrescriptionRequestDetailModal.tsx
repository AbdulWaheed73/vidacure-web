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
        className: 'bg-[#f0f7f4] text-[#005044]',
        label: 'PENDING'
      },
      [PrescriptionRequestStatus.APPROVED]: {
        className: 'bg-[rgba(3,160,0,0.15)] text-[#03a000]',
        label: 'APPROVED'
      },
      [PrescriptionRequestStatus.DENIED]: {
        className: 'bg-red-50 text-red-600',
        label: 'DENIED'
      },
      [PrescriptionRequestStatus.UNDER_REVIEW]: {
        className: 'bg-[#f0f7f4] text-[#005044]',
        label: 'UNDER REVIEW'
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`${config.className} rounded-full px-3 py-1 text-xs font-sora font-semibold`}>
        {config.label}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between font-sora text-[#282828]">
            <span>Prescription Request</span>
            {getStatusBadge(request.status)}
          </DialogTitle>
          <DialogDescription className="font-manrope text-[#b0b0b0]">
            Review the patient's prescription request details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Patient Information */}
          <div className="bg-[#f0f7f4] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#005044] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-sora font-semibold text-[#282828]">{request.patient.name}</span>
                  <p className="text-xs text-[#b0b0b0] font-manrope">#{request._id.slice(-8)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="border border-[#e0e0e0] rounded-2xl p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#005044]" />
                <span className="text-sm text-[#b0b0b0] font-manrope">Weight:</span>
                <span className="text-sm font-semibold text-[#282828] font-manrope">{request.currentWeight} kg</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${request.hasSideEffects ? 'text-red-500' : 'text-[#005044]'}`} />
                <span className="text-sm text-[#b0b0b0] font-manrope">Side Effects:</span>
                <span className={`text-xs font-sora font-semibold rounded-full px-2.5 py-0.5 ${
                  request.hasSideEffects
                    ? 'bg-red-50 text-red-600'
                    : 'bg-[#f0f7f4] text-[#005044]'
                }`}>
                  {request.hasSideEffects ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            {request.hasSideEffects && request.sideEffectsDescription && (
              <div className="bg-red-50 rounded-xl p-3 mt-3">
                <p className="text-xs font-sora font-semibold text-red-700 mb-1">Side Effects Description:</p>
                <p className="text-xs text-red-600 font-manrope">
                  {request.sideEffectsDescription}
                </p>
              </div>
            )}
          </div>

          {/* Prescription Details - Show existing or form for approval */}
          {request.status === PrescriptionRequestStatus.PENDING ? (
            <div className="border border-[#e0e0e0] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-4 h-4 text-[#005044]" />
                <h3 className="font-sora font-semibold text-[#282828] text-sm">Prescription Details</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="medicationName" className="text-xs font-manrope text-[#282828]">Medication Name *</Label>
                    <Input
                      id="medicationName"
                      value={medicationName}
                      onChange={(e) => setMedicationName(e.target.value)}
                      placeholder="e.g., Wegovy"
                      className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosage" className="text-xs font-manrope text-[#282828]">Dosage *</Label>
                    <Input
                      id="dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g., 2.4mg weekly"
                      className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="usageInstructions" className="text-xs font-manrope text-[#282828]">Usage Instructions *</Label>
                  <Textarea
                    id="usageInstructions"
                    value={usageInstructions}
                    onChange={(e) => setUsageInstructions(e.target.value)}
                    placeholder="Instructions for taking the medication..."
                    rows={3}
                    className="text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="dateIssued" className="text-xs font-manrope text-[#282828]">Date Issued *</Label>
                    <Input
                      id="dateIssued"
                      type="date"
                      value={dateIssued}
                      onChange={(e) => setDateIssued(e.target.value)}
                      className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="validTill" className="text-xs font-manrope text-[#282828]">Valid Till *</Label>
                    <Input
                      id="validTill"
                      type="date"
                      value={validTill}
                      onChange={(e) => setValidTill(e.target.value)}
                      className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (request.medicationName || request.dosage || request.usageInstructions) && (
            <div className="bg-[#f0f7f4] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-4 h-4 text-[#005044]" />
                <h3 className="font-sora font-semibold text-[#005044] text-sm">Prescription Details</h3>
              </div>
              <div className="space-y-3">
                {request.medicationName && (
                  <div>
                    <p className="text-xs text-[#005044]/60 font-manrope">Medication Name</p>
                    <p className="text-sm font-semibold text-[#005044] font-manrope">{request.medicationName}</p>
                  </div>
                )}
                {request.dosage && (
                  <div>
                    <p className="text-xs text-[#005044]/60 font-manrope">Dosage</p>
                    <p className="text-sm font-semibold text-[#005044] font-manrope">{request.dosage}</p>
                  </div>
                )}
                {request.usageInstructions && (
                  <div>
                    <p className="text-xs text-[#005044]/60 font-manrope mb-1">Usage Instructions</p>
                    <p className="text-sm text-[#005044] font-manrope">{request.usageInstructions}</p>
                  </div>
                )}
                {(request.dateIssued || request.validTill) && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#005044]/10">
                    {request.dateIssued && (
                      <div>
                        <p className="text-xs text-[#005044]/60 font-manrope">Date Issued</p>
                        <p className="text-sm text-[#005044] font-manrope">{formatDate(request.dateIssued)}</p>
                      </div>
                    )}
                    {request.validTill && (
                      <div>
                        <p className="text-xs text-[#005044]/60 font-manrope">Valid Till</p>
                        <p className="text-sm text-[#005044] font-manrope">{formatDate(request.validTill)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="flex items-center gap-4 text-xs text-[#b0b0b0] font-manrope">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Submitted: {formatDate(request.createdAt)}</span>
            </div>
            {request.updatedAt !== request.createdAt && (
              <span>Updated: {formatDate(request.updatedAt)}</span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-full border-[#e0e0e0] text-[#282828] font-sora"
          >
            Close
          </Button>
          {request.status === PrescriptionRequestStatus.PENDING && (
            <Button
              type="button"
              onClick={handleApprove}
              disabled={loading}
              className="bg-[#005044] hover:bg-[#004038] text-white rounded-full font-sora"
            >
              {loading ? 'Approving...' : 'Approve Request'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
