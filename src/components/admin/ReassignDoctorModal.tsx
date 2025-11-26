import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import type { Doctor, Patient } from '@/services/adminService';

type ReassignDoctorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  doctors: Doctor[];
  onReassign: (patientId: string, newDoctorId: string) => Promise<void>;
  isLoading?: boolean;
};

export const ReassignDoctorModal = ({
  isOpen,
  onClose,
  patient,
  doctors,
  onReassign,
  isLoading = false,
}: ReassignDoctorModalProps) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  const handleReassign = async () => {
    if (!patient || !selectedDoctorId) return;

    try {
      await onReassign(patient._id, selectedDoctorId);
      setSelectedDoctorId('');
      onClose();
    } catch (error) {
      console.error('Error reassigning doctor:', error);
    }
  };

  // Filter out the current doctor from the list
  const availableDoctors = doctors.filter(
    (doctor) => doctor._id !== patient?.doctor?._id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Doctor</DialogTitle>
          <DialogDescription>
            {patient && (
              <>
                Reassign <strong>{patient.name}</strong> to a new doctor.
                {patient.doctor && (
                  <>
                    {' '}
                    Currently assigned to: <strong>{patient.doctor.name}</strong>
                  </>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="doctor-select" className="text-sm font-medium">
              Select New Doctor
            </label>
            <Select
              value={selectedDoctorId}
              onValueChange={setSelectedDoctorId}
              disabled={isLoading}
            >
              <SelectTrigger id="doctor-select">
                <SelectValue placeholder="Choose a doctor..." />
              </SelectTrigger>
              <SelectContent>
                {availableDoctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name} ({doctor.patientCount} patients)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReassign}
            disabled={!selectedDoctorId || isLoading}
          >
            {isLoading ? 'Reassigning...' : 'Reassign Doctor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
