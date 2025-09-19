import React, { useState } from 'react';
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
      setError('Please enter your current weight');
      return;
    }

    const weight = parseFloat(currentWeight);
    if (isNaN(weight) || weight <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    if (hasSideEffects && !sideEffectsDescription.trim()) {
      setError('Please describe the side effects you are experiencing');
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
        : 'Failed to submit prescription request. Please try again.';
      setError(errorMessage || 'Failed to submit prescription request. Please try again.');
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
          <DialogTitle>Request Prescription</DialogTitle>
          <DialogDescription>
            Please provide your current information to request a prescription.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">Current Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter your current weight"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <Label>Side Effects</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sideEffects"
                checked={hasSideEffects}
                onCheckedChange={(checked) => setHasSideEffects(checked === true)}
                disabled={loading}
              />
              <Label htmlFor="sideEffects" className="text-sm font-normal">
                Are you experiencing any side effects?
              </Label>
            </div>
          </div>

          {hasSideEffects && (
            <div className="space-y-2">
              <Label htmlFor="description">Side Effects Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe the side effects you are experiencing..."
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
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};