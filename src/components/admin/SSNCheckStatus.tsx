import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

type SSNCheckStatusProps = {
  status: 'idle' | 'checking' | 'available' | 'doctor' | 'patient';
  patientName?: string;
  doctorName?: string;
  onConvert?: () => void;
};

export const SSNCheckStatus = ({
  status,
  patientName,
  doctorName,
  onConvert,
}: SSNCheckStatusProps) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking SSN...</span>
      </div>
    );
  }

  if (status === 'available') {
    return (
      <Alert className="mt-2 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          SSN is available for registration
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'doctor') {
    return (
      <Alert variant="destructive" className="mt-2">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          This SSN is already registered as a doctor{doctorName && `: ${doctorName}`}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'patient') {
    return (
      <Alert className="mt-2 bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="space-y-2">
            <p>
              This SSN is registered as a patient{patientName && `: ${patientName}`}
            </p>
            {onConvert && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onConvert}
                className="mt-2"
              >
                Convert Patient to Doctor
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
