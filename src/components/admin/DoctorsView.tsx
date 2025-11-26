import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import type { Doctor, Patient } from '@/services/adminService';
import { AddDoctorDialog } from './AddDoctorDialog';

type DoctorsViewProps = {
  doctors: Doctor[];
  onReassign: (patient: Patient) => void;
  onRefresh: () => void;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'trialing':
      return 'secondary';
    case 'past_due':
      return 'destructive';
    case 'canceled':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const DoctorsView = ({ doctors, onReassign, onRefresh }: DoctorsViewProps) => {
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Add Doctor Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors ({doctors.length})</h2>
        <Button onClick={() => setIsAddDoctorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {doctors.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">No doctors found. Click "Add Doctor" to add one.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {doctors.map((doctor) => (
        <Card key={doctor._id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{doctor.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                  {doctor.patientCount} Patients
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {doctor.channelCount} Channels
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="patients">
                <AccordionTrigger>
                  View Assigned Patients ({doctor.patientCount})
                </AccordionTrigger>
                <AccordionContent>
                  {doctor.patients && doctor.patients.length > 0 ? (
                    <div className="space-y-2">
                      {doctor.patients.map((patient) => (
                        <div
                          key={patient._id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {patient.email || 'No email'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              {patient.subscription?.status ? (
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    patient.subscription.status
                                  )}
                                >
                                  {patient.subscription.status}
                                </Badge>
                              ) : (
                                <Badge variant="outline">No subscription</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {patient.lastLogin
                                ? `Last: ${formatDate(patient.lastLogin)}`
                                : 'Never logged in'}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onReassign(patient)}
                            >
                              Reassign
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">
                      No patients assigned to this doctor.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 text-sm text-muted-foreground">
              <div>Last login: {doctor.lastLogin ? formatDate(doctor.lastLogin) : 'Never'}</div>
              <div>Joined: {formatDate(doctor.createdAt)}</div>
            </div>
          </CardContent>
        </Card>
          ))}
        </>
      )}

      {/* Add Doctor Dialog */}
      <AddDoctorDialog
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
};
