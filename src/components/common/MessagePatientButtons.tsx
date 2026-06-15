import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toSmsNumber, toWhatsAppNumber } from '@/lib/phone';

type MessagePatientButtonsProps = {
  phone?: string | null;
  /** Meeting URL pasted into the message body. */
  url: string;
  className?: string;
  size?: 'sm' | 'default';
};

// Open a deep link reliably (anchor click works for sms: and https on both
// desktop and mobile, unlike window.open which desktop can swallow for sms:).
const openLink = (href: string, newTab: boolean) => {
  const a = document.createElement('a');
  a.href = href;
  if (newTab) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const MessagePatientButtons: React.FC<MessagePatientButtonsProps> = ({
  phone,
  url,
  className,
  size = 'sm',
}) => {
  const { t } = useTranslation();
  const hasPhone = !!phone && phone.trim().length > 0;

  if (!hasPhone) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* span wrapper so the tooltip still triggers on disabled buttons */}
          <span className={cn('inline-flex gap-2', className)}>
            <Button type="button" variant="outline" size={size} disabled className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              {t('countdown.sms')}
            </Button>
            <Button type="button" variant="outline" size={size} disabled className="text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              {t('countdown.whatsapp')}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{t('countdown.noPhone')}</TooltipContent>
      </Tooltip>
    );
  }

  const body = encodeURIComponent(url);
  // `?&body=` is the cross-platform form accepted by both iOS and Android.
  const smsHref = `sms:${toSmsNumber(phone!)}?&body=${body}`;
  const waHref = `https://wa.me/${toWhatsAppNumber(phone!)}?text=${body}`;

  return (
    <span className={cn('inline-flex gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={() => openLink(smsHref, false)}
        className="text-xs"
      >
        <MessageSquare className="w-3 h-3 mr-1" />
        {t('countdown.sms')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={() => openLink(waHref, true)}
        className="text-xs"
      >
        <MessageCircle className="w-3 h-3 mr-1" />
        {t('countdown.whatsapp')}
      </Button>
    </span>
  );
};

export default MessagePatientButtons;
