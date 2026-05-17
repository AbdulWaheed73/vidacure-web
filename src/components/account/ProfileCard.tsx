import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Calendar, Clock, Eye, EyeOff, Fingerprint, Loader2 } from 'lucide-react';
import { ssnService } from '@/services/ssnService';

type ProfileCardProps = {
  name: string;
  givenName: string;
  familyName: string;
  role: string;
  email?: string;
  memberSince?: string;
  lastLogin?: string;
};

export const ProfileCard = ({
  name,
  givenName,
  familyName,
  role,
  email,
  memberSince,
  lastLogin,
}: ProfileCardProps) => {
  const { t } = useTranslation();
  const [ssnVisible, setSsnVisible] = useState(false);
  const [ssnLoading, setSsnLoading] = useState(false);
  const cachedSsn = useRef<string | null>(null);

  const initials = `${givenName?.charAt(0) || ''}${familyName?.charAt(0) || ''}`.toUpperCase() || name?.charAt(0)?.toUpperCase() || '?';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSSN = (ssn: string) => {
    if (ssn.length === 12) {
      return `${ssn.slice(0, 8)}-${ssn.slice(8)}`;
    }
    return ssn;
  };

  const handleToggleSSN = useCallback(async () => {
    if (ssnVisible) {
      setSsnVisible(false);
      return;
    }

    if (cachedSsn.current) {
      setSsnVisible(true);
      return;
    }

    try {
      setSsnLoading(true);
      const ssn = await ssnService.getMySSN();
      cachedSsn.current = ssn;
      setSsnVisible(true);
    } catch (error) {
      console.error('Failed to fetch SSN:', error);
    } finally {
      setSsnLoading(false);
    }
  }, [ssnVisible]);

  return (
    <div className="bg-[#005044] rounded-[20px] p-5 md:p-8 text-white col-span-1 lg:col-span-3">
      <div className="flex items-center gap-4 md:gap-5">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center text-lg md:text-xl font-sora font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="font-sora font-bold text-lg md:text-xl">{name}</h2>
          <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm font-sora capitalize mt-1">
            {role}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-white/70 text-sm font-manrope">
          <Fingerprint className="size-4 flex-shrink-0" />
          <span className="font-mono tracking-wider">
            {ssnVisible && cachedSsn.current ? formatSSN(cachedSsn.current) : '••••••••-••••'}
          </span>
          <button
            onClick={handleToggleSSN}
            disabled={ssnLoading}
            className="ml-1 p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label={ssnVisible ? t('account.hideSSN') : t('account.showSSN')}
          >
            {ssnLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : ssnVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {email && (
          <div className="flex items-center gap-2 text-white/70 text-sm font-manrope">
            <Mail className="size-4" />
            <span>{email}</span>
          </div>
        )}
        {memberSince && (
          <div className="flex items-center gap-2 text-white/70 text-sm font-manrope">
            <Calendar className="size-4" />
            <span>{t('account.memberSince')}: {formatDate(memberSince)}</span>
          </div>
        )}
        {lastLogin && (
          <div className="flex items-center gap-2 text-white/70 text-sm font-manrope">
            <Clock className="size-4" />
            <span>{t('account.lastLoginLabel')}: {formatDate(lastLogin)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
