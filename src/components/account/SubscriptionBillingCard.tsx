import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { SubscriptionStatusComponent } from '../subscription/SubscriptionStatus';
import { BillingHistory } from '../subscription/BillingHistory';
import { Button } from '../ui/Button';

export const SubscriptionBillingCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-4 md:p-6 col-span-1 lg:col-span-3">
      <div className="flex items-center gap-2 mb-5">
        <CreditCard className="size-5 text-[#005044]" />
        <h3 className="text-lg font-semibold text-gray-800 font-sora">
          {t('account.billing.title')}
        </h3>
        <Button
          onClick={() => navigate('/subscribe')}
          variant="outline"
          size="sm"
          className="font-manrope bg-white ml-auto"
        >
          {t('account.billing.viewPlans', 'View Plans')}
        </Button>
      </div>

      <SubscriptionStatusComponent />

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-base font-semibold text-gray-800 mb-3 font-sora">
          {t('account.billing.historyTitle')}
        </h4>
        <BillingHistory />
      </div>
    </div>
  );
};
