import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import type { DoctorPrescriptionRequest, PrescriptionRequestDetailModalProps } from '@/types/doctor-prescription-types';
import { PrescriptionRequestStatus } from '@/types/doctor-prescription-types';
import { User, Scale, AlertTriangle, Calendar, Pill, AlertCircle } from 'lucide-react';

const prescriptionFormSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  usageInstructions: z.string().min(1, 'Usage instructions are required'),
  dateIssued: z.string().min(1, 'Date issued is required'),
  validTill: z.string().min(1, 'Valid till date is required'),
}).refine(
  (data) => {
    if (data.dateIssued && data.validTill) {
      return new Date(data.validTill) > new Date(data.dateIssued);
    }
    return true;
  },
  {
    message: 'Valid till date must be after the date issued',
    path: ['validTill'],
  }
);

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

export const PrescriptionRequestDetailModal: React.FC<PrescriptionRequestDetailModalProps> = ({
  open,
  onOpenChange,
  request,
  onApprove,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      medicationName: '',
      dosage: '',
      usageInstructions: '',
      dateIssued: '',
      validTill: '',
    },
  });

  if (!request) return null;

  const handleApprove = async (values: PrescriptionFormValues) => {
    setSubmitError(null);
    try {
      setLoading(true);
      await onApprove(request._id, {
        medicationName: values.medicationName.trim(),
        dosage: values.dosage.trim(),
        usageInstructions: values.usageInstructions.trim(),
        dateIssued: values.dateIssued,
        validTill: values.validTill,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving prescription request:', error);
      setSubmitError('Failed to approve prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSubmitError(null);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={handleClose}>
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
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#005044] shrink-0" />
                <span className="text-sm text-[#b0b0b0] font-manrope">Weight:</span>
                <span className="text-sm font-semibold text-[#282828] font-manrope">{request.currentWeight} kg</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${request.hasSideEffects ? 'text-red-500' : 'text-[#005044]'}`} />
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

          {/* Prescription Details - Show form for pending or existing details */}
          {request.status === PrescriptionRequestStatus.PENDING ? (
            <Form {...form}>
              <div className="border border-[#e0e0e0] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="w-4 h-4 text-[#005044]" />
                  <h3 className="font-sora font-semibold text-[#282828] text-sm">Prescription Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="medicationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-manrope text-[#282828]">Medication Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Wegovy"
                              className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dosage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-manrope text-[#282828]">Dosage *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., 2.4mg weekly"
                              className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="usageInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-manrope text-[#282828]">Usage Instructions *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Instructions for taking the medication..."
                            rows={3}
                            className="text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="dateIssued"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-manrope text-[#282828]">Date Issued *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="validTill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-manrope text-[#282828]">Valid Till *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="h-9 text-sm rounded-xl border-[#e0e0e0] font-manrope focus-visible:ring-[#005044]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {submitError && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </Form>
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#b0b0b0] font-manrope">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Submitted: {formatDate(request.createdAt)}</span>
            </div>
            {request.updatedAt !== request.createdAt && (
              <span>Updated: {formatDate(request.updatedAt)}</span>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          {request.status === PrescriptionRequestStatus.PENDING && (
            <Button
              type="button"
              onClick={form.handleSubmit(handleApprove)}
              disabled={loading}
              className="bg-[#005044] hover:bg-[#004038] text-white rounded-full font-sora w-full sm:w-auto"
            >
              {loading ? 'Approving...' : 'Approve Request'}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="rounded-full border-[#e0e0e0] text-[#282828] font-sora w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
