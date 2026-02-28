import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, History, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
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
  AccessLogEntry,
} from '../types';

const CONSENT_TYPES: ConsentType[] = [
  'privacy_policy',
  'treatment_consent',
  'data_sharing',
  'lab_test_consent',
  'communication_consent',
];

const REQUIRED_CONSENTS: ConsentType[] = ['privacy_policy', 'treatment_consent'];

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
  const [accessLog, setAccessLog] = useState<AccessLogEntry[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingAccessLog, setIsLoadingAccessLog] = useState(false);
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

  const fetchAccessLog = useCallback(async () => {
    try {
      setIsLoadingAccessLog(true);
      const data = await getAccessLog();
      setAccessLog(data);
    } catch (err) {
      console.error('Failed to fetch access log:', err);
    } finally {
      setIsLoadingAccessLog(false);
    }
  }, []);

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
      fetchAccessLog();
    }
  };

  const isRequired = (type: ConsentType) => REQUIRED_CONSENTS.includes(type);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <ShieldCheck className="size-6 md:size-8 text-teal-action" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-manrope">
            {t('consent.title')}
          </h1>
        </div>
        <p className="text-sm md:text-lg text-gray-600 font-manrope">
          {t('consent.pageDescription')}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            {t('consent.dismiss')}
          </button>
        </div>
      )}

      {/* Info banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <AlertTriangle className="size-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-blue-800 font-medium">{t('consent.retentionInfo')}</p>
          <p className="text-sm text-blue-700 mt-1">{t('consent.mustAcceptToUse')}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="consents" onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="consents">{t('consent.consentsTab')}</TabsTrigger>
          <TabsTrigger value="history">{t('consent.consentHistory')}</TabsTrigger>
          <TabsTrigger value="accessLog">{t('consent.accessLog')}</TabsTrigger>
        </TabsList>

        {/* Consents Tab */}
        <TabsContent value="consents">
          {isLoadingStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-9 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {CONSENT_TYPES.map((type) => {
                const status = consentsStatus?.consents[type];
                const hasAccepted = status?.hasAcceptedLatest ?? false;
                const required = isRequired(type);

                return (
                  <Card
                    key={type}
                    className="bg-white/95 backdrop-blur-md shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-manrope">
                          {t(consentTypeToTranslationKey[type])}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {required ? (
                            <Badge variant="destructive" className="text-xs">
                              {t('consent.required')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {t('consent.optional')}
                            </Badge>
                          )}
                          {hasAccepted ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              {t('consent.accepted')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">
                              {!status?.userConsentVersion
                                ? t('consent.withdrawn')
                                : t('consent.versionRequired')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="mt-2">
                        {t(consentTypeToDescriptionKey[type])}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {status?.currentVersion && (
                            <span>
                              {t('consent.version')}: {status.currentVersion}
                            </span>
                          )}
                          {status?.acceptedAt && (
                            <span className="ml-3">
                              {t('consent.acceptedOn')}: {new Date(status.acceptedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!hasAccepted && (
                            <Button
                              size="sm"
                              onClick={() => handleAccept(type)}
                              disabled={actionInProgress !== null}
                            >
                              {actionInProgress === type
                                ? t('consent.submitting')
                                : t('consent.accept')}
                            </Button>
                          )}
                          {hasAccepted && !required && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setWithdrawTarget(type)}
                              disabled={actionInProgress !== null}
                            >
                              {t('consent.withdraw')}
                            </Button>
                          )}
                          {hasAccepted && required && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="opacity-50"
                            >
                              {t('consent.withdraw')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Deletion grace period info */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">{t('consent.deletionGracePeriod')}</p>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          {isLoadingHistory ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
              <History className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">{t('consent.noHistory')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('consent.noHistoryMessage')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => (
                <div
                  key={`${record.consentType}-${record.timestamp}-${index}`}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 font-manrope">
                        {t(consentTypeToTranslationKey[record.consentType as ConsentType] || record.consentType)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('consent.version')}: {record.version}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </p>
                      {record.withdrawnAt && (
                        <p className="text-sm text-orange-600">
                          {t('consent.withdrawnOn')}: {new Date(record.withdrawnAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      {record.accepted && !record.withdrawnAt ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {t('consent.accepted')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {t('consent.withdrawn')}
                        </Badge>
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
          <div className="mb-4">
            <p className="text-sm text-gray-600">{t('consent.accessLogDescription')}</p>
          </div>

          {isLoadingAccessLog ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : accessLog.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
              <FileText className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">{t('consent.noAccessLog')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('consent.noAccessLogMessage')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accessLog.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 font-manrope">
                        {entry.action}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('consent.accessLogRole')}: {entry.accessedBy.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('consent.accessLogOperation')}: {entry.operation}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{entry.accessedBy.role}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={!!withdrawTarget} onOpenChange={(open) => !open && setWithdrawTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('consent.withdrawConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('consent.withdrawWarning')}
              {withdrawTarget && (
                <span className="block font-medium text-gray-800 mt-2">
                  {t(consentTypeToTranslationKey[withdrawTarget])}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionInProgress !== null}>
              {t('consent.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              disabled={actionInProgress !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionInProgress ? t('consent.submitting') : t('consent.confirmWithdraw')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
