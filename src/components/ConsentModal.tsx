import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui';
import { useConsentStore } from '../stores/consentStore';

export const ConsentModal: React.FC = () => {
  const { t } = useTranslation();
  const { showConsentModal, currentVersion, acceptConsent } = useConsentStore();
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!accepted) return;
    try {
      setIsSubmitting(true);
      await acceptConsent();
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showConsentModal}>
      <DialogContent
        className="sm:max-w-md [&>button:last-child]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-manrope">{t('consent.title')}</DialogTitle>
          <DialogDescription className="font-manrope">
            {t('consent.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600 font-manrope">
            {t('consent.policyText')}
          </p>

          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:text-teal-700 underline font-manrope"
          >
            {t('consent.readPolicy')}
          </a>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="consent-checkbox"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="consent-checkbox"
              className="text-sm text-gray-700 font-manrope cursor-pointer leading-5"
            >
              {t('consent.acceptLabel', { version: currentVersion })}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={!accepted || isSubmitting}
            className="w-full font-manrope"
            size="lg"
          >
            {isSubmitting ? t('consent.submitting') : t('consent.accept')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
