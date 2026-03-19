import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { prescriptionService } from '../services/prescriptionService';

type PrescriptionRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const PrescriptionRequestModal: React.FC<PrescriptionRequestModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [currentWeight, setCurrentWeight] = useState('');
  const [hasSideEffects, setHasSideEffects] = useState(false);
  const [sideEffectsDescription, setSideEffectsDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!currentWeight.trim()) {
      setError(t('prescriptions.requestModal.errorWeight'));
      return;
    }

    const weight = parseFloat(currentWeight);
    if (isNaN(weight) || weight <= 0) {
      setError(t('prescriptions.requestModal.errorWeightInvalid'));
      return;
    }

    if (hasSideEffects && !sideEffectsDescription.trim()) {
      setError(t('prescriptions.requestModal.errorSideEffects'));
      return;
    }

    try {
      setLoading(true);
      await prescriptionService.createPrescriptionRequest({
        currentWeight: weight,
        hasSideEffects,
        sideEffectsDescription: hasSideEffects ? sideEffectsDescription.trim() : undefined,
      });

      // Reset form
      setCurrentWeight('');
      setHasSideEffects(false);
      setSideEffectsDescription('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : t('prescriptions.requestModal.errorSubmit');
      setError(errorMessage || t('prescriptions.requestModal.errorSubmit'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setCurrentWeight('');
    setHasSideEffects(false);
    setSideEffectsDescription('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('prescriptions.requestModal.title')}</DialogTitle>
          <DialogDescription>
            {t('prescriptions.requestModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">{t('prescriptions.requestModal.weightLabel')}</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder={t('prescriptions.requestModal.weightPlaceholder')}
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <Label>{t('prescriptions.requestModal.sideEffectsLabel')}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sideEffects"
                checked={hasSideEffects}
                onCheckedChange={(checked) => setHasSideEffects(checked === true)}
                disabled={loading}
              />
              <Label htmlFor="sideEffects" className="text-sm font-normal">
                {t('prescriptions.requestModal.sideEffectsQuestion')}
              </Label>
            </div>
          </div>

          {hasSideEffects && (
            <div className="space-y-2">
              <Label htmlFor="description">{t('prescriptions.requestModal.sideEffectsDescLabel')}</Label>
              <Textarea
                id="description"
                placeholder={t('prescriptions.requestModal.sideEffectsPlaceholder')}
                value={sideEffectsDescription}
                onChange={(e) => setSideEffectsDescription(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {t('prescriptions.requestModal.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('prescriptions.requestModal.submitting') : t('prescriptions.requestModal.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
