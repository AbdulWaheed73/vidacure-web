import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Receipt } from 'lucide-react';
import { PaymentService } from '../../services';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import type { Invoice } from '@/types/payment-types';

export const BillingHistory: React.FC = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await PaymentService.getInvoiceHistory();
        setInvoices(data);
      } catch (err) {
        console.error('Error fetching invoice history:', err);
        setError(t('account.billing.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [t]);

  const formatAmount = (amount: number, currency: string) => {
    const value = amount / 100;
    return `${value.toLocaleString('sv-SE')} ${currency.toUpperCase()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const getPlanLabel = (planType: string | null) => {
    if (planType === 'lifestyle') return t('account.billing.lifestyle');
    if (planType === 'medical') return t('account.billing.medical');
    return '-';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 font-manrope">{error}</p>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="py-6 text-center bg-gray-50 rounded-2xl">
        <Receipt className="size-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400 font-manrope">
          {t('account.billing.empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-sm text-gray-500 font-manrope whitespace-nowrap">
              {formatDate(invoice.date)}
            </span>
            <span className="text-sm font-semibold text-gray-800 font-manrope whitespace-nowrap">
              {formatAmount(invoice.amount, invoice.currency)}
            </span>
            <span className="text-sm text-gray-500 font-manrope hidden sm:inline">
              {getPlanLabel(invoice.planType)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-manrope text-xs">
              {t('account.billing.paid')}
            </Badge>
            {(invoice.receiptUrl || invoice.invoicePdf) && (
              <a
                href={invoice.receiptUrl || invoice.invoicePdf || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#005044] hover:text-[#003d33] font-manrope"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
