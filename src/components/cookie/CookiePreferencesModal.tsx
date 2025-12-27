import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCookieConsentStore } from '@/stores/cookieConsentStore';

export const CookiePreferencesModal = () => {
  const { t } = useTranslation();
  const {
    consent,
    showPreferences,
    closePreferences,
    savePreferences,
  } = useCookieConsentStore();

  const [functional, setFunctional] = useState(consent?.functional ?? false);

  // Sync local state when consent changes
  useEffect(() => {
    setFunctional(consent?.functional ?? false);
  }, [consent]);

  const handleSave = () => {
    savePreferences({
      essential: true,
      functional,
    });
  };

  return (
    <Dialog open={showPreferences} onOpenChange={(open) => !open && closePreferences()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold font-['Sora'] text-zinc-800">
            {t('cookies.preferences.title', 'Cookie Preferences')}
          </DialogTitle>
          <DialogDescription className="text-sm font-['Manrope'] text-zinc-600">
            {t('cookies.preferences.description', 'Manage your cookie preferences below.')}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-6">
          {/* Essential Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 bg-zinc-50 rounded-2xl">
            <div className="flex-1">
              <h4 className="text-base font-semibold font-['Sora'] text-zinc-800">
                {t('cookies.preferences.essential.title', 'Essential Cookies')}
              </h4>
              <p className="text-sm font-['Manrope'] text-zinc-600 mt-1">
                {t('cookies.preferences.essential.description', 'Required for the website to function properly. Cannot be disabled.')}
              </p>
            </div>
            <div className="flex-shrink-0">
              {/* Always On Toggle (Disabled) */}
              <div className="w-12 h-7 bg-teal-600 rounded-full flex items-center justify-end px-1 opacity-60 cursor-not-allowed">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 bg-zinc-50 rounded-2xl">
            <div className="flex-1">
              <h4 className="text-base font-semibold font-['Sora'] text-zinc-800">
                {t('cookies.preferences.functional.title', 'Functional Cookies')}
              </h4>
              <p className="text-sm font-['Manrope'] text-zinc-600 mt-1">
                {t('cookies.preferences.functional.description', 'Enable appointment booking features (Calendly integration).')}
              </p>
            </div>
            <div className="flex-shrink-0">
              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={functional}
                onClick={() => setFunctional(!functional)}
                className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                  functional ? 'bg-teal-600' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    functional ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full h-11 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold font-['Sora'] text-sm transition-colors"
          >
            {t('cookies.preferences.save', 'Save Preferences')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesModal;
