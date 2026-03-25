import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

      setTimeout(() => {
        logout();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || t('deleteAccount.deleteFailed'));
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
          {t('deleteAccount.title')}
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-3">
            <p>{t('deleteAccount.warning')}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <p className="font-medium mb-2">{t('deleteAccount.willDelete')}</p>
              <ul className="list-disc list-inside space-y-1">
                {userType === 'patient' && (
                  <>
                    <li>{t('deleteAccount.patientSubscription')}</li>
                    <li>{t('deleteAccount.patientHealthData')}</li>
                  </>
                )}
                {userType === 'doctor' && (
                  <>
                    <li>{t('deleteAccount.doctorProfile')}</li>
                    <li>{t('deleteAccount.doctorPatientAccess')}</li>
                  </>
                )}
                <li>{t('deleteAccount.chatHistory')}</li>
                <li>{t('deleteAccount.loginCredentials')}</li>
              </ul>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose}>{t('deleteAccount.cancel')}</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => setStep('confirm')}
          className="bg-red-600 hover:bg-red-700"
        >
          {t('deleteAccount.understand')}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  const renderConfirmStep = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('deleteAccount.confirmTitle')}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-4">
            <p dangerouslySetInnerHTML={{ __html: t('deleteAccount.confirmInstruction') }} />
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={t('deleteAccount.confirmPlaceholder')}
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
          {t('deleteAccount.back')}
        </Button>
        <Button
          onClick={handleDelete}
          disabled={confirmText !== 'DELETE' || isDeleting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
        >
          {isDeleting ? t('deleteAccount.deleting') : t('deleteAccount.permanentDelete')}
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
              {t('deleteAccount.accountDeleted')}
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('deleteAccount.partialDelete')}
            </>
          )}
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-4">
            <p>{result?.message}</p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700">{t('deleteAccount.deletionResults')}</p>
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
              {t('deleteAccount.logoutSoon')}
            </p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={() => logout()}>
          {t('deleteAccount.logoutNow')}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="rounded-xl text-gray-500 border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-manrope px-6 transition-colors">
          <Trash2 className="h-4 w-4 mr-2" />
          {t('deleteAccount.deleteButton')}
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
