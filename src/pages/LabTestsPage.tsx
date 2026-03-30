import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, TestTubes, ArrowRight, MapPin, ExternalLink, RefreshCw, ShieldAlert, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { LabTestOrderStatusBadge } from '../components/LabTestOrderStatus';
import { LabTestResults } from '../components/LabTestResults';
import { useLabTestStore } from '../stores/labTestStore';
import { ROUTES } from '../constants';
import type { LabTestPackage, LabTestOrder } from '../types/lab-test-types';

export const LabTestsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    packages,
    orders,
    selectedOrder,
    isLoadingPackages,
    isLoadingOrders,
    isLoadingOrder,
    isCreatingCheckout,
    isSyncing,
    error,
    consentRequired,
    fetchPackages,
    fetchOrders,
    fetchOrderById,
    createCheckoutSession,
    syncOrders,
    clearError,
    clearSelectedOrder,
  } = useLabTestStore();

  const [confirmPackage, setConfirmPackage] = useState<LabTestPackage | null>(null);
  const [resultOrder, setResultOrder] = useState<LabTestOrder | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const isSv = i18n.language === 'sv';

  useEffect(() => {
    // Reset consent state on mount so re-visiting after accepting consent works
    useLabTestStore.setState({ consentRequired: false });
    fetchPackages();
    fetchOrders();
  }, [fetchPackages, fetchOrders]);

  const formatPrice = (amountOre: number, currency: string) => {
    const amount = amountOre / 100;
    return `${amount} ${currency.toUpperCase()}`;
  };

  const handleOrderConfirm = async () => {
    if (!confirmPackage) return;
    const url = await createCheckoutSession(confirmPackage.id);
    if (url) {
      setConfirmPackage(null);
      window.location.href = url;
    }
  };

  const handleViewResults = (order: LabTestOrder) => {
    fetchOrderById(order._id);
    setResultOrder(order);
  };

  const handleSyncOrders = async () => {
    setSyncMessage(null);
    const result = await syncOrders();
    if (result) {
      if (result.discovered > 0 || result.updated > 0) {
        setSyncMessage(t('labTests.syncFoundResults', { discovered: result.discovered, updated: result.updated }));
      } else {
        setSyncMessage(t('labTests.syncUpToDate'));
      }
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  if (consentRequired) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-manrope">{t('consent.errors.consentRequiredTitle')}</h2>
            <p className="text-gray-500 mb-6 text-sm">
              {t('consent.errors.consentRequiredLabTests')}
            </p>
            <Button
              onClick={() => navigate(ROUTES.PATIENT_CONSENT)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {t('consent.errors.reviewConsent')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="size-8 text-[#009689]" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">
            {t('labTests.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          {t('labTests.description')}
        </p>
      </div>

      {/* Blood Testing Resource Banner */}
      <div
        onClick={() => navigate('/resources?article=blood-testing')}
        className="mb-8 bg-[#f0f7f4] border border-[#009689]/20 rounded-2xl p-5 sm:p-6 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-[#009689]/40 transition-all duration-200 group"
      >
        <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm">
          <TestTubes className="size-6 text-[#009689]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 font-manrope">
            {t('labTests.resourceBannerTitle')}
          </h3>
          <p className="text-sm text-gray-600 font-manrope mt-0.5">
            {t('labTests.resourceBannerDescription')}
          </p>
        </div>
        <ArrowRight className="size-5 text-[#009689] shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Synlab Links */}
      <div className="mb-8 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="size-5 text-[#009689]" />
          <h3 className="font-semibold text-gray-800 font-manrope">
            {t('labTests.findTestLocation')}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://synlab.se/patient/har-finns-vi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#009689] hover:text-[#005044] font-manrope font-medium transition-colors"
          >
            <ExternalLink className="size-3.5 shrink-0" />
            {t('labTests.synlabLocations')}
          </a>
          <a
            href="https://synlab.se/patient/har-finns-vi/provtagningspartners"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#009689] hover:text-[#005044] font-manrope font-medium transition-colors"
          >
            <ExternalLink className="size-3.5 shrink-0" />
            {t('labTests.synlabPartners')}
          </a>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700 text-sm">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="available">{t('labTests.availableTests')}</TabsTrigger>
          <TabsTrigger value="orders">{t('labTests.myOrders')}</TabsTrigger>
        </TabsList>

        {/* Available Tests Tab */}
        <TabsContent value="available">
          {isLoadingPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full mt-1" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
              <FlaskConical className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('labTests.noPackages')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="bg-white/95 backdrop-blur-md shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {isSv ? pkg.nameSv : pkg.name}
                    </CardTitle>
                    <CardDescription>
                      {isSv ? pkg.descriptionSv : pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {t('labTests.includedTests')}
                      </p>
                      <ul className="space-y-1.5">
                        {(t('labTests.testItems', { returnObjects: true }) as string[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600 font-manrope">
                            <span className="text-[#009689] mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {pkg.analyses.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">
                          {t('labTests.includedAnalyses')}:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.analyses.map((analysis) => (
                            <Badge key={analysis.code} variant="secondary" className="text-xs">
                              {isSv ? analysis.nameSv : analysis.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        {pkg.originalPriceAmountOre && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-400 line-through decoration-2 decoration-red-400/70">
                              {formatPrice(pkg.originalPriceAmountOre, pkg.priceCurrency)}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                              -50%
                            </span>
                          </div>
                        )}
                        <span className="text-lg font-bold text-[#009689]">
                          {formatPrice(pkg.priceAmountOre, pkg.priceCurrency)}
                        </span>
                      </div>
                      <Button
                        onClick={() => setConfirmPackage(pkg)}
                        disabled={isCreatingCheckout}
                        className="bg-[#009689] hover:bg-[#005044] text-white"
                      >
                        {t('labTests.orderTest')}
                      </Button>
                    </div>
                    <div className="w-full rounded-xl p-3 relative overflow-hidden bg-gradient-to-r from-teal-600 to-teal-500">
                      <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10" />
                      <div className="flex items-center justify-between relative">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white/80 text-[10px] font-manrope font-medium uppercase tracking-wide">
                            {t('pricing.promoLabel', { discount: '50%' })}
                          </span>
                          <span className="font-mono font-bold tracking-widest text-sm text-white">BLOD200</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText('BLOD200');
                            toast.success(t('promo.codeCopied'));
                          }}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Orders Tab */}
        <TabsContent value="orders">
          <div className="flex items-center justify-between mb-4">
            <div />
            <div className="flex items-center gap-3">
              {syncMessage && (
                <span className="text-sm text-[#009689] font-medium">{syncMessage}</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncOrders}
                disabled={isSyncing}
                className="gap-2"
              >
                <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? t('labTests.syncing') : t('labTests.refreshResults')}
              </Button>
            </div>
          </div>
          {isLoadingOrders ? (
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
          ) : orders.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
              <FlaskConical className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">{t('labTests.noOrders')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('labTests.noOrdersMessage')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {isSv ? order.testPackage.nameSv : order.testPackage.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('labTests.orderedOn')}: {new Date(order.orderedAt).toLocaleDateString()}
                      </p>
                      {order.completedAt && (
                        <p className="text-sm text-gray-500">
                          {t('labTests.completedOn')}: {new Date(order.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <LabTestOrderStatusBadge status={order.status} />
                      {order.results.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(order)}
                        >
                          {t('labTests.viewResults')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Confirmation Dialog */}
      <AlertDialog open={!!confirmPackage} onOpenChange={(open) => !open && setConfirmPackage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('labTests.paymentConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('labTests.paymentConfirmMessage')}
              <span className="block font-medium text-gray-800 mt-2">
                {confirmPackage && (isSv ? confirmPackage.nameSv : confirmPackage.name)}
                {confirmPackage && ` — ${formatPrice(confirmPackage.priceAmountOre, confirmPackage.priceCurrency)}`}
              </span>
              <span className="block text-sm text-gray-500 mt-2">
                {t('labTests.paymentConfirmNote')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreatingCheckout}>
              {t('labTests.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleOrderConfirm} disabled={isCreatingCheckout}>
              {isCreatingCheckout ? t('labTests.paymentProcessing') : t('labTests.proceedToPayment')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Results Detail Dialog */}
      <Dialog open={!!resultOrder} onOpenChange={(open) => {
        if (!open) {
          setResultOrder(null);
          clearSelectedOrder();
        }
      }}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('labTests.results')}</DialogTitle>
            <DialogDescription>
              {resultOrder && (isSv ? resultOrder.testPackage.nameSv : resultOrder.testPackage.name)}
              {' - '}
              {resultOrder && new Date(resultOrder.orderedAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {isLoadingOrder ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : selectedOrder ? (
            <LabTestResults results={selectedOrder.results} labComment={selectedOrder.labComment} statusHistory={selectedOrder.statusHistory} />
          ) : resultOrder ? (
            <LabTestResults results={resultOrder.results} labComment={resultOrder.labComment} statusHistory={resultOrder.statusHistory} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
