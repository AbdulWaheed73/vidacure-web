import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionStatus, SubscriptionPlan } from '@/types/doctor-patient-types';

const ACTIVE_STATUSES: SubscriptionStatus[] = ['active', 'trialing'];
const PAST_DUE_STATUSES: SubscriptionStatus[] = ['past_due', 'unpaid'];

// Whole days elapsed since the last paid period ended (the payment due date).
// Returns null when we have no anchor date; clamps negatives to 0.
const daysOverdue = (currentPeriodEnd: string | null): number | null => {
  if (!currentPeriodEnd) return null;
  const end = new Date(currentPeriodEnd).getTime();
  if (Number.isNaN(end)) return null;
  const diffMs = Date.now() - end;
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const chipBase =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold border';

type SubscriptionBadgeProps = {
  status: SubscriptionStatus | null;
  plan: SubscriptionPlan | null;
  currentPeriodEnd?: string | null;
};

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  status,
  plan,
  currentPeriodEnd = null,
}) => {
  const { t } = useTranslation();

  // Past due / unpaid: amber "Past due · X days" + a separate "Inactive" tag.
  if (status && PAST_DUE_STATUSES.includes(status)) {
    const days = daysOverdue(currentPeriodEnd);
    const statusLabel = t(`doctorPatients.subscription.status.${status}`);
    return (
      <span className="inline-flex items-center gap-1.5 flex-wrap">
        <span className={`${chipBase} bg-amber-50 text-amber-700 border-amber-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {statusLabel}
          {days !== null && (
            <span className="opacity-80 font-manrope font-medium">
              · {t('doctorPatients.subscription.daysOverdue', { count: days })}
            </span>
          )}
        </span>
        <span className={`${chipBase} bg-gray-100 text-gray-500 border-gray-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          {t('doctorPatients.subscription.inactive')}
        </span>
      </span>
    );
  }

  // No usable subscription (never bought / canceled / incomplete): the "other" inactive.
  if (!status || !ACTIVE_STATUSES.includes(status) || !plan) {
    return (
      <span className={`${chipBase} bg-gray-100 text-gray-500 border-gray-200`}>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        {t('doctorPatients.subscription.noSubscription')}
      </span>
    );
  }

  // Active / trialing plan.
  const planLabel = t(`doctorPatients.subscription.plan.${plan}`);
  const isMedical = plan === 'medical';
  const isTrial = status === 'trialing';

  return (
    <span
      className={`${chipBase} ${
        isMedical
          ? 'bg-[#005044] text-white border-[#005044]'
          : 'bg-[#f0f7f4] text-[#005044] border-[#c0ebe5]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isMedical ? 'bg-[#c0ebe5]' : 'bg-[#005044]'}`} />
      {planLabel}
      {isTrial && (
        <span
          className={`opacity-80 font-manrope font-medium ${isMedical ? 'text-white' : 'text-[#005044]'}`}
        >
          · {t('doctorPatients.subscription.status.trialing')}
        </span>
      )}
    </span>
  );
};

export default SubscriptionBadge;
