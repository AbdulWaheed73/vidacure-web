import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical } from 'lucide-react';
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
import type { LabTestPackage, LabTestOrder } from '../types/lab-test-types';

export const LabTestsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    packages,
    orders,
    selectedOrder,
    isLoadingPackages,
    isLoadingOrders,
    isLoadingOrder,
    isPlacingOrder,
    error,
    fetchPackages,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    clearError,
    clearSelectedOrder,
  } = useLabTestStore();

  const [confirmPackage, setConfirmPackage] = useState<LabTestPackage | null>(null);
  const [resultOrder, setResultOrder] = useState<LabTestOrder | null>(null);

  const isSv = i18n.language === 'sv';

  useEffect(() => {
    fetchPackages();
    fetchOrders();
  }, [fetchPackages, fetchOrders]);

  const handleOrderConfirm = async () => {
    if (!confirmPackage) return;
    const success = await placeOrder(confirmPackage.id);
    if (success) {
      setConfirmPackage(null);
    }
  };

  const handleViewResults = (order: LabTestOrder) => {
    fetchOrderById(order._id);
    setResultOrder(order);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">
            {t('labTests.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          {t('labTests.description')}
        </p>
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
                  <CardContent>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {t('labTests.includedAnalyses')}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.analyses.map((analysis) => (
                        <Badge key={analysis.code} variant="secondary" className="text-xs">
                          {isSv ? analysis.nameSv : analysis.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => setConfirmPackage(pkg)}
                      disabled={isPlacingOrder}
                    >
                      {t('labTests.orderTest')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Orders Tab */}
        <TabsContent value="orders">
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
            <AlertDialogTitle>{t('labTests.orderConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('labTests.orderConfirmMessage')}
              <span className="block font-medium text-gray-800 mt-2">
                {confirmPackage && (isSv ? confirmPackage.nameSv : confirmPackage.name)}
              </span>
              <span className="block text-sm text-gray-500 mt-2">
                {t('labTests.orderConfirmNote')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPlacingOrder}>
              {t('labTests.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleOrderConfirm} disabled={isPlacingOrder}>
              {isPlacingOrder ? t('labTests.ordering') : t('labTests.confirmOrder')}
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
            <LabTestResults results={selectedOrder.results} />
          ) : resultOrder ? (
            <LabTestResults results={resultOrder.results} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
