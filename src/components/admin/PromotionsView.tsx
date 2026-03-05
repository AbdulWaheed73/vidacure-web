import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Ban, Copy, Check } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Promotion } from '@/types/promotion-types';
import { CreatePromotionDialog } from './CreatePromotionDialog';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDiscount = (coupon: Promotion['coupon']) => {
  if (coupon.percentOff) return `${coupon.percentOff}% off`;
  if (coupon.amountOff) return `${coupon.amountOff} ${(coupon.currency || 'sek').toUpperCase()} off`;
  return 'N/A';
};

const formatDuration = (coupon: Promotion['coupon']) => {
  switch (coupon.duration) {
    case 'once': return 'Once';
    case 'forever': return 'Forever';
    case 'repeating': return `${coupon.durationInMonths} months`;
    default: return coupon.duration;
  }
};

const formatAppliesTo = (appliesTo: string) => {
  switch (appliesTo) {
    case 'subscriptions': return 'Subscriptions';
    case 'lab_tests': return 'Lab Tests';
    default: return 'All';
  }
};

export const PromotionsView = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeOnly, setActiveOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchPromotions = async (startingAfter?: string) => {
    try {
      if (!startingAfter) setLoading(true);
      const data = await adminService.listPromotions({
        active: activeOnly || undefined,
        startingAfter,
        limit: 25,
      });

      if (startingAfter) {
        setPromotions((prev) => [...prev, ...data.promotions]);
      } else {
        setPromotions(data.promotions);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [activeOnly]);

  const handleDeactivate = async (promoId: string, code: string) => {
    if (!confirm(`Deactivate promotion code "${code}"? It will no longer be usable at checkout.`)) {
      return;
    }
    try {
      await adminService.deactivatePromotion(promoId);
      fetchPromotions();
    } catch (error) {
      console.error('Error deactivating promotion:', error);
    }
  };

  const handleCopyCode = async (promoId: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(promoId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLoadMore = () => {
    const lastPromo = promotions[promotions.length - 1];
    if (lastPromo) fetchPromotions(lastPromo.id);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading promotions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promotions ({promotions.length})</h2>
        <div className="flex items-center gap-3">
          <Button
            variant={activeOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveOnly(!activeOnly)}
          >
            {activeOnly ? 'Active Only' : 'All'}
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {promotions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">No promotion codes found. Click "Create Promotion" to add one.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-mono font-semibold">{promo.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatAppliesTo(promo.appliesTo)}</Badge>
                    </TableCell>
                    <TableCell>{formatDiscount(promo.coupon)}</TableCell>
                    <TableCell>{formatDuration(promo.coupon)}</TableCell>
                    <TableCell>
                      {promo.timesRedeemed}
                      {promo.maxRedemptions ? ` / ${promo.maxRedemptions}` : ''}
                    </TableCell>
                    <TableCell>
                      {promo.expiresAt ? formatDate(promo.expiresAt) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {promo.active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(promo.id, promo.code)}
                          title="Copy code"
                        >
                          {copiedId === promo.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        {promo.active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(promo.id, promo.code)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Deactivate"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      )}

      <CreatePromotionDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => fetchPromotions()}
      />
    </div>
  );
};
