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
import { addDoctorFormSchema, type AddDoctorFormValues, type SSNCheckResponse } from '@/types/admin-types';
import { adminService } from '@/services/adminService';
import { SSNCheckStatus } from './SSNCheckStatus';
import { PatientConversionConfirmDialog } from './PatientConversionConfirmDialog';
import { Alert } from '@/components/ui/Alert';

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

  const form = useForm<AddDoctorFormValues>({
    resolver: zodResolver(addDoctorFormSchema),
    defaultValues: {
      ssn: '',
      email: '',
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
      await adminService.addDoctor(data);

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

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="doctor@example.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Official email address for the doctor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
