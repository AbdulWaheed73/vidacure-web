import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui';

import { cancelDeletion } from '@/services/userDeletionService';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

type AccountActionsCardProps = {
  onLogout: () => void;
  userType: 'patient' | 'doctor';
};

export const AccountActionsCard = ({ onLogout, userType: _userType }: AccountActionsCardProps) => {
  const { t, i18n } = useTranslation();
  const { user, checkAuthStatus } = useAuthStore();
  const [isCancelling, setIsCancelling] = useState(false);

  const deletionRequestedAt = (user as any)?.deletionRequestedAt;
  const hasPendingDeletion = !!deletionRequestedAt;

  const deletionDeadline = deletionRequestedAt
    ? new Date(new Date(deletionRequestedAt).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString(i18n.language === 'sv' ? 'sv-SE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const handleCancelDeletion = async () => {
    setIsCancelling(true);
    try {
      await cancelDeletion();
      toast.success(t('deleteAccount.cancelSuccess'));
      await checkAuthStatus();
    } catch {
      toast.error(t('deleteAccount.cancelFailed'));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-4 md:p-6 col-span-1 lg:col-span-3">
      <h3 className="text-lg font-semibold text-gray-800 font-sora mb-5">
        {t('account.accountActions')}
      </h3>

      {hasPendingDeletion && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-sora font-semibold text-amber-800 text-sm">
                {t('deleteAccount.pendingDeletionTitle')}
              </p>
              <p className="font-manrope text-amber-700 text-sm mt-1">
                {t('deleteAccount.pendingDeletionMessage', { date: deletionDeadline })}
              </p>
            </div>
          </div>
          <Button
            onClick={handleCancelDeletion}
            disabled={isCancelling}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-sora font-semibold shrink-0"
          >
            {isCancelling ? t('deleteAccount.cancelling') : t('deleteAccount.cancelDeletion')}
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onLogout}
          className="bg-[#005044] text-white rounded-xl hover:bg-[#003d33] font-manrope px-6"
        >
          {t('account.logout')}
        </Button>

        {/* {!hasPendingDeletion && <DeleteAccountDialog userType={userType} />} */}
      </div>
    </div>
  );
};
