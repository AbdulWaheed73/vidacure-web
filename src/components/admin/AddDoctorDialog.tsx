import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { addDoctorFormSchema, type AddDoctorFormValues, type SSNCheckResponse } from '@/types/admin-types';
import { adminService } from '@/services/adminService';
import { SSNCheckStatus } from './SSNCheckStatus';
import { PatientConversionConfirmDialog } from './PatientConversionConfirmDialog';
import { Alert } from '@/components/ui/Alert';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';

type AddDoctorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const AddDoctorDialog = ({ isOpen, onClose, onSuccess }: AddDoctorDialogProps) => {
  const [ssnStatus, setSSNStatus] = useState<'idle' | 'checking' | 'available' | 'doctor' | 'patient'>('idle');
  const [ssnCheckData, setSSNCheckData] = useState<SSNCheckResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConversionDialogOpen, setIsConversionDialogOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [calendlyEventTypes, setCalendlyEventTypes] = useState<{ name: string; duration?: number }[]>([]);
  const [calendlyLookupStatus, setCalendlyLookupStatus] = useState<'idle' | 'found' | 'not_found'>('idle');

  const form = useForm<AddDoctorFormValues>({
    resolver: zodResolver(addDoctorFormSchema),
    defaultValues: {
      ssn: '',
      email: '',
      eventTypes: {
        free: '',
        standard: '',
        premium: '',
      },
    },
  });

  const handleSSNCheck = async (ssn: string) => {
    if (ssn.length !== 12) {
      setSSNStatus('idle');
      return;
    }

    setSSNStatus('checking');
    setError(null);

    try {
      const response = await adminService.checkSSN(ssn);
      setSSNCheckData(response);

      if (!response.exists) {
        setSSNStatus('available');
      } else if (response.type === 'doctor') {
        setSSNStatus('doctor');
      } else if (response.type === 'patient') {
        setSSNStatus('patient');
      }
    } catch (err) {
      console.error('Error checking SSN:', err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to check SSN');
      setSSNStatus('idle');
    }
  };

  const handleCalendlyLookup = async () => {
    const email = form.getValues('email');
    if (!email) return;

    setIsLookingUp(true);
    setCalendlyLookupStatus('idle');
    setCalendlyEventTypes([]);

    try {
      const result = await adminService.calendlyLookup(email);
      setCalendlyLookupStatus('found');
      setCalendlyEventTypes(result.eventTypes);

      // Auto-fill event type names from Calendly into the form
      // Map Calendly event types to doctor event type fields by matching names
      const eventNames = result.eventTypes.map(et => et.name);
      const freeMatch = eventNames.find(n => /free|gratis|initial/i.test(n));
      const standardMatch = eventNames.find(n => /standard|regular|follow/i.test(n));
      const premiumMatch = eventNames.find(n => /premium|medical|specialist/i.test(n));

      if (freeMatch) form.setValue('eventTypes.free', freeMatch);
      if (standardMatch) form.setValue('eventTypes.standard', standardMatch);
      if (premiumMatch) form.setValue('eventTypes.premium', premiumMatch);

      // If only one event type, fill the first empty slot
      if (eventNames.length === 1) {
        form.setValue('eventTypes.free', eventNames[0]);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setCalendlyLookupStatus('not_found');
      } else {
        setError(err.response?.data?.error || 'Failed to lookup Calendly user');
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleConvertPatient = () => {
    setIsConversionDialogOpen(true);
  };

  const handleConfirmConversion = async () => {
    if (!ssnCheckData?.patientId) return;

    setIsConverting(true);
    setError(null);

    try {
      const formValues = form.getValues();
      await adminService.convertPatientToDoctor({
        patientId: ssnCheckData.patientId,
        email: formValues.email,
      });

      setSuccessMessage(`Patient "${ssnCheckData.patientName}" successfully converted to doctor`);
      setIsConversionDialogOpen(false);

      // Wait a bit to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error converting patient:', err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to convert patient to doctor');
    } finally {
      setIsConverting(false);
    }
  };

  const onSubmit = async (data: AddDoctorFormValues) => {
    if (ssnStatus !== 'available') {
      setError('Please check the SSN status before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Only include eventTypes if at least one value was provided
      const payload = { ...data };
      if (payload.eventTypes) {
        const hasAnyEventType = Object.values(payload.eventTypes).some(v => v && v.trim() !== '');
        if (!hasAnyEventType) {
          delete payload.eventTypes;
        } else {
          // Remove empty strings so schema defaults apply for unfilled fields
          payload.eventTypes = Object.fromEntries(
            Object.entries(payload.eventTypes).filter(([, v]) => v && v.trim() !== '')
          ) as typeof payload.eventTypes;
        }
      }
      await adminService.addDoctor(payload);

      setSuccessMessage('Doctor successfully added. Name will be populated on first BankID login.');

      // Wait a bit to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding doctor:', err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to add doctor');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSSNStatus('idle');
    setSSNCheckData(null);
    setError(null);
    setSuccessMessage(null);
    setCalendlyLookupStatus('idle');
    setCalendlyEventTypes([]);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Error/Success Alerts */}
              {error && (
                <Alert variant="destructive" title="Error">
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <div className="text-green-800">{successMessage}</div>
                </Alert>
              )}
              {/* SSN Field */}
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swedish SSN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="YYYYMMDDXXXX"
                        maxLength={12}
                        onBlur={() => handleSSNCheck(field.value)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      12-digit Swedish personal number. Name will be fetched from BankID on first login.
                    </FormDescription>
                    <FormMessage />

                    {/* SSN Status Component */}
                    <SSNCheckStatus
                      status={ssnStatus}
                      patientName={ssnCheckData?.patientName}
                      doctorName={ssnCheckData?.doctorName}
                      onConvert={handleConvertPatient}
                    />
                  </FormItem>
                )}
              />

              {/* Email Field with Calendly Lookup */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calendly Email</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="doctor@example.com"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCalendlyLookup}
                        disabled={isLookingUp || isSubmitting || !field.value}
                        className="shrink-0"
                      >
                        {isLookingUp ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        <span className="ml-1">Lookup</span>
                      </Button>
                    </div>
                    <FormDescription>
                      Enter the doctor's Calendly email, then click Lookup to auto-fill event types.
                    </FormDescription>
                    <FormMessage />

                    {calendlyLookupStatus === 'found' && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Calendly account found — {calendlyEventTypes.length} event type(s)</span>
                      </div>
                    )}
                    {calendlyLookupStatus === 'not_found' && (
                      <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
                        <XCircle className="h-4 w-4" />
                        <span>No Calendly user found with this email.</span>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Calendly Event Types Preview */}
              {calendlyEventTypes.length > 0 && (
                <div className="rounded-md border p-3 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Calendly Event Types Found</p>
                  <div className="flex flex-wrap gap-2">
                    {calendlyEventTypes.map((et, idx) => (
                      <Badge key={idx} variant="secondary">
                        {et.name} {et.duration ? `(${et.duration}min)` : ''}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Types */}
              <div className="space-y-3">
                <FormLabel>Calendly Event Types</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {calendlyLookupStatus === 'found'
                    ? 'Auto-filled from Calendly. Adjust if needed.'
                    : 'Custom names for Calendly event types. Leave blank to use defaults.'}
                </p>
                <FormField
                  control={form.control}
                  name="eventTypes.free"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-normal">Free Consultation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Free Consultation"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventTypes.standard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-normal">Standard Appointment</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Standard Appointment"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventTypes.premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-normal">Premium Consultation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Premium Consultation"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || ssnStatus === 'doctor' || ssnStatus === 'patient' || ssnStatus !== 'available'}
                >
                  {isSubmitting ? 'Adding...' : 'Add Doctor'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Patient Conversion Confirmation Dialog */}
      <PatientConversionConfirmDialog
        isOpen={isConversionDialogOpen}
        onConfirm={handleConfirmConversion}
        onCancel={() => setIsConversionDialogOpen(false)}
        patientName={ssnCheckData?.patientName || ''}
        isLoading={isConverting}
      />
    </>
  );
};
