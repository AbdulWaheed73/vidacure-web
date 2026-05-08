import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PopupModal } from 'react-calendly';
import { toast } from 'sonner';
import { PaymentService } from '../../services';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES, CALENDLY_HYPNOTHERAPIST_URL } from '../../constants';
import { ArrowRight, Calendar, Check, Sparkles, Loader2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';

type HypnotherapistCardProps = {
  mode: 'landing' | 'checkout';
  layout?: 'vertical' | 'horizontal';
};

export const HypnotherapistCard = ({ mode, layout = 'vertical' }: HypnotherapistCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => !!s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const programIncludes = t('partner.teamMembers.giedre.programIncludes', { returnObjects: true }) as string[];

  const handleClick = async () => {
    if (isLoading) return;

    if (mode === 'landing') {
      if (isAuthenticated) {
        navigate(ROUTES.SUBSCRIBE_HYPNOTHERAPIST);
      } else {
        localStorage.setItem('vidacure_hypno_intent', 'true');
        navigate(ROUTES.PRE_LOGIN_BMI);
      }
      return;
    }

    // mode === 'checkout'
    setIsLoading(true);
    try {
      const { url } = await PaymentService.createHypnotherapistCheckout();
      window.location.href = url;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string; message?: string } } };
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
      toast.error(serverMessage || t('subscribeCard.checkoutError', 'Failed to start checkout. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const bookingModal = (
    <PopupModal
      url={CALENDLY_HYPNOTHERAPIST_URL}
      open={isBookingOpen}
      onModalClose={() => setIsBookingOpen(false)}
      rootElement={document.getElementById('root')!}
    />
  );

  if (layout === 'horizontal') {
    return (
      <>
      <Card className="border-0 bg-gradient-to-br from-[#003d33] to-[#005044] text-white shadow-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Left side — header, price, description, button */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="border-0 bg-gradient-to-r from-teal-600 to-teal-500 text-emerald-50 gap-1.5">
                  <Sparkles className="size-3.5" />
                  {t('hypnotherapist.badge')}
                </Badge>
              </div>
              <Separator className="bg-emerald-50/20" />
              <div>
                <h3 className="text-white text-2xl sm:text-3xl font-sora font-semibold">
                  {t('hypnotherapist.title')}
                </h3>
                <p className="text-emerald-200/80 text-sm font-medium font-manrope mt-1">
                  {t('hypnotherapist.subtitle')}
                </p>
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-white text-4xl sm:text-5xl font-bold font-sora leading-tight">
                  {t('hypnotherapist.price')}
                </span>
                <span className="text-white text-xl sm:text-2xl font-bold font-sora">
                  {t('hypnotherapist.currency')}
                </span>
                <span className="text-emerald-100/90 text-base sm:text-lg font-medium font-sora">
                  {t('hypnotherapist.billingPeriod')}
                </span>
              </div>
              <p className="text-emerald-50/90 text-base font-medium font-sora leading-relaxed">
                {t('hypnotherapist.description')}
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-amber-200 text-sm font-manrope italic font-semibold leading-relaxed">
                {t('hypnotherapist.bookingAdvisory')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  variant="outline"
                  className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white font-sora font-semibold px-6 h-11"
                >
                  <Calendar className="size-4" />
                  {t('hypnotherapist.bookAppointment')}
                </Button>
                {mode !== 'landing' && (
                  <Button
                    onClick={handleClick}
                    disabled={isLoading}
                    className="rounded-full bg-white text-zinc-800 hover:bg-emerald-50 font-sora font-semibold px-6 h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t('subscribeCard.processing')}
                      </>
                    ) : (
                      <>
                        {t('hypnotherapist.purchaseProgram')}
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right side — features list + disclaimer */}
          <div className="flex-1 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-emerald-50/20 flex flex-col justify-center">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-emerald-50 text-base font-bold font-manrope leading-snug">
                {t('pricing.includes')}
              </span>
              <div className="space-y-3 sm:space-y-4">
                {Array.isArray(programIncludes) && programIncludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <Check className="size-5 shrink-0 mt-0.5 text-emerald-300" />
                    <span className="flex-1 text-emerald-50 text-sm sm:text-base font-normal font-manrope leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3.5 py-2.5 mt-6">
              <Info className="size-4 shrink-0 text-amber-200 mt-0.5" />
              <p className="text-amber-100 text-sm font-manrope font-semibold leading-relaxed">
                {t('hypnotherapist.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </Card>
      {bookingModal}
      </>
    );
  }

  return (
    <>
    <Card className="border-0 bg-gradient-to-br from-[#003d33] to-[#005044] text-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className="border-0 bg-gradient-to-r from-teal-600 to-teal-500 text-emerald-50 gap-1.5">
            <Sparkles className="size-3.5" />
            {t('hypnotherapist.badge')}
          </Badge>
        </div>
        <Separator className="bg-emerald-50/20" />
        <CardTitle className="text-white text-2xl sm:text-3xl font-sora">
          {t('hypnotherapist.title')}
        </CardTitle>
        <CardDescription className="text-emerald-200/80 text-sm font-medium font-manrope">
          {t('hypnotherapist.subtitle')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-white text-4xl sm:text-5xl font-bold font-sora leading-tight">
            {t('hypnotherapist.price')}
          </span>
          <span className="text-white text-xl sm:text-2xl font-bold font-sora">
            {t('hypnotherapist.currency')}
          </span>
          <span className="text-emerald-100/90 text-base sm:text-lg font-medium font-sora">
            {t('hypnotherapist.billingPeriod')}
          </span>
        </div>

        {/* Description */}
        <p className="text-emerald-50/90 text-base sm:text-lg font-medium font-sora leading-relaxed">
          {t('hypnotherapist.description')}
        </p>

        {/* Includes */}
        <div className="space-y-3 sm:space-y-4">
          <span className="text-emerald-50 text-base font-bold font-manrope leading-snug">
            {t('pricing.includes')}
          </span>
          <div className="space-y-3 sm:space-y-4">
            {Array.isArray(programIncludes) && programIncludes.map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4">
                <Check className="size-5 shrink-0 mt-0.5 text-emerald-300" />
                <span className="flex-1 text-emerald-50 text-sm sm:text-base font-normal font-manrope leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3.5 py-2.5">
          <Info className="size-4 shrink-0 text-amber-200 mt-0.5" />
          <p className="text-amber-100 text-sm font-manrope font-semibold leading-relaxed">
            {t('hypnotherapist.disclaimer')}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3">
        <p className="text-amber-200 text-sm font-manrope italic font-semibold leading-relaxed">
          {t('hypnotherapist.bookingAdvisory')}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIsBookingOpen(true)}
            variant="outline"
            className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white font-sora font-semibold px-6 h-11"
          >
            <Calendar className="size-4" />
            {t('hypnotherapist.bookAppointment')}
          </Button>
          {mode !== 'landing' && (
            <Button
              onClick={handleClick}
              disabled={isLoading}
              className="rounded-full bg-white text-zinc-800 hover:bg-emerald-50 font-sora font-semibold px-6 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t('subscribeCard.processing')}
                </>
              ) : (
                <>
                  {t('hypnotherapist.purchaseProgram')}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
    {bookingModal}
    </>
  );
};
