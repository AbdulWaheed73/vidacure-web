import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

type MeetingCountdownProps = {
  startTime: string;
  endTime?: string | null;
  className?: string;
};

export const MeetingCountdown: React.FC<MeetingCountdownProps> = ({
  startTime,
  endTime,
  className,
}) => {
  const { t } = useTranslation();
  const { state, days, hours, minutes, seconds } = useCountdown(startTime, endTime);

  if (state === 'ended') return null;

  if (state === 'live') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 font-medium text-green-700', className)}>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {t('countdown.liveNow')}
      </span>
    );
  }

  let label: string;
  if (days >= 1) {
    label = t('countdown.daysHours', { days, hours });
  } else if (hours >= 1) {
    label = t('countdown.hoursMinutes', { hours, minutes });
  } else {
    label = t('countdown.minutesSeconds', { minutes, seconds });
  }

  return (
    <span className={cn('inline-flex items-center gap-1 tabular-nums', className)}>
      {t('countdown.startsIn')} {label}
    </span>
  );
};

export default MeetingCountdown;
