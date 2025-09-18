import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { Button } from '../components/ui';
import type { User as UserType } from '../types';

type AccountPageProps = {
  user: UserType | null;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ user, onLogout }) => {
  const { t } = useTranslation();

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
          <Button 
            onClick={onLogout}
            variant="destructive"
            size="lg"
            className="font-manrope"
          >
            {t('account.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
};