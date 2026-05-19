import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Sparkles, FlaskConical, Check } from 'lucide-react';
import { queryKeys } from '@/lib/queryClient';
import { PaymentService } from '@/services';
import { calendlyService } from '@/services/calendlyService';
import { useLabTestOrdersQuery } from '@/hooks/useLabTestOrdersQuery';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

type StepProps = {
  ordinal: string;
  done: boolean;
  current: boolean;
  icon: React.ElementType;
  title: string;
  description: string;
  ctaLabel: string;
  doneLabel: string;
  onClick: () => void;
};

const StepRow = ({
  ordinal,
  done,
  current,
  icon: Icon,
  title,
  description,
  ctaLabel,
  doneLabel,
  onClick,
}: StepProps) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-5 rounded-2xl border transition-colors',
        current
          ? 'bg-[#f0f7f4] border-[#005044]/40 shadow-sm'
          : 'bg-white border-gray-200'
      )}
    >
      {/* Badge */}
      <div
        className={cn(
          'shrink-0 size-10 md:size-12 rounded-full flex items-center justify-center',
          current ? 'bg-[#005044] text-white' : 'bg-white border-2 border-[#005044] text-[#005044]'
        )}
      >
        {done ? (
          <Check className="size-5 md:size-6" />
        ) : (
          <span className="font-sora font-bold text-sm md:text-base leading-none">
            {ordinal}
          </span>
        )}
      </div>

      {/* Icon + body */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <Icon className="size-5 md:size-6 shrink-0 text-[#005044]" />
        <div className="flex-1 min-w-0">
          <h3 className="font-sora font-semibold text-base md:text-lg text-gray-900">
            {title}
          </h3>
          <p className="font-manrope text-sm mt-0.5 text-gray-600">{description}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 sm:ml-2">
        {done ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#005044]/10 text-[#005044] font-sora text-sm font-semibold">
            <Check className="size-4" />
            {doneLabel}
          </span>
        ) : current ? (
          <Button
            onClick={onClick}
            className="rounded-full font-sora font-semibold bg-[#005044] hover:bg-[#003d33] text-white"
          >
            {ctaLabel}
          </Button>
        ) : (
          <Button
            onClick={onClick}
            variant="outline"
            className="rounded-full font-sora font-semibold border-[#005044] text-[#005044] hover:bg-[#f0f7f4] bg-white"
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export const OnboardingJourney = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: subscriptionStatus } = useQuery({
    queryKey: queryKeys.subscriptionStatus,
    queryFn: () => PaymentService.getSubscriptionStatus(),
  });

  const { data: meetingsData, isLoading: meetingsLoading } = useQuery({
    queryKey: queryKeys.patientMeetings,
    queryFn: () => calendlyService.getPatientMeetings(),
  });

  const { data: ordersData, isLoading: ordersLoading } = useLabTestOrdersQuery();

  const step1Done =
    !meetingsLoading &&
    !!meetingsData?.meetings?.some(
      (m) => m.status === 'scheduled' || m.status === 'active' || m.status === 'completed'
    );
  const step2Done = !!subscriptionStatus?.hasSubscription;
  const step3Done = !ordersLoading && (ordersData?.orders?.length ?? 0) > 0;

  const doneFlags = [step1Done, step2Done, step3Done];
  const currentIdx = doneFlags.findIndex((d) => !d);

  if (meetingsLoading || ordersLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-5 md:p-8 bg-white">
      <div className="mb-5 md:mb-6 text-center">
        <h2 className="font-sora font-bold text-xl md:text-2xl text-gray-900">
          {t('dashboard.journey.title')}
        </h2>
        <p className="font-manrope text-sm md:text-base text-gray-600 mt-1">
          {t('dashboard.journey.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <StepRow
          ordinal="1st"
          done={step1Done}
          current={currentIdx === 0}
          icon={Calendar}
          title={t('dashboard.journey.step1Title')}
          description={t('dashboard.journey.step1Description')}
          ctaLabel={t('dashboard.journey.step1Cta')}
          doneLabel={t('dashboard.journey.stepDone')}
          onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
        />
        <StepRow
          ordinal="2nd"
          done={step2Done}
          current={currentIdx === 1}
          icon={Sparkles}
          title={t('dashboard.journey.step2Title')}
          description={t('dashboard.journey.step2Description')}
          ctaLabel={t('dashboard.journey.step2Cta')}
          doneLabel={t('dashboard.journey.stepDone')}
          onClick={() => navigate(ROUTES.SUBSCRIBE)}
        />
        <StepRow
          ordinal="3rd"
          done={step3Done}
          current={currentIdx === 2}
          icon={FlaskConical}
          title={t('dashboard.journey.step3Title')}
          description={t('dashboard.journey.step3Description')}
          ctaLabel={t('dashboard.journey.step3Cta')}
          doneLabel={t('dashboard.journey.stepDone')}
          onClick={() => navigate(ROUTES.PATIENT_LAB_TESTS)}
        />
      </div>
    </Card>
  );
};
