import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Eye, Trash2, CheckCircle, Clock, XCircle, Stethoscope, MailWarning } from 'lucide-react';
import type { Patient, Doctor } from '@/services/adminService';
import { adminService } from '@/services/adminService';
import { SubscriptionDetailsModal } from './SubscriptionDetailsModal';
import { ManageTiersModal } from './ManageTiersModal';

type PatientsViewProps = {
  patients: Patient[];
  doctors: Doctor[];
  onReassign: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
  onRefreshStripeData?: () => void;
  isLoadingStripeData?: boolean;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTimestamp = (timestamp: number | undefined) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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

export const PatientsView = ({
  patients,
  doctors,
  onReassign,
  onDelete,
  onRefreshStripeData,
  isLoadingStripeData = false,
  pagination,
  onPageChange,
  onRefresh,
  statusFilter = 'all',
  onStatusFilterChange,
}: PatientsViewProps) => {
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [approvingPatientId, setApprovingPatientId] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [providerModalPatient, setProviderModalPatient] = useState<Patient | null>(null);
  const [emailDialogPatient, setEmailDialogPatient] = useState<Patient | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailDialogError, setEmailDialogError] = useState<string | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const openEmailDialog = (patient: Patient) => {
    setEmailDialogPatient(patient);
    setEmailRecipient(patient.email || '');
    setEmailDialogError(null);
  };

  const closeEmailDialog = () => {
    setEmailDialogPatient(null);
    setEmailRecipient('');
    setEmailDialogError(null);
  };

  const handleSendPaymentFailedEmail = async () => {
    if (!emailDialogPatient) return;
    const recipient = emailRecipient.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setEmailDialogError('Please enter a valid email address');
      return;
    }
    setIsSendingEmail(true);
    setEmailDialogError(null);
    try {
      const result = await adminService.sendPaymentFailedEmail(emailDialogPatient._id, recipient);
      setEmailFeedback({ type: 'success', message: `Email sent to ${result.sentTo}` });
      closeEmailDialog();
    } catch (err: any) {
      setEmailDialogError(err.response?.data?.error || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient({ id: patient._id, name: patient.name });
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  const handleApproveMeeting = async (patient: Patient) => {
    if (!confirm(`Approve meeting for ${patient.name}? This will allow them to subscribe without a consultation.`)) {
      return;
    }

    setApprovingPatientId(patient._id);
    setApprovalError(null);

    try {
      await adminService.approveMeeting(patient._id);
      // Refresh the patients list to show updated status
      onRefresh?.();
    } catch (err: any) {
      console.error('Error approving meeting:', err);
      setApprovalError(err.response?.data?.error || 'Failed to approve meeting');
    } finally {
      setApprovingPatientId(null);
    }
  };

  const getMeetingStatusBadge = (patient: Patient) => {
    const status = patient.calendly?.meetingStatus || 'none';
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            <XCircle className="w-3 h-3 mr-1" />
            Not Scheduled
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter + Refresh row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {onStatusFilterChange ? (
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by subscription status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="none">No Subscription</SelectItem>
            </SelectContent>
          </Select>
        ) : <div />}

        {onRefreshStripeData && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshStripeData}
            disabled={isLoadingStripeData}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingStripeData ? 'animate-spin' : ''}`} />
            {isLoadingStripeData ? 'Loading Stripe Data...' : 'Refresh from Stripe'}
          </Button>
        )}
      </div>

      {/* Email feedback */}
      {emailFeedback && (
        <div
          className={`px-4 py-3 rounded relative border ${
            emailFeedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {emailFeedback.message}
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setEmailFeedback(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Approval Error Alert */}
      {approvalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {approvalError}
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setApprovalError(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Patient Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Meeting Status</TableHead>
              <TableHead className="whitespace-nowrap">Onboarding</TableHead>
              <TableHead className="whitespace-nowrap">Assigned Doctor</TableHead>
              <TableHead className="whitespace-nowrap">Subscription</TableHead>
              <TableHead className="whitespace-nowrap">Plan Type</TableHead>
              <TableHead className="whitespace-nowrap">Next Billing</TableHead>
              <TableHead className="whitespace-nowrap">Last Login</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMeetingStatusBadge(patient)}
                      {patient.calendly?.meetingStatus !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveMeeting(patient)}
                          disabled={approvingPatientId === patient._id}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 h-7 px-2"
                          title="Approve meeting (allow subscription)"
                        >
                          {approvingPatientId === patient._id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.hasCompletedOnboarding ? (
                      <Badge variant="default">Completed</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.doctor ? (
                      <div>
                        <div className="font-medium">{patient.doctor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.doctor.email}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.subscription?.status ? (
                      <Badge variant={getStatusBadgeVariant(patient.subscription.status)}>
                        {patient.subscription.status}
                      </Badge>
                    ) : (
                      <Badge variant="outline">No subscription</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.subscription?.planType ? (
                      <span className="capitalize">{patient.subscription.planType}</span>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.stripeData?.subscription?.current_period_end ? (
                      formatTimestamp(patient.stripeData.subscription.current_period_end)
                    ) : patient.subscription?.currentPeriodEnd ? (
                      formatDate(patient.subscription.currentPeriodEnd.toString())
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.lastLogin ? formatDate(patient.lastLogin) : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(patient.subscription?.stripeSubscriptionId || patient.subscription?.stripeCustomerId) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(patient)}
                          title="View subscription details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProviderModalPatient(patient)}
                        title="Manage provider tiers"
                      >
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Tiers
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReassign(patient)}
                        disabled={doctors.length === 0}
                      >
                        Reassign
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEmailDialog(patient)}
                        className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                        title="Send 'payment failed' email"
                      >
                        <MailWarning className="h-4 w-4" />
                      </Button>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(patient)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
            {pagination.totalCount} patients
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        patientId={selectedPatient?.id || null}
        patientName={selectedPatient?.name || ''}
        isOpen={!!selectedPatient}
        onClose={handleCloseModal}
      />

      {/* Manage Tiers Modal */}
      {providerModalPatient && (
        <ManageTiersModal
          isOpen={!!providerModalPatient}
          onClose={() => setProviderModalPatient(null)}
          patientId={providerModalPatient._id}
          patientName={providerModalPatient.name}
          patientPlanType={providerModalPatient.subscription?.planType as 'lifestyle' | 'medical' | undefined}
          onSuccess={() => {
            onRefresh?.();
          }}
        />
      )}

      {/* Send Payment Failed Email Dialog */}
      <Dialog open={!!emailDialogPatient} onOpenChange={(open) => !open && closeEmailDialog()}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Send "payment failed" email</DialogTitle>
            <DialogDescription>
              {emailDialogPatient
                ? `To ${emailDialogPatient.name}. The recipient is pre-filled from their account — edit it below if you need to send it elsewhere.`
                : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="payment-failed-email">Recipient email</Label>
            <Input
              id="payment-failed-email"
              type="email"
              value={emailRecipient}
              onChange={(e) => {
                setEmailRecipient(e.target.value);
                if (emailDialogError) setEmailDialogError(null);
              }}
              placeholder="patient@example.com"
              disabled={isSendingEmail}
            />
            {emailDialogPatient?.email && emailRecipient.trim() !== emailDialogPatient.email && (
              <p className="text-xs text-amber-700">
                Differs from the email on file ({emailDialogPatient.email}).
              </p>
            )}
            {emailDialogError && (
              <p className="text-sm text-red-600">{emailDialogError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEmailDialog} disabled={isSendingEmail}>
              Cancel
            </Button>
            <Button onClick={handleSendPaymentFailedEmail} disabled={isSendingEmail}>
              {isSendingEmail ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
