import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ShieldCheck, History, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  getAllConsentsStatus,
  recordConsent,
  withdrawConsent,
  getHistory,
  getAccessLog,
} from '../services/consentService';
import type {
  ConsentType,
  AllConsentsStatus,
  ConsentRecord,
} from '../types';

const CONSENT_TYPES: ConsentType[] = [
  'privacy_policy',
  'treatment_consent',
  'data_sharing',
  'lab_test_consent',
  'communication_consent',
];

const REQUIRED_CONSENTS: ConsentType[] = ['privacy_policy', 'treatment_consent', 'data_sharing'];

const consentTypeToTranslationKey: Record<ConsentType, string> = {
  privacy_policy: 'consent.privacyPolicy',
  treatment_consent: 'consent.treatmentConsent',
  data_sharing: 'consent.dataSharing',
  lab_test_consent: 'consent.labTestConsent',
  communication_consent: 'consent.communicationConsent',
};

const consentTypeToDescriptionKey: Record<ConsentType, string> = {
  privacy_policy: 'consent.descriptions.privacyPolicy',
  treatment_consent: 'consent.descriptions.treatmentConsent',
  data_sharing: 'consent.descriptions.dataSharing',
  lab_test_consent: 'consent.descriptions.labTestConsent',
  communication_consent: 'consent.descriptions.communicationConsent',
};

