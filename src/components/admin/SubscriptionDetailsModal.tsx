import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { PatientSubscriptionDetailsResponse } from '../../types/payment-types';

type SubscriptionDetailsModalProps = {
  patientId: string | null;
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
};

export const SubscriptionDetailsModal = ({
  patientId,
  patientName,
  isOpen,
  onClose,
}: SubscriptionDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PatientSubscriptionDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchSubscriptionDetails();
    }
  }, [isOpen, patientId]);

  const fetchSubscriptionDetails = async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getPatientSubscriptionDetails(patientId);
      setData(response);
    } catch (err: any) {
      console.error('Error fetching subscription details:', err);
      setError(err.response?.data?.error || 'Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'SEK') => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trialing':
        return 'secondary';
      case 'past_due':
      case 'unpaid':
        return 'destructive';
      case 'canceled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
          <DialogDescription>
            Payment and subscription information for {patientName}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-4">
            {!data.stripeData && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                {data.message || 'No subscription data available'}
              </div>
            )}

            {data.stripeData && (
              <>
                {/* Subscription Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Information</CardTitle>
                    <CardDescription>Current subscription status and details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge variant={getStatusBadgeVariant(data.stripeData.subscription.status)}>
                          {data.stripeData.subscription.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subscription ID</p>
                        <p className="text-sm text-gray-900 font-mono">
                          {data.stripeData.subscription.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Period Start</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(data.stripeData.subscription.current_period_start)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Period End</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(data.stripeData.subscription.current_period_end)}
                        </p>
                      </div>
                      {data.stripeData.subscription.trial_start && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Trial Start</p>
                            <p className="text-sm text-gray-900">
                              {formatDate(data.stripeData.subscription.trial_start)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Trial End</p>
                            <p className="text-sm text-gray-900">
                              {formatDate(data.stripeData.subscription.trial_end)}
                            </p>
                          </div>
                        </>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cancel at Period End</p>
                        <p className="text-sm text-gray-900">
                          {data.stripeData.subscription.cancel_at_period_end ? 'Yes' : 'No'}
                        </p>
                      </div>
                      {data.stripeData.subscription.canceled_at && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Canceled At</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(data.stripeData.subscription.canceled_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                {data.stripeData.defaultPaymentMethod && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Default payment method for billing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Type</p>
                          <p className="text-sm text-gray-900 capitalize">
                            {data.stripeData.defaultPaymentMethod.type}
                          </p>
                        </div>
                        {data.stripeData.defaultPaymentMethod.card && (
                          <>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Card Brand</p>
                              <p className="text-sm text-gray-900 capitalize">
                                {data.stripeData.defaultPaymentMethod.card.brand}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Last 4 Digits</p>
                              <p className="text-sm text-gray-900 font-mono">
                                **** **** **** {data.stripeData.defaultPaymentMethod.card.last4}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Expiry</p>
                              <p className="text-sm text-gray-900">
                                {data.stripeData.defaultPaymentMethod.card.exp_month}/
                                {data.stripeData.defaultPaymentMethod.card.exp_year}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Upcoming Invoice */}
                {data.stripeData.upcomingInvoice && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Invoice</CardTitle>
                      <CardDescription>Next billing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Amount Due</p>
                          <p className="text-sm text-gray-900 font-semibold">
                            {formatCurrency(
                              data.stripeData.upcomingInvoice.amount_due,
                              data.stripeData.upcomingInvoice.currency
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Period Start</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(data.stripeData.upcomingInvoice.period_start)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Period End</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(data.stripeData.upcomingInvoice.period_end)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* All Payment Methods */}
                {data.stripeData.allPaymentMethods && data.stripeData.allPaymentMethods.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>All Payment Methods</CardTitle>
                      <CardDescription>
                        {data.stripeData.allPaymentMethods.length} payment method(s) on file
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data.stripeData.allPaymentMethods.map((pm) => (
                          <div
                            key={pm.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {pm.card && (
                                <>
                                  <div className="text-sm">
                                    <span className="font-medium capitalize">{pm.card.brand}</span>
                                    <span className="text-gray-500 ml-2">
                                      **** {pm.card.last4}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Exp: {pm.card.exp_month}/{pm.card.exp_year}
                                  </div>
                                </>
                              )}
                            </div>
                            {data.stripeData?.defaultPaymentMethod?.id === pm.id && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
