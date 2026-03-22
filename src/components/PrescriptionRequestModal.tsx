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
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-sora text-[#005044]">{t('prescriptions.requestModal.title')}</DialogTitle>
          <DialogDescription className="font-manrope text-gray-500">
            {t('prescriptions.requestModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl font-manrope">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium font-manrope text-[#005044]">
              {t('prescriptions.requestModal.weightLabel')}
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder={t('prescriptions.requestModal.weightPlaceholder')}
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              disabled={loading}
              className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium font-manrope text-[#005044]">
              {t('prescriptions.requestModal.sideEffectsLabel')}
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sideEffects"
                checked={hasSideEffects}
                onCheckedChange={(checked) => setHasSideEffects(checked === true)}
                disabled={loading}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
              <Label htmlFor="sideEffects" className="text-sm font-normal font-manrope text-gray-600">
                {t('prescriptions.requestModal.sideEffectsQuestion')}
              </Label>
            </div>
          </div>

          {hasSideEffects && (
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium font-manrope text-[#005044]">
                {t('prescriptions.requestModal.sideEffectsDescLabel')}
              </Label>
              <Textarea
                id="description"
                placeholder={t('prescriptions.requestModal.sideEffectsPlaceholder')}
                value={sideEffectsDescription}
                onChange={(e) => setSideEffectsDescription(e.target.value)}
                disabled={loading}
                rows={4}
                className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="rounded-full font-sora font-semibold border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              {t('prescriptions.requestModal.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full font-sora font-semibold bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? t('prescriptions.requestModal.submitting') : t('prescriptions.requestModal.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
