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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { deleteAccount, type DeletionResponse } from '@/services/userDeletionService';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

type DeleteAccountDialogProps = {
  userType: 'patient' | 'doctor';
};

export const DeleteAccountDialog = ({ userType }: DeleteAccountDialogProps) => {
  const [step, setStep] = useState<'initial' | 'confirm' | 'result'>('initial');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<DeletionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuthStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await deleteAccount();
      setResult(response);
      setStep('result');

      // Logout after showing results
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setStep('initial');
    setConfirmText('');
    setResult(null);
    setError(null);
  };

  const renderInitialStep = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Delete Your Account
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-3">
            <p>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <p className="font-medium mb-2">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1">
                {userType === 'patient' && (
                  <>
                    <li>Your subscription and billing information</li>
                    <li>All your health data and records</li>
                  </>
                )}
                {userType === 'doctor' && (
                  <>
                    <li>Your doctor profile and settings</li>
                    <li>Access to all patient communications</li>
                  </>
                )}
                <li>All chat messages and history</li>
                <li>Your account and login credentials</li>
              </ul>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => setStep('confirm')}
          className="bg-red-600 hover:bg-red-700"
        >
          I understand, continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  const renderConfirmStep = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-4">
            <p>
              To confirm deletion, please type <strong>DELETE</strong> below:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="text-center"
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button
          variant="outline"
          onClick={() => setStep('initial')}
          disabled={isDeleting}
        >
          Back
        </Button>
        <Button
          onClick={handleDelete}
          disabled={confirmText !== 'DELETE' || isDeleting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
        >
          {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
        </Button>
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
              Account Deleted
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

            <p className="text-sm text-zinc-500">
              You will be logged out in a few seconds...
            </p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={() => logout()}>
          Logout Now
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {step === 'initial' && renderInitialStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'result' && renderResultStep()}
      </AlertDialogContent>
    </AlertDialog>
  );
};
