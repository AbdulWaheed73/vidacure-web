import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { ArrowRightLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/Button';
import { PaymentService } from '../../services';

type ChangePlanDialogProps = {
  currentPlanType: 'lifestyle' | 'medical';
  onChanged?: () => void;
};

export const ChangePlanDialog = ({ currentPlanType, onChanged }: ChangePlanDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const newPlanType = currentPlanType === 'lifestyle' ? 'medical' : 'lifestyle';
  const currentPlanName = currentPlanType === 'lifestyle'
    ? t('account.billing.lifestyle')
    : t('account.billing.medical');
  const newPlanName = newPlanType === 'lifestyle'
    ? t('account.billing.lifestyle')
    : t('account.billing.medical');

  const currentDetails = PaymentService.getPlanDetails(currentPlanType);
  const newDetails = PaymentService.getPlanDetails(newPlanType);

  const changeMutation = useMutation({
    mutationFn: () => PaymentService.changePlan(newPlanType),
    onSuccess: () => {
      setOpen(false);
      onChanged?.();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!changeMutation.isPending) {
        setOpen(value);
        if (!value) changeMutation.reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-manrope bg-white"
        >
          <ArrowRightLeft className="size-3.5 mr-1" />
          {t('account.billing.changePlan')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-manrope">
            {t('account.billing.changePlanTitle')}
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-manrope">
            {t('account.billing.changePlanDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          {/* Current plan */}
          <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-manrope">{t('account.billing.currentPlanLabel')}</p>
                <p className="text-sm font-semibold text-gray-700 font-manrope">{currentPlanName}</p>
              </div>
              <p className="text-sm font-bold text-gray-700 font-manrope">
                {currentDetails.price} {currentDetails.currency}/{t('account.billing.perMonth', 'mo')}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#f0f7f4] flex items-center justify-center">
              <span className="text-[#005044] text-lg">↓</span>
            </div>
          </div>

          {/* New plan */}
          <div className="px-4 py-3 rounded-xl border-2 border-[#005044] bg-[#f0f7f4]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-[#005044] font-manrope">{t('account.billing.newPlanLabel')}</p>
                <p className="text-sm font-semibold text-[#005044] font-manrope">{newPlanName}</p>
              </div>
              <p className="text-sm font-bold text-[#005044] font-manrope">
                {newDetails.price} {newDetails.currency}/{t('account.billing.perMonth', 'mo')}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center font-manrope">
            {t('account.billing.changePlanProration')}
          </p>
        </div>

        {changeMutation.isError && (
          <p className="text-red-500 text-sm text-center font-manrope">
            {t('account.billing.changePlanError')}
          </p>
        )}

        <DialogFooter className="flex flex-row gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={changeMutation.isPending}
            className="font-manrope flex-1"
          >
            {t('cancelFlow.neverMind')}
          </Button>
          <Button
            onClick={() => changeMutation.mutate()}
            disabled={changeMutation.isPending}
            className="font-manrope flex-1 bg-[#005044] hover:bg-[#003d33] text-white"
          >
            {changeMutation.isPending
              ? t('account.billing.loading')
              : t('account.billing.confirmChangePlan')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
