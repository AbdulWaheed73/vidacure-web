import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { DeleteAccountDialog } from '../dashboard/DeleteAccountDialog';

type AccountActionsCardProps = {
  onLogout: () => void;
  userType: 'patient' | 'doctor';
};

export const AccountActionsCard = ({ onLogout, userType }: AccountActionsCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 col-span-1 lg:col-span-3">
      <h3 className="text-lg font-semibold text-gray-800 font-sora mb-5">
        {t('account.accountActions')}
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onLogout}
          className="bg-[#005044] text-white rounded-xl hover:bg-[#003d33] font-manrope px-6"
        >
          {t('account.logout')}
        </Button>

        <DeleteAccountDialog userType={userType} />
      </div>
    </div>
  );
};
