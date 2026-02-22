import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import type { User as UserType } from '../types';
import { exportMyData, downloadDataAsFile } from '../services/dataExportService';
import { useConsentStore } from '../stores/consentStore';
import { ProfileCard } from '../components/account/ProfileCard';
import { DataPrivacyCard } from '../components/account/DataPrivacyCard';
import { AccountActionsCard } from '../components/account/AccountActionsCard';
import { SubscriptionBillingCard } from '../components/account/SubscriptionBillingCard';

type AccountPageProps = {
  user: UserType | null;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const { hasAcceptedLatest, currentVersion } = useConsentStore();

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const data = await exportMyData();
      downloadDataAsFile(data);
    } catch (error: unknown) {
      console.error('Failed to export data:', error);
      alert(t('account.exportError') || 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {user && (
          <ProfileCard
            name={user.name}
            givenName={user.given_name}
            familyName={user.family_name}
            role={user.role}
            lastLogin={user.lastLogin}
          />
        )}

        <DataPrivacyCard
          onExportData={handleExportData}
          isExporting={isExporting}
          showConsent
          hasAcceptedLatest={hasAcceptedLatest}
          currentVersion={currentVersion}
        />

        {user?.role === 'patient' && <SubscriptionBillingCard />}

        <AccountActionsCard onLogout={onLogout} userType="patient" />
      </div>
    </div>
  );
};
