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
import { X } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Provider } from '@/types/provider-types';

type AssignProviderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  assignedProviderIds: string[];
  onSuccess: () => void;
};

export const AssignProviderModal = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  assignedProviderIds,
  onSuccess,
}: AssignProviderModalProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  const fetchProviders = async () => {
    try {
      const data = await adminService.getProviders();
      setProviders(data.providers.filter(p => p.isActive));
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  };

  const availableProviders = providers.filter(
    p => !assignedProviderIds.includes(p._id)
  );

  const assignedProviders = providers.filter(
    p => assignedProviderIds.includes(p._id)
  );

  const handleAssign = async () => {
    if (!selectedProviderId) return;
    setIsLoading(true);
    setError(null);

    try {
      await adminService.assignProviderToPatient(patientId, selectedProviderId);
      setSelectedProviderId('');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to assign provider');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async (providerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await adminService.unassignProviderFromPatient(patientId, providerId);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to unassign provider');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Manage Providers for {patientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Currently assigned providers */}
          {assignedProviders.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Assigned Providers</p>
              <div className="flex flex-wrap gap-2">
                {assignedProviders.map(p => (
                  <Badge key={p._id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {p.name} ({p.providerType})
                    <button
                      onClick={() => handleUnassign(p._id)}
                      disabled={isLoading}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Assign new provider */}
          {availableProviders.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Assign New Provider</p>
              <div className="flex gap-2">
                <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map(p => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name} - {p.providerType}{p.specialty ? ` (${p.specialty})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedProviderId || isLoading}
                  size="sm"
                >
                  {isLoading ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </div>
          )}

          {availableProviders.length === 0 && assignedProviders.length === providers.length && (
            <p className="text-sm text-muted-foreground">All providers are already assigned.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
