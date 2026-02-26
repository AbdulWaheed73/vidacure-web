import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { Star, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/textarea';
import { PaymentService } from '../../services';
import type { CancellationReason } from '../../types/payment-types';

type CancelSubscriptionDialogProps = {
  onCancelled?: () => void;
};

const REASONS: { key: CancellationReason; labelKey: string }[] = [
  { key: 'too_expensive', labelKey: 'cancelFlow.reasonExpensive' },
  { key: 'no_results', labelKey: 'cancelFlow.reasonNoResults' },
  { key: 'reached_goal', labelKey: 'cancelFlow.reasonGoalReached' },
  { key: 'technical_issues', labelKey: 'cancelFlow.reasonTechnical' },
];

export const CancelSubscriptionDialog = ({ onCancelled }: CancelSubscriptionDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'reason' | 'success'>('reason');
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [periodEndDate, setPeriodEndDate] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const cancelMutation = useMutation({
    mutationFn: (reason: CancellationReason) => PaymentService.cancelSubscription(reason),
    onSuccess: (data) => {
      if (data.currentPeriodEnd) {
        setPeriodEndDate(new Date(data.currentPeriodEnd).toLocaleDateString('sv-SE'));
      }
      setStep('success');
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: (data: { rating: number; comments?: string }) =>
      PaymentService.submitCancellationFeedback(data),
    onSuccess: () => {
      handleClose();
    },
  });

  const handleClose = () => {
    setOpen(false);
    // Reset state after animation
    setTimeout(() => {
      setStep('reason');
      setSelectedReason(null);
      setPeriodEndDate(null);
      setRating(0);
      setComments('');
      cancelMutation.reset();
      feedbackMutation.reset();
    }, 200);
    onCancelled?.();
  };

  const handleCancel = () => {
    if (!selectedReason) return;
    cancelMutation.mutate(selectedReason);
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) return;
    feedbackMutation.mutate({ rating, comments: comments.trim() || undefined });
  };

  const handleSkip = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value && step === 'reason') {
        handleClose();
      } else {
        setOpen(value);
      }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-manrope text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          {t('account.billing.cancelSubscription')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        if (cancelMutation.isPending || feedbackMutation.isPending) {
          e.preventDefault();
        }
      }}>
        {step === 'reason' && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="text-5xl mb-2">😢</div>
              <DialogTitle className="text-xl font-bold font-manrope">
                {t('cancelFlow.title')}
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-manrope">
                {t('cancelFlow.subtitle')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 my-2">
              {REASONS.map(({ key, labelKey }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedReason(key)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors font-manrope text-sm ${
                    selectedReason === key
                      ? 'border-[#005044] bg-[#f0f7f4] text-[#005044]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedReason === key
                          ? 'border-[#005044]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedReason === key && (
                        <div className="w-2 h-2 rounded-full bg-[#005044]" />
                      )}
                    </div>
                    {t(labelKey)}
                  </div>
                </button>
              ))}
            </div>

            {cancelMutation.isError && (
              <p className="text-red-500 text-sm text-center font-manrope">
                {t('account.billing.fetchError', 'Failed to cancel subscription. Please try again.')}
              </p>
            )}

            <DialogFooter className="flex flex-row gap-2 sm:justify-between">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={cancelMutation.isPending}
                className="font-manrope flex-1"
              >
                {t('cancelFlow.neverMind')}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={!selectedReason || cancelMutation.isPending}
                className="font-manrope flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {cancelMutation.isPending
                  ? t('cancelFlow.cancelling')
                  : t('cancelFlow.cancelSubscription')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="relative mx-auto mb-2">
                <CheckCircle className="w-16 h-16 text-emerald-500" />
                <div className="absolute -top-2 -right-3 text-lg">✨</div>
                <div className="absolute -bottom-1 -left-3 text-lg">✨</div>
              </div>
              <DialogTitle className="text-xl font-bold font-manrope">
                {t('cancelFlow.successTitle')}
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-manrope">
                {t('cancelFlow.successSubtitle')}
              </DialogDescription>
            </DialogHeader>

            {periodEndDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-blue-800 text-sm font-manrope">
                  {t('cancelFlow.accessUntil', { date: periodEndDate })}
                </p>
              </div>
            )}

            <div className="bg-[#f0f7f4] rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 font-manrope">
                {t('cancelFlow.shareFeedback')}
              </p>

              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t('cancelFlow.tellMore')}
                className="bg-white resize-none font-manrope"
                rows={3}
              />
            </div>

            {feedbackMutation.isError && (
              <p className="text-red-500 text-sm text-center font-manrope">
                Failed to submit feedback. Please try again.
              </p>
            )}

            <DialogFooter className="flex flex-row gap-2 sm:justify-between">
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={feedbackMutation.isPending}
                className="font-manrope flex-1"
              >
                {t('cancelFlow.skip')}
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={rating === 0 || feedbackMutation.isPending}
                className="font-manrope flex-1 bg-[#005044] hover:bg-[#003d33] text-white"
              >
                {feedbackMutation.isPending
                  ? t('cancelFlow.submitting')
                  : t('cancelFlow.submitFeedback')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
