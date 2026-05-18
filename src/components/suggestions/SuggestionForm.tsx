import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { useSubmitSuggestion } from '@/hooks/useSuggestionQueries';
import type { SuggestionSubmitterRole } from '@/types/suggestion-types';

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 2000;

type SuggestionFormProps = {
  role: SuggestionSubmitterRole;
};

export const SuggestionForm = ({ role }: SuggestionFormProps) => {
  const { t } = useTranslation();
  const mutation = useSubmitSuggestion(role);

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t('suggestions.titleRequired'))
      .max(TITLE_MAX, t('suggestions.titleTooLong')),
    description: z
      .string()
      .trim()
      .min(1, t('suggestions.descriptionRequired'))
      .max(DESCRIPTION_MAX, t('suggestions.descriptionTooLong')),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success(t('suggestions.submitSuccess'));
        form.reset();
      },
      onError: () => {
        toast.error(t('suggestions.submitError'));
      },
    });
  };

  return (
    <Card className="p-6 md:p-8 max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-manrope">
                  {t('suggestions.titleLabel')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('suggestions.titlePlaceholder')}
                    maxLength={TITLE_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-manrope">
                  {t('suggestions.descriptionLabel')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('suggestions.descriptionPlaceholder')}
                    rows={6}
                    maxLength={DESCRIPTION_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-[#005044] hover:bg-[#003d34] text-white"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('suggestions.submitting')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('suggestions.submit')}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
