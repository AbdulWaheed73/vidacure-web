import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Doctor, Patient } from '@/services/adminService';
import type { DeleteUserResponse } from '@/types/admin-types';
import { cn } from '@/lib/utils';

type DeleteUserDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  user: Patient | Doctor | null;
  userType: 'patient' | 'doctor';
  doctors?: Doctor[];
  onSuccess: () => void;
};

export const DeleteUserDialog = ({
  isOpen,
  onClose,
  user,
  userType,
  doctors = [],
  onSuccess,
}: DeleteUserDialogProps) => {
  const [step, setStep] = useState<'confirm' | 'reassign' | 'result'>('confirm');
  const [reassignDoctorId, setReassignDoctorId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<DeleteUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDoctor = userType === 'doctor';
  const doctorUser = user as Doctor | null;
  const patientCount = isDoctor ? doctorUser?.patientCount || 0 : 0;
  const availableDoctors = doctors.filter((d) => d._id !== user?._id);

  const handleClose = () => {
    setStep('confirm');
    setReassignDoctorId('');
    setResult(null);
    setError(null);
    onClose();
  };

  const handleConfirm = () => {
    if (isDoctor && patientCount > 0) {
      setStep('reassign');
    } else {
      handleDelete();
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await adminService.deleteUser(
        user._id,
        userType,
        reassignDoctorId || undefined
      );
      setResult(response);
      setStep('result');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderConfirmStep = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Delete {userType === 'doctor' ? 'Doctor' : 'Patient'}
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-3">
            <p>
              Are you sure you want to delete <strong>{user?.name}</strong>?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <p className="font-medium mb-2">This action will:</p>
              <ul className="list-disc list-inside space-y-1">
                {userType === 'patient' && (
                  <>
                    <li>Cancel any active Stripe subscription</li>
                    <li>Delete all chat messages and channels</li>
                  </>
                )}
                {userType === 'doctor' && (
                  <>
                    <li>Delete all chat channels</li>
                    <li>Require manual Calendly account deletion</li>
                    {patientCount > 0 && (
                      <li>
                        Affect <strong>{patientCount}</strong> assigned patient
                        {patientCount !== 1 ? 's' : ''}
                      </li>
                    )}
                  </>
                )}
                <li>Permanently remove all user data from the database</li>
              </ul>
            </div>
            <p className="text-sm text-zinc-500">This action cannot be undone.</p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          className="bg-red-600 hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  const renderReassignStep = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Reassign Patients</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-4">
            <p>
              This doctor has <strong>{patientCount}</strong> assigned patient
              {patientCount !== 1 ? 's' : ''}. What would you like to do with them?
            </p>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                Reassign to another doctor (optional)
              </label>
              <Select value={reassignDoctorId} onValueChange={setReassignDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Leave patients unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Leave patients unassigned</SelectItem>
                  {availableDoctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.patientCount} patients)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500">
                {reassignDoctorId
                  ? 'All patients will be transferred to the selected doctor.'
                  : 'Patients will remain in the system but without a doctor assigned.'}
              </p>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setStep('confirm')}>Back</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  const renderResultStep = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          {result?.success ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              Deletion Complete
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Deletion Partially Complete
            </>
          )}
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-4">
            <p>{result?.message}</p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700">Deletion Results:</p>
              <div className="grid grid-cols-2 gap-2">
                {result?.results &&
                  Object.entries(result.results).map(([service, status]) => (
                    <div
                      key={service}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg text-sm',
                        status.success
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      )}
                    >
                      {status.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span className="capitalize">{service}</span>
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Confirmation ID: {result?.confirmationId}
            </p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={handleClose}>Close</AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'reassign' && renderReassignStep()}
        {step === 'result' && renderResultStep()}
      </AlertDialogContent>
    </AlertDialog>
  );
};
