import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/adminService';
import type { ProviderTier } from '@/types/provider-types';

type ProviderTierRow = {
  _id: string;
  name: string;
  email: string;
  providerType: string;
  specialty?: string;
  tier: ProviderTier;
  source: 'override' | 'default';
};

type ManageTiersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  patientPlanType?: 'lifestyle' | 'medical';
  onSuccess: () => void;
};

export const ManageTiersModal = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  patientPlanType,
  onSuccess,
}: ManageTiersModalProps) => {
  const [providers, setProviders] = useState<ProviderTierRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchTiers();
    }
  }, [isOpen, patientId]);

  const fetchTiers = async () => {
    try {
      setIsFetching(true);
      const data = await adminService.getPatientProviderTiers(patientId);
      setProviders(data.providers);
    } catch (err) {
      console.error('Error fetching provider tiers:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleTierChange = async (providerId: string, value: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (value === 'default') {
        await adminService.removeProviderTierOverride(patientId, providerId);
      } else {
        await adminService.setProviderTierOverride(patientId, providerId, value as ProviderTier);
      }
      await fetchTiers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update tier');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectValue = (provider: ProviderTierRow) => {
    if (provider.source === 'override') {
      return provider.tier;
    }
    return 'default';
  };

  const getTierBadge = (tier: ProviderTier) => {
    if (tier === 'premium') {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          Premium
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Free
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Manage Tiers for {patientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient plan context */}
          <div className="bg-muted/50 rounded-md px-3 py-2 text-sm">
            Plan: <span className="font-medium capitalize">{patientPlanType || 'None'}</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {isFetching ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading providers...</div>
          ) : providers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active providers found.</p>
          ) : (
            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider._id}
                  className="flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{provider.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {provider.providerType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getTierBadge(provider.tier)}
                      <span className="text-xs text-muted-foreground">
                        {provider.source === 'override' ? 'Admin Override' : 'Default'}
                      </span>
                    </div>
                  </div>

                  <Select
                    value={getSelectValue(provider)}
                    onValueChange={(value) => handleTierChange(provider._id, value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onSuccess(); onClose(); }}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
