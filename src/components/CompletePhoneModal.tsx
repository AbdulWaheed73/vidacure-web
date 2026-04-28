import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { savePhone } from '@/services/questionnaire';
import { isValidSwedishPhone } from '@/components/onboarding/validation';
import { queryKeys } from '@/lib/queryClient';

type CompletePhoneModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CompletePhoneModal = ({ open, onOpenChange }: CompletePhoneModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!phone.trim()) {
      setError(t('onboarding.validation.phoneRequired'));
      return;
    }
    if (!isValidSwedishPhone(phone)) {
      setError(t('onboarding.validation.phoneInvalid'));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await savePhone(phone);
      await queryClient.invalidateQueries({ queryKey: queryKeys.patientProfile });
      setPhone('');
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || t('dashboard.completePhone.saveFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t('dashboard.completePhone.modalTitle')}</DialogTitle>
          <DialogDescription>{t('dashboard.completePhone.description')}</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <label className="block text-sm font-medium text-[#282828] mb-2 font-manrope">
            {t('onboarding.personalInfo.phone')}
          </label>
          <input
            type="tel"
            autoFocus
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t('onboarding.personalInfo.phonePlaceholder')}
            className="w-full p-3 border border-[#b0b0b0] rounded-[12px] font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005044]"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 font-manrope">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            {t('dashboard.completePhone.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting ? t('dashboard.completePhone.saving') : t('dashboard.completePhone.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
