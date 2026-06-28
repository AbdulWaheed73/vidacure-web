import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { useEmailLog } from '@/hooks/useEmailSendQueries';
import type { EmailSendLog, EmailSendSource } from '@/types/email-send-log-types';

const SOURCE_LABEL: Record<EmailSendSource, string> = {
  drip: 'Automated',
  manual_template: 'Manual · template',
  manual_custom: 'Manual · custom',
};

const SOURCE_VARIANT: Record<EmailSendSource, 'default' | 'secondary' | 'outline'> = {
  drip: 'secondary',
  manual_template: 'default',
  manual_custom: 'outline',
};

const formatDateTime = (s: string) =>
  new Date(s).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const patientName = (log: EmailSendLog): string => {
  if (typeof log.patientId === 'object' && log.patientId) return log.patientId.name || log.patientEmail;
  return log.patientEmail;
};

type EmailLogViewProps = {
  // When provided, scopes the log to a single patient (per-patient history) and hides the source filter.
  patientId?: string;
};

export const EmailLogView = ({ patientId }: EmailLogViewProps) => {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState<EmailSendSource | 'all'>('all');

  const { data, isLoading, error } = useEmailLog({
    page,
    limit: 50,
    ...(patientId ? { patientId } : {}),
    ...(source !== 'all' ? { source } : {}),
  });

  const logs = data?.logs ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      {!patientId && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-dark-teal mr-auto">Email Log</h2>
          {(['all', 'drip', 'manual_template', 'manual_custom'] as const).map((s) => (
            <Button
              key={s}
              variant={source === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSource(s); setPage(1); }}
            >
              {s === 'all' ? 'All' : SOURCE_LABEL[s]}
            </Button>
          ))}
        </div>
      )}

      {isLoading && <div className="flex justify-center py-8"><LoadingSpinner /></div>}
      {error && <Alert variant="destructive" title="Error">Failed to load the email log.</Alert>}

      {!isLoading && !error && (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Sent</TableHead>
                {!patientId && <TableHead>Patient</TableHead>}
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Consent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={patientId ? 6 : 7} className="text-center text-muted-foreground py-8">
                    No emails sent yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="whitespace-nowrap text-sm">{formatDateTime(log.sentAt)}</TableCell>
                    {!patientId && <TableCell className="font-medium">{patientName(log)}</TableCell>}
                    <TableCell>{log.subject}</TableCell>
                    <TableCell><Badge variant={SOURCE_VARIANT[log.source]}>{SOURCE_LABEL[log.source]}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{log.templateTitle ?? '—'}</TableCell>
                    <TableCell>
                      {log.consentGranted
                        ? <Badge variant="secondary">Yes</Badge>
                        : <Badge variant="outline" className="text-amber-700 border-amber-300">No</Badge>}
                    </TableCell>
                    <TableCell>
                      {log.status === 'sent'
                        ? <Badge variant="default">Sent</Badge>
                        : <Badge variant="destructive" title={log.error}>Failed</Badge>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            {pagination.totalCount} emails
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span className="text-sm">Page {pagination.page} of {pagination.totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};