export const ConsentManagement: React.FC = () => {
  const { t } = useTranslation();

  const [consentsStatus, setConsentsStatus] = useState<AllConsentsStatus | null>(null);
  const [history, setHistory] = useState<ConsentRecord[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<ConsentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<ConsentType | null>(null);

  const fetchConsentsStatus = useCallback(async () => {
    try {
      setIsLoadingStatus(true);
      const data = await getAllConsentsStatus();
      setConsentsStatus(data);
    } catch (err) {
      console.error('Failed to fetch consent status:', err);
      setError(t('consent.errors.loadFailed'));
    } finally {
      setIsLoadingStatus(false);
    }
  }, [t]);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch consent history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const {
    data: accessLogData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingAccessLog,
    isError: isAccessLogError,
  } = useInfiniteQuery({
    queryKey: ['accessLog'],
    queryFn: ({ pageParam }) => getAccessLog(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: false,
  });

  const accessLog = accessLogData?.pages.flatMap((page) => page.logs) ?? [];

  useEffect(() => {
    fetchConsentsStatus();
  }, [fetchConsentsStatus]);

  const handleAccept = async (consentType: ConsentType) => {
    if (!consentsStatus) return;
    const status = consentsStatus.consents[consentType];
    if (!status) return;

    try {
      setActionInProgress(consentType);
      setError(null);
      await recordConsent(status.currentVersion, true, consentType);
      await fetchConsentsStatus();
    } catch (err) {
      console.error('Failed to accept consent:', err);
      setError(t('consent.errors.acceptFailed'));
    } finally {
      setActionInProgress(null);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawTarget) return;

    try {
      setActionInProgress(withdrawTarget);
      setError(null);
      await withdrawConsent(withdrawTarget);
      setWithdrawTarget(null);
      await fetchConsentsStatus();
    } catch (err) {
      console.error('Failed to withdraw consent:', err);
      setError(t('consent.errors.withdrawFailed'));
    } finally {
      setActionInProgress(null);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'history' && history.length === 0) {
      fetchHistory();
    }
    if (value === 'accessLog' && accessLog.length === 0) {
      fetchNextPage();
    }
  };

  const isRequired = (type: ConsentType) => REQUIRED_CONSENTS.includes(type);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-1 md:mb-2">
          <div className="w-10 h-10 rounded-full bg-[#f0f7f4] flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5 text-[#005044]" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#282828] font-sora">
            {t('consent.title')}
          </h1>
        </div>
        <p className="text-sm text-[#b0b0b0] font-manrope ml-[52px]">
          {t('consent.pageDescription')}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-2xl border border-red-200 flex items-center justify-between text-sm font-manrope">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-xs font-semibold ml-4 shrink-0"
          >
            {t('consent.dismiss')}
          </button>
        </div>
      )}

      {/* Info banner */}
      <div className="mb-6 p-4 bg-[#f0f7f4] border border-[#c0ebe5] rounded-2xl flex items-start gap-3">
        <AlertTriangle className="size-5 text-[#005044] mt-0.5 shrink-0" />
        <div className="font-manrope">
          <p className="text-sm text-[#005044] font-semibold">{t('consent.retentionInfo')}</p>
          <p className="text-sm text-[#005044]/70 mt-1">{t('consent.mustAcceptToUse')}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="consents" onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 bg-[#f0f7f4] rounded-full p-1">
          <TabsTrigger value="consents" className="rounded-full font-sora text-sm data-[state=active]:bg-white data-[state=active]:text-[#005044] data-[state=active]:shadow-sm text-[#b0b0b0]">
            {t('consent.consentsTab')}
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-full font-sora text-sm data-[state=active]:bg-white data-[state=active]:text-[#005044] data-[state=active]:shadow-sm text-[#b0b0b0]">
            {t('consent.consentHistory')}
          </TabsTrigger>
          <TabsTrigger value="accessLog" className="rounded-full font-sora text-sm data-[state=active]:bg-white data-[state=active]:text-[#005044] data-[state=active]:shadow-sm text-[#b0b0b0]">
            {t('consent.accessLog')}
          </TabsTrigger>
        </TabsList>

        {/* Consents Tab */}
        <TabsContent value="consents">
          {isLoadingStatus ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {CONSENT_TYPES.map((type) => {
                const status = consentsStatus?.consents[type];
                const hasAccepted = status?.hasAcceptedLatest ?? false;
                const required = isRequired(type);

                return (
                  <div
                    key={type}
                    className="bg-white rounded-2xl border border-[#e0e0e0] p-4 md:p-5 hover:border-[#c0ebe5] transition-colors"
                  >
                    {/* Top row: title + badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="font-sora font-semibold text-[#282828] text-base">
                        {t(consentTypeToTranslationKey[type])}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {required ? (
                          <span className="bg-[#005044] text-white rounded-full px-3 py-0.5 text-xs font-sora font-medium">
                            {t('consent.required')}
                          </span>
                        ) : (
                          <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-0.5 text-xs font-sora font-medium">
                            {t('consent.optional')}
                          </span>
                        )}
                        {hasAccepted ? (
                          <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-0.5 text-xs font-sora font-medium">
                            {t('consent.accepted')}
                          </span>
                        ) : (
                          <span className="bg-orange-50 text-orange-600 rounded-full px-3 py-0.5 text-xs font-sora font-medium border border-orange-200">
                            {!status?.userConsentVersion
                              ? t('consent.withdrawn')
                              : t('consent.versionRequired')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#b0b0b0] font-manrope mb-3">
                      {t(consentTypeToDescriptionKey[type])}
                    </p>

                    {/* Bottom row: meta + action */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-xs text-[#b0b0b0] font-manrope flex flex-wrap gap-x-3 gap-y-1">
                        {status?.currentVersion && (
                          <span>{t('consent.version')}: {status.currentVersion}</span>
                        )}
                        {status?.acceptedAt && (
                          <span>{t('consent.acceptedOn')}: {new Date(status.acceptedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!hasAccepted && (
                          <button
                            onClick={() => handleAccept(type)}
                            disabled={actionInProgress !== null}
                            className="bg-[#005044] text-white rounded-full px-5 py-2 text-sm font-sora font-semibold hover:bg-[#003d33] transition-colors disabled:opacity-50"
                          >
                            {actionInProgress === type
                              ? t('consent.submitting')
                              : t('consent.accept')}
                          </button>
                        )}
                        {hasAccepted && (
                          <button
                            onClick={!required ? () => setWithdrawTarget(type) : undefined}
                            disabled={required || actionInProgress !== null}
                            className="border border-[#e0e0e0] text-[#282828] rounded-full px-5 py-2 text-sm font-sora font-semibold hover:border-[#c0ebe5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {t('consent.withdraw')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Deletion grace period info */}
          <div className="mt-6 p-4 bg-[#f0f7f4] border border-[#c0ebe5] rounded-2xl">
            <p className="text-sm text-[#005044]/80 font-manrope">{t('consent.deletionGracePeriod')}</p>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          {isLoadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-10 md:p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f0f7f4] flex items-center justify-center mx-auto mb-4">
                <History className="size-7 text-[#c0ebe5]" />
              </div>
              <p className="text-[#282828] font-sora font-semibold">{t('consent.noHistory')}</p>
              <p className="text-[#b0b0b0] text-sm font-manrope mt-1">{t('consent.noHistoryMessage')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => (
                <div
                  key={`${record.consentType}-${record.timestamp}-${index}`}
                  className="bg-white rounded-2xl border border-[#e0e0e0] p-4 md:p-5 hover:border-[#c0ebe5] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-sora font-semibold text-[#282828]">
                        {t(consentTypeToTranslationKey[record.consentType as ConsentType] || record.consentType)}
                      </h3>
                      <p className="text-sm text-[#b0b0b0] font-manrope mt-1">
                        {t('consent.version')}: {record.version}
                      </p>
                      <p className="text-sm text-[#b0b0b0] font-manrope">
                        {new Date(record.timestamp).toLocaleString()}
                      </p>
                      {record.withdrawnAt && (
                        <p className="text-sm text-orange-500 font-manrope">
                          {t('consent.withdrawnOn')}: {new Date(record.withdrawnAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {record.accepted && !record.withdrawnAt ? (
                        <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-xs font-sora font-medium">
                          {t('consent.accepted')}
                        </span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 rounded-full px-3 py-1 text-xs font-sora font-medium border border-orange-200">
                          {t('consent.withdrawn')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Access Log Tab */}
        <TabsContent value="accessLog">
          <p className="text-sm text-[#b0b0b0] font-manrope mb-4">
            {t('consent.accessLogDescription')}
          </p>

          {isLoadingAccessLog ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : isAccessLogError ? (
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-10 md:p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="size-7 text-red-300" />
              </div>
              <p className="text-red-500 font-sora font-semibold">{t('consent.errors.loadFailed')}</p>
            </div>
          ) : accessLog.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-10 md:p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f0f7f4] flex items-center justify-center mx-auto mb-4">
                <FileText className="size-7 text-[#c0ebe5]" />
              </div>
              <p className="text-[#282828] font-sora font-semibold">{t('consent.noAccessLog')}</p>
              <p className="text-[#b0b0b0] text-sm font-manrope mt-1">{t('consent.noAccessLogMessage')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accessLog.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className="bg-white rounded-2xl border border-[#e0e0e0] p-4 md:p-5 hover:border-[#c0ebe5] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-sora font-semibold text-[#282828] text-sm truncate">
                        {entry.action}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-[#b0b0b0] font-manrope">
                        <span>{t('consent.accessLogRole')}: {entry.accessedBy.role}</span>
                        <span>{t('consent.accessLogOperation')}: {entry.operation}</span>
                      </div>
                      <p className="text-xs text-[#b0b0b0] font-manrope mt-0.5">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-xs font-sora font-medium shrink-0 self-start sm:self-center">
                      {entry.accessedBy.role}
                    </span>
                  </div>
                </div>
              ))}

              {hasNextPage && (
                <div className="flex justify-center pt-4 pb-2">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-[#f0f7f4] text-[#005044] rounded-full px-8 py-2.5 font-sora font-semibold text-sm hover:bg-[#c0ebe5] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('consent.loading')}
                      </>
                    ) : (
                      t('consent.loadMore')
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={!!withdrawTarget} onOpenChange={(open) => !open && setWithdrawTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sora text-[#282828]">{t('consent.withdrawConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="font-manrope text-[#b0b0b0]">
              {t('consent.withdrawWarning')}
              {withdrawTarget && (
                <span className="block font-semibold text-[#282828] mt-2 font-sora">
                  {t(consentTypeToTranslationKey[withdrawTarget])}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionInProgress !== null} className="rounded-full font-sora">
              {t('consent.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              disabled={actionInProgress !== null}
              className="bg-red-600 hover:bg-red-700 rounded-full font-sora"
            >
              {actionInProgress ? t('consent.submitting') : t('consent.confirmWithdraw')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
