import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Provider } from '@/types/provider-types';
import { AddProviderDialog } from './AddProviderDialog';

type ProvidersViewProps = {
  onRefresh: () => void;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getProviderTypeLabel = (type: string) => {
  switch (type) {
    case 'physician': return 'Physician';
    case 'hypnotherapist': return 'Hypnotherapist';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const ProvidersView = ({ onRefresh }: ProvidersViewProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProviders();
      setProviders(data.providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleDeactivate = async (providerId: string, providerName: string) => {
    if (!confirm(`Deactivate provider "${providerName}"? Existing scheduled meetings will remain, but no new bookings can be made.`)) {
      return;
    }
    try {
      await adminService.deactivateProvider(providerId);
      fetchProviders();
      onRefresh();
    } catch (error) {
      console.error('Error deactivating provider:', error);
    }
  };

  const handleReactivate = async (providerId: string, providerName: string) => {
    if (!confirm(`Reactivate provider "${providerName}"? They will become visible to all patients.`)) {
      return;
    }
    try {
      await adminService.updateProvider(providerId, { isActive: true });
      fetchProviders();
      onRefresh();
    } catch (error) {
      console.error('Error reactivating provider:', error);
    }
  };

  const handleSuccess = () => {
    fetchProviders();
    onRefresh();
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading providers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Providers ({providers.length})</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {providers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">No providers found. Click "Add Provider" to add one.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {providers.map((provider) => (
            <Card key={provider._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{provider.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{provider.email}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">
                      {getProviderTypeLabel(provider.providerType)}
                    </Badge>
                    {provider.specialty && (
                      <Badge variant="outline">{provider.specialty}</Badge>
                    )}
                    {!provider.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                    {provider.isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeactivate(provider._id, provider.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Deactivate provider"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReactivate(provider._id, provider.name)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Reactivate provider"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {provider.bio && (
                  <p className="text-sm text-muted-foreground mb-3">{provider.bio}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  <div>Joined: {formatDate(provider.createdAt)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <AddProviderDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
