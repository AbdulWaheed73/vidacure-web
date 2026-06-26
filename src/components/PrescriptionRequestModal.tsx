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
import { Plus, Trash2 } from 'lucide-react';
import { prescriptionService } from '../services/prescriptionService';
import type { CurrentMedication } from '../types/prescription-types';

type MedicationRow = { name: string; dosage: string };

const emptyMedicationRow = (): MedicationRow => ({ name: '', dosage: '' });

type PrescriptionRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  isPastDue?: boolean;
  onRenew?: () => void;
};

export const PrescriptionRequestModal: React.FC<PrescriptionRequestModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  isPastDue = false,
  onRenew,
}) => {
  const { t } = useTranslation();
  const [currentWeight, setCurrentWeight] = useState('');
  const [hasSideEffects, setHasSideEffects] = useState(false);
  const [sideEffectsDescription, setSideEffectsDescription] = useState('');
  const [medications, setMedications] = useState<MedicationRow[]>([emptyMedicationRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateMedication = (index: number, field: keyof MedicationRow, value: string) => {
    setMedications((prev) => prev.map((med, i) => (i === index ? { ...med, [field]: value } : med)));
  };

  const addMedicationRow = () => {
    setMedications((prev) => [...prev, emptyMedicationRow()]);
  };

  const removeMedicationRow = (index: number) => {
    setMedications((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

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

    // Keep only rows where the patient typed a medication name; dosage is optional.
    const currentMedications: CurrentMedication[] = medications
      .map((med) => ({ name: med.name.trim(), dosage: med.dosage.trim() }))
      .filter((med) => med.name.length > 0)
      .map((med) => ({ name: med.name, dosage: med.dosage || undefined }));

    try {
      setLoading(true);
      await prescriptionService.createPrescriptionRequest({
        currentWeight: weight,
        hasSideEffects,
        sideEffectsDescription: hasSideEffects ? sideEffectsDescription.trim() : undefined,
        currentMedications: currentMedications.length > 0 ? currentMedications : undefined,
      });

      // Reset form
      setCurrentWeight('');
      setHasSideEffects(false);
      setSideEffectsDescription('');
      setMedications([emptyMedicationRow()]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const responseError = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : undefined;
      if (responseError === 'subscription_past_due') {
        setError(t('prescriptions.pastDueMessage'));
      } else {
        setError(responseError || t('prescriptions.requestModal.errorSubmit'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setCurrentWeight('');
    setHasSideEffects(false);
    setSideEffectsDescription('');
    setMedications([emptyMedicationRow()]);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-sora text-[#005044]">{t('prescriptions.requestModal.title')}</DialogTitle>
          <DialogDescription className="font-manrope text-gray-500">
            {t('prescriptions.requestModal.description')}
          </DialogDescription>
        </DialogHeader>

        {isPastDue ? (
          <div className="space-y-5">
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl font-manrope">
              {t('prescriptions.pastDueMessage')}
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-full font-sora font-semibold border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {t('prescriptions.requestModal.cancel')}
              </Button>
              <Button
                type="button"
                onClick={onRenew}
                className="rounded-full font-sora font-semibold bg-amber-500 hover:bg-amber-600 text-white"
              >
                {t('prescriptions.renewSubscription')}
              </Button>
            </DialogFooter>
          </div>
        ) : (
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
            <div>
              <Label className="text-sm font-medium font-manrope text-[#005044]">
                {t('prescriptions.requestModal.currentMedsLabel')}
              </Label>
              <p className="text-xs text-gray-500 font-manrope mt-1">
                {t('prescriptions.requestModal.currentMedsHelp')}
              </p>
            </div>

            <div className="space-y-3">
              {medications.map((med, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                    <Input
                      type="text"
                      placeholder={t('prescriptions.requestModal.medNamePlaceholder')}
                      value={med.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      disabled={loading}
                      className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <Input
                      type="text"
                      placeholder={t('prescriptions.requestModal.medDosagePlaceholder')}
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      disabled={loading}
                      className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicationRow(index)}
                      disabled={loading}
                      aria-label={t('prescriptions.requestModal.removeMed')}
                      className="mt-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMedicationRow}
              disabled={loading}
              className="flex items-center gap-1.5 text-sm font-semibold font-manrope text-teal-600 hover:text-teal-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {t('prescriptions.requestModal.addAnotherMed')}
            </button>
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
        )}
      </DialogContent>
    </Dialog>
  );
};
