// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDoctorProfile } from '@/hooks/useDoctorDashboardQueries';
// import { exportMyData, downloadDataAsFile } from '@/services/dataExportService';
import { ProfileCard } from '@/components/account/ProfileCard';
// import { DataPrivacyCard } from '@/components/account/DataPrivacyCard';
import { AccountActionsCard } from '@/components/account/AccountActionsCard';
import { LanguageCard } from '@/components/account/LanguageCard';

const DoctorAccount: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { data, isLoading } = useDoctorProfile();
  const profile = data?.profile;
  // const [isExporting, setIsExporting] = useState(false);


  // const handleExportData = async () => {
  //   try {
  //     setIsExporting(true);
  //     const exportData = await exportMyData();
  //     downloadDataAsFile(exportData);
  //   } catch (error: unknown) {
  //     console.error('Failed to export data:', error);
  //     alert(t('account.exportError') || 'Failed to export data. Please try again.');
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="size-8 text-teal-action" />
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-80 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 h-48 bg-gray-200 rounded-[20px] animate-pulse" />
          <div className="col-span-1 h-48 bg-gray-200 rounded-[20px] animate-pulse" />
          <div className="col-span-1 lg:col-span-3 h-24 bg-gray-200 rounded-[20px] animate-pulse" />
        </div>
      </div>
    );
  }

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
        {profile && (
          <ProfileCard
            name={profile.name}
            givenName={profile.givenName}
            familyName={profile.familyName}
            role={profile.role}
            email={profile.email}
            memberSince={profile.createdAt}
          />
        )}

        {/* <DataPrivacyCard
          onExportData={handleExportData}
          isExporting={isExporting}
        /> */}

        <LanguageCard />

        <AccountActionsCard onLogout={logout} userType="doctor" />
      </div>
    </div>
  );
};

export default DoctorAccount;
