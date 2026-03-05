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
import { adminService } from '@/services/adminService';

const createPromotionSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be at most 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be alphanumeric (auto-uppercased)'),
  name: z.string().min(1, 'Name is required'),
  discountType: z.enum(['percent', 'fixed']),
  percentOff: z.coerce.number().optional(),
  amountOff: z.coerce.number().optional(),
  duration: z.enum(['once', 'repeating', 'forever']),
  durationInMonths: z.coerce.number().optional(),
  maxRedemptions: z.coerce.number().optional(),
  expiresAt: z.string().optional(),
  appliesTo: z.enum(['all', 'subscriptions', 'lab_tests']),
}).refine(
  (data) => {
    if (data.discountType === 'percent') return data.percentOff && data.percentOff >= 1 && data.percentOff <= 100;
    return data.amountOff && data.amountOff >= 1;
  },
  { message: 'Please enter a valid discount value', path: ['percentOff'] }
).refine(
  (data) => {
    if (data.duration === 'repeating') return data.durationInMonths && data.durationInMonths >= 1;
    return true;
  },
  { message: 'Duration in months is required for repeating', path: ['durationInMonths'] }
);

type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

type CreatePromotionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const CreatePromotionDialog = ({ isOpen, onClose, onSuccess }: CreatePromotionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<CreatePromotionFormValues>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      code: '',
      name: '',
      discountType: 'percent',
      percentOff: undefined,
      amountOff: undefined,
      duration: 'once',
      durationInMonths: undefined,
      maxRedemptions: undefined,
      expiresAt: '',
      appliesTo: 'all',
    },
  });

  const discountType = form.watch('discountType');
  const duration = form.watch('duration');

  const onSubmit = async (data: CreatePromotionFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await adminService.createPromotion({
        code: data.code,
        name: data.name,
        discountType: data.discountType,
        percentOff: data.discountType === 'percent' ? data.percentOff : undefined,
        amountOff: data.discountType === 'fixed' ? data.amountOff : undefined,
        duration: data.duration,
        durationInMonths: data.duration === 'repeating' ? data.durationInMonths : undefined,
        maxRedemptions: data.maxRedemptions || undefined,
        expiresAt: data.expiresAt || undefined,
        appliesTo: data.appliesTo,
      });

      setSuccessMessage('Promotion code created successfully.');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to create promotion');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Promotion Code</DialogTitle>
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

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promo Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. SUMMER20"
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    />
                  </FormControl>
                  <FormDescription>3-20 alphanumeric characters, auto-uppercased</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Summer 2026 Campaign" disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>Internal description (not shown to patients)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appliesTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applies To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All (Subscriptions & Lab Tests)</SelectItem>
                      <SelectItem value="subscriptions">Subscriptions Only</SelectItem>
                      <SelectItem value="lab_tests">Lab Tests Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === 'subscriptions'
                      ? 'Stripe will enforce this — code won\'t work on lab test checkout'
                      : field.value === 'lab_tests'
                        ? 'Code will be labeled for lab tests (soft restriction)'
                        : 'Code works on both subscription and lab test checkouts'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percent">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (SEK)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {discountType === 'percent' ? (
              <FormField
                control={form.control}
                name="percentOff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage Off</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} max={100} placeholder="20" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="amountOff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Off (SEK)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} placeholder="100" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="once">Once (single billing cycle)</SelectItem>
                      <SelectItem value="repeating">Repeating (N months)</SelectItem>
                      <SelectItem value="forever">Forever (all future invoices)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {duration === 'repeating' && (
              <FormField
                control={form.control}
                name="durationInMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration in Months</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} placeholder="3" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="maxRedemptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Redemptions (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} placeholder="Unlimited" disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>Leave empty for unlimited</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>Leave empty for no expiry</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Promotion'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
