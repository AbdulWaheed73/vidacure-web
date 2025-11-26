import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

type PatientConversionConfirmDialogProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  patientName: string;
  isLoading?: boolean;
};

export const PatientConversionConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  patientName,
  isLoading = false,
}: PatientConversionConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <AlertDialogTitle>Convert Patient to Doctor?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p className="font-semibold text-foreground">
              Patient: {patientName}
            </p>
            <p>
              This will <span className="font-semibold text-destructive">permanently DELETE</span> the patient record and create a new doctor account with the same SSN.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-1 text-sm">
              <p className="font-semibold text-destructive">Warning: This action cannot be undone!</p>
              <p className="text-muted-foreground">The following data will be lost:</p>
              <ul className="list-disc list-inside text-muted-foreground pl-2">
                <li>Patient's medical records</li>
                <li>Subscription information</li>
                <li>Doctor assignments</li>
                <li>Chat history</li>
              </ul>
            </div>
            <p className="text-sm">
              Are you absolutely sure you want to proceed?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Converting...' : 'Yes, Convert to Doctor'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
