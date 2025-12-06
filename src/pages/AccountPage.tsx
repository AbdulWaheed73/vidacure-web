import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Trash2 } from 'lucide-react';
import { Button } from '../components/ui';
import type { User as UserType } from '../types';
import { deleteAccount } from '../services/userDeletionService';

type AccountPageProps = {
  user: UserType | null;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteAccount();

      // Show success message
      alert(`${t('account.deleteSuccess')}\n\nConfirmation ID: ${result.confirmationId}`);

      // Log user out after successful deletion
      onLogout();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      alert(t('account.deleteError') || 'Failed to delete account. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <User className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">{t('account.title')}</h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          {t('account.description')}
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 font-manrope">
              {t('account.profileInfo')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-700 font-manrope">{t('account.name')}</p>
                  <p className="text-gray-600 font-manrope">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-700 font-manrope">{t('account.role')}</p>
                  <p className="text-gray-600 font-manrope">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 font-manrope">
            {t('account.accountActions')}
          </h2>
          <div className="space-y-3">
            <Button
              onClick={onLogout}
              variant="destructive"
              size="lg"
              className="w-full font-manrope"
            >
              {t('account.logout')}
            </Button>

            {showDeleteConfirm ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Trash2 className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 font-manrope mb-1">
                      {t('account.deleteConfirmTitle')}
                    </p>
                    <p className="text-sm text-red-700 font-manrope">
                      {t('account.deleteConfirmMessage')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    className="flex-1 font-manrope"
                  >
                    {isDeleting ? t('account.deleting') : t('account.confirmDelete')}
                  </Button>
                  <Button
                    onClick={handleCancelDelete}
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    className="flex-1 font-manrope"
                  >
                    {t('account.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                size="lg"
                className="w-full font-manrope text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="size-4 mr-2" />
                {t('account.deleteAccount')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};