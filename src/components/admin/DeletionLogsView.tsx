import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
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
import { FileText, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { DeletionLog, DeletionStatus } from '@/types/admin-types';
import { cn } from '@/lib/utils';

export const DeletionLogsView = () => {
  const [logs, setLogs] = useState<DeletionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<DeletionLog | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const data = await adminService.getDeletionLogs(pagination.page, pagination.limit, status);
      setLogs(data.deletions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch deletion logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: DeletionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'partial_failure':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partial Failure
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderDetailModal = () => {
    if (!selectedLog) return null;

    return (
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Deletion Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">User</p>
                <p className="font-medium">{selectedLog.userName}</p>
              </div>
              <div>
                <p className="text-zinc-500">Email</p>
                <p className="font-medium">{selectedLog.userEmail}</p>
              </div>
              <div>
                <p className="text-zinc-500">Type</p>
                <p className="font-medium capitalize">{selectedLog.userType}</p>
              </div>
              <div>
                <p className="text-zinc-500">Status</p>
                {getStatusBadge(selectedLog.status)}
              </div>
              <div>
                <p className="text-zinc-500">Requested By</p>
                <p className="font-medium">
                  {selectedLog.requestedBy === 'self' ? 'Self-deletion' : 'Admin'}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Requested At</p>
                <p className="font-medium">{formatDate(selectedLog.requestedAt)}</p>
              </div>
              {selectedLog.completedAt && (
                <div>
                  <p className="text-zinc-500">Completed At</p>
                  <p className="font-medium">{formatDate(selectedLog.completedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-zinc-500">Confirmation ID</p>
                <p className="font-mono text-xs">{selectedLog.confirmationId}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-2">Service Results</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedLog?.deletionResults && Object.entries(selectedLog.deletionResults).map(([service, result]) => (
                  <div
                    key={service}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg text-sm',
                      result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    )}
                  >
                    {result.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span className="capitalize">{service}</span>
                    {result.error && (
                      <span className="text-xs ml-auto truncate max-w-[100px]" title={result.error}>
                        {result.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <div>
                <p className="text-sm text-zinc-500 mb-2">Metadata</p>
                <div className="bg-zinc-50 rounded-lg p-3 text-xs font-mono">
                  {Object.entries(selectedLog.metadata).map(([key, value]) =>
                    value ? (
                      <div key={key}>
                        <span className="text-zinc-500">{key}:</span> {String(value)}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Deletion Logs</h2>
          <p className="text-sm text-zinc-500">History of all user deletions</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="partial_failure">Partial Failure</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No deletion logs found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-xs text-zinc-500">{log.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{log.userType}</TableCell>
                  <TableCell>
                    {log.requestedBy === 'self' ? (
                      <Badge variant="outline">Self</Badge>
                    ) : (
                      <Badge variant="secondary">Admin</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(log.requestedAt)}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-zinc-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {renderDetailModal()}
    </div>
  );
};
