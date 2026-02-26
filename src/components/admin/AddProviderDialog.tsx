import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { adminService } from '@/services/adminService';

const addProviderFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  providerType: z.string().min(1, 'Provider type is required'),
  specialty: z.string().optional(),
  bio: z.string().optional(),
});

type AddProviderFormValues = z.infer<typeof addProviderFormSchema>;

type CalendlyLookupResult = {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    schedulingUrl: string;
    timezone: string;
    uri: string;
  };
  eventTypes: {
    uri: string;
    name: string;
    slug?: string;
    duration?: number;
    schedulingUrl: string;
    active: boolean;
  }[];
};

type AddProviderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const AddProviderDialog = ({ isOpen, onClose, onSuccess }: AddProviderDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<CalendlyLookupResult | null>(null);
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'found' | 'not_found'>('idle');
  const [freeEventName, setFreeEventName] = useState('');
  const [premiumEventName, setPremiumEventName] = useState('');

  const form = useForm<AddProviderFormValues>({
    resolver: zodResolver(addProviderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      providerType: '',
      specialty: '',
      bio: '',
    },
  });

  const handleCalendlyLookup = async () => {
    const email = form.getValues('email');
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError('email', { message: 'Enter a valid email to lookup' });
      return;
    }

    setIsLookingUp(true);
    setError(null);
    setLookupResult(null);
    setLookupStatus('idle');

    try {
      const result = await adminService.calendlyLookup(email);
      setLookupResult(result);
      setLookupStatus('found');

      // Auto-populate name from Calendly
      form.setValue('name', result.user.name, { shouldValidate: true });
    } catch (err: any) {
      if (err.response?.status === 404) {
        setLookupStatus('not_found');
      } else {
        setError(err.response?.data?.error || 'Failed to lookup Calendly user');
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const onSubmit = async (data: AddProviderFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Include Calendly event type names mapped by admin
      const payload: any = { ...data };
      if (freeEventName || premiumEventName) {
        payload.eventTypes = {
          free: freeEventName,
          premium: premiumEventName,
        };
      }
      await adminService.addProvider(payload);
      setSuccessMessage('Provider added successfully.');

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding provider:', err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to add provider');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(false);
    setLookupResult(null);
    setLookupStatus('idle');
    setFreeEventName('');
    setPremiumEventName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Provider</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" title="Error">
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <div className="text-green-800">{successMessage}</div>
              </Alert>
            )}

            {/* Email with Calendly Lookup */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calendly Email</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="provider@example.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCalendlyLookup}
                      disabled={isLookingUp || isSubmitting}
                      className="shrink-0"
                    >
                      {isLookingUp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-1">Lookup</span>
                    </Button>
                  </div>
                  <FormDescription>
                    Enter the email registered in your Calendly organization, then click Lookup to auto-fill details.
                  </FormDescription>
                  <FormMessage />

                  {/* Lookup Status */}
                  {lookupStatus === 'found' && (
                    <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Found: <strong>{lookupResult?.user.name}</strong></span>
                    </div>
                  )}
                  {lookupStatus === 'not_found' && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
                      <XCircle className="h-4 w-4" />
                      <span>No Calendly user found. Make sure this email is in your Calendly organization.</span>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Event Type Mapping from Calendly */}
            {lookupResult && lookupResult.eventTypes.length > 0 && (
              <div className="rounded-md border p-3 bg-muted/50 space-y-3">
                <p className="text-sm font-medium">Map Calendly Event Types to Tiers</p>
                <p className="text-xs text-muted-foreground">
                  Select which Calendly event patients see for each tier.
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium">Free Tier Event</label>
                    <Select value={freeEventName} onValueChange={setFreeEventName}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select event for free tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupResult.eventTypes.map((et) => (
                          <SelectItem key={et.uri} value={et.name}>
                            {et.name} {et.duration ? `(${et.duration}min)` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Premium Tier Event (Medical plan)</label>
                    <Select value={premiumEventName} onValueChange={setPremiumEventName}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select event for premium tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupResult.eventTypes.map((et) => (
                          <SelectItem key={et.uri} value={et.name}>
                            {et.name} {et.duration ? `(${et.duration}min)` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Need to create new event types?{' '}
                  <a
                    href="https://calendly.com/event_types/user/me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open Calendly
                  </a>{' '}
                  — event types can only be created in the Calendly dashboard.
                </p>
              </div>
            )}

            {/* Name (auto-populated from Calendly) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Dr. Jane Smith" disabled={isSubmitting} />
                  </FormControl>
                  {lookupStatus === 'found' && (
                    <FormDescription className="text-green-600">
                      Auto-filled from Calendly
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="providerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="physician">Physician</SelectItem>
                      <SelectItem value="hypnotherapist">Hypnotherapist</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Endocrinology" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Short description of the provider" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Provider'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
