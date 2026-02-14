import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Receipt } from 'lucide-react';
import { PaymentService } from '../../services';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
// import type { Invoice } from '../../types/payment-types';
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
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
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
      <div className="py-6 text-center">
        <Receipt className="size-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 font-manrope">
          {t('account.billing.empty')}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-manrope">{t('account.billing.date')}</TableHead>
          <TableHead className="font-manrope">{t('account.billing.amount')}</TableHead>
          <TableHead className="font-manrope">{t('account.billing.plan')}</TableHead>
          <TableHead className="font-manrope">{t('account.billing.status')}</TableHead>
          <TableHead className="text-right font-manrope">{t('account.billing.receipt')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-manrope">{formatDate(invoice.date)}</TableCell>
            <TableCell className="font-manrope">{formatAmount(invoice.amount, invoice.currency)}</TableCell>
            <TableCell className="font-manrope">{getPlanLabel(invoice.planType)}</TableCell>
            <TableCell>
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                {t('account.billing.paid')}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {(invoice.receiptUrl || invoice.invoicePdf) && (
                <a
                  href={invoice.receiptUrl || invoice.invoicePdf || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-manrope"
                >
                  {t('account.billing.receipt')}
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
