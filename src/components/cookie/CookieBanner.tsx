import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCookieConsentStore } from '@/stores/cookieConsentStore';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export const CookieBanner = () => {
  const { t } = useTranslation();
  const {
    hasInteracted,
    showBanner,
    acceptAll,
    rejectAll,
    openPreferences,
  } = useCookieConsentStore();

  // Don't show banner if user has already interacted
  if (hasInteracted || !showBanner) {
    return <CookiePreferencesModal />;
  }

  return (
    <>
      <CookiePreferencesModal />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-zinc-200">
          {/* Mobile Layout */}
          <div className="sm:hidden p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-zinc-800 text-lg font-bold font-['Sora']">
                {t('cookies.banner.title', 'We use cookies')}
              </h3>
              <p className="text-zinc-600 text-sm font-normal font-['Manrope'] leading-relaxed">
                {t('cookies.banner.description', 'We use cookies to enhance your experience and enable appointment booking features.')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={acceptAll}
                className="w-full h-11 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold font-['Sora'] text-sm transition-colors"
              >
                {t('cookies.banner.acceptAll', 'Accept All')}
              </button>
              <button
                onClick={openPreferences}
                className="w-full h-11 px-6 py-2.5 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full font-semibold font-['Sora'] text-sm transition-colors"
              >
                {t('cookies.banner.customize', 'Customize')}
              </button>
              <button
                onClick={rejectAll}
                className="w-full h-11 px-6 py-2.5 text-zinc-600 hover:text-zinc-800 rounded-full font-semibold font-['Sora'] text-sm transition-colors"
              >
                {t('cookies.banner.rejectAll', 'Reject All')}
              </button>
            </div>

            <Link
              to="/privacy"
              className="text-teal-600 text-sm font-medium font-['Manrope'] underline hover:text-teal-700 text-center"
            >
              {t('cookies.banner.privacyPolicy', 'Privacy Policy')}
            </Link>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex p-6 items-center justify-between gap-6">
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-relaxed">
                <span className="font-semibold">{t('cookies.banner.title', 'We use cookies')}</span>
                {' '}{t('cookies.banner.descriptionShort', 'to enhance your experience and enable appointment booking.')}
                {' '}
                <Link
                  to="/privacy"
                  className="text-teal-600 font-medium underline hover:text-teal-700"
                >
                  {t('cookies.banner.privacyPolicy', 'Privacy Policy')}
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={rejectAll}
                className="h-10 px-5 py-2 text-zinc-600 hover:text-zinc-800 rounded-full font-semibold font-['Sora'] text-sm transition-colors"
              >
                {t('cookies.banner.rejectAll', 'Reject All')}
              </button>
              <button
                onClick={openPreferences}
                className="h-10 px-5 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full font-semibold font-['Sora'] text-sm transition-colors"
              >
                {t('cookies.banner.customize', 'Customize')}
              </button>
              <button
                onClick={acceptAll}
                className="h-10 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold font-['Sora'] text-sm transition-colors"
              >
                {t('cookies.banner.acceptAll', 'Accept All')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;
