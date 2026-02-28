import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Clock,
  Users,
  Search,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { AuditLog, AuditAnomaliesResponse } from '@/types/admin-types';
import { cn } from '@/lib/utils';

export const AuditLogsView = () => {
  // Logs state
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    totalCount: 0,
    totalPages: 0,
  });

  // Filters
  const [actionFilter, setActionFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [successFilter, setSuccessFilter] = useState('all');
  const [searchUserId, setSearchUserId] = useState('');

  // Anomalies
  const [anomalies, setAnomalies] = useState<AuditAnomaliesResponse | null>(null);
  const [anomaliesLoading, setAnomaliesLoading] = useState(false);
  const [showAnomalies, setShowAnomalies] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (actionFilter !== 'all') params.action = actionFilter;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (successFilter !== 'all') params.success = successFilter;
      if (searchUserId.trim()) params.userId = searchUserId.trim();

      const data = await adminService.getAuditLogs(params);
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, actionFilter, roleFilter, successFilter, searchUserId]);

  const fetchAnomalies = async () => {
    try {
      setAnomaliesLoading(true);
      const data = await adminService.getAuditAnomalies();
      setAnomalies(data);
      setShowAnomalies(true);
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
    } finally {
      setAnomaliesLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getOperationBadge = (operation: string) => {
    const styles: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-700 border-green-200',
      READ: 'bg-blue-100 text-blue-700 border-blue-200',
      UPDATE: 'bg-amber-100 text-amber-700 border-amber-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <Badge className={styles[operation] || 'bg-zinc-100 text-zinc-700'}>
        {operation}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      patient: 'bg-teal-100 text-teal-700 border-teal-200',
      doctor: 'bg-purple-100 text-purple-700 border-purple-200',
      admin: 'bg-orange-100 text-orange-700 border-orange-200',
      superadmin: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <Badge className={styles[role] || 'bg-zinc-100 text-zinc-700'}>
        {role}
      </Badge>
    );
  };

  const totalAnomalies = anomalies
    ? anomalies.anomalies.highVolumeAccessors.length +
      anomalies.anomalies.failedAccessClusters.length +
      anomalies.anomalies.afterHoursAccess.length
    : 0;

  const resetFilters = () => {
    setActionFilter('all');
    setRoleFilter('all');
    setSuccessFilter('all');
    setSearchUserId('');
    setPagination(p => ({ ...p, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-manrope">Audit Logs</h2>
          <p className="text-sm text-zinc-500">
            PDL-compliant systematic log review — track all access to patient data
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnomalies}
            disabled={anomaliesLoading}
          >
            {anomaliesLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-2" />
            )}
            Anomaly Scan
          </Button>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Anomaly Alert Cards */}
      {showAnomalies && anomalies && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold font-manrope flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              Anomaly Detection — Last 7 Days
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAnomalies(false)}>
              Dismiss
            </Button>
          </div>

          {totalAnomalies === 0 ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-center gap-3 py-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-700 font-medium">No anomalies detected. All access patterns appear normal.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {/* High Volume Accessors */}
              <Card className={cn(
                'border',
                anomalies.anomalies.highVolumeAccessors.length > 0
                  ? 'border-red-200 bg-red-50'
                  : 'border-green-200 bg-green-50'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    High-Volume Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {anomalies.anomalies.highVolumeAccessors.length === 0 ? (
                    <p className="text-sm text-green-700">None detected</p>
                  ) : (
                    <div className="space-y-2">
                      {anomalies.anomalies.highVolumeAccessors.map((a, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-mono text-xs text-red-800 truncate" title={a.userId}>
                            {a.userId}
                          </p>
                          <p className="text-red-600">
                            {a.uniqueTargetCount} unique patients, {a.totalAccess} total accesses
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Failed Access Clusters */}
              <Card className={cn(
                'border',
                anomalies.anomalies.failedAccessClusters.length > 0
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-green-200 bg-green-50'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Failed Access Clusters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {anomalies.anomalies.failedAccessClusters.length === 0 ? (
                    <p className="text-sm text-green-700">None detected</p>
                  ) : (
                    <div className="space-y-2">
                      {anomalies.anomalies.failedAccessClusters.map((c, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-mono text-xs text-amber-800 truncate" title={c._id.userId}>
                            {c._id.userId}
                          </p>
                          <p className="text-amber-600">
                            {c.count} failed "{c._id.action}" attempts
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* After Hours Access */}
              <Card className={cn(
                'border',
                anomalies.anomalies.afterHoursAccess.length > 0
                  ? 'border-purple-200 bg-purple-50'
                  : 'border-green-200 bg-green-50'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    After-Hours Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {anomalies.anomalies.afterHoursAccess.length === 0 ? (
                    <p className="text-sm text-green-700">None detected</p>
                  ) : (
                    <div className="space-y-2">
                      {anomalies.anomalies.afterHoursAccess.map((a, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-mono text-xs text-purple-800 truncate" title={a._id}>
                            {a._id}
                          </p>
                          <p className="text-purple-600">
                            {a.afterHoursCount} accesses outside 07:00–19:00 CET
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by User ID..."
            value={searchUserId}
            onChange={(e) => {
              setSearchUserId(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="h-9 w-52 rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPagination(p => ({ ...p, page: 1 })); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={successFilter} onValueChange={(v) => { setSuccessFilter(v); setPagination(p => ({ ...p, page: 1 })); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Results</SelectItem>
            <SelectItem value="true">Success</SelectItem>
            <SelectItem value="false">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPagination(p => ({ ...p, page: 1 })); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="admin_">Admin Actions</SelectItem>
            <SelectItem value="consent">Consent Actions</SelectItem>
            <SelectItem value="delete">Deletion Actions</SelectItem>
            <SelectItem value="get_patient">Patient Data Access</SelectItem>
            <SelectItem value="prescription">Prescription Actions</SelectItem>
          </SelectContent>
        </Select>

        {(actionFilter !== 'all' || roleFilter !== 'all' || successFilter !== 'all' || searchUserId) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear Filters
          </Button>
        )}

        <span className="ml-auto text-sm text-zinc-500">
          {pagination.totalCount.toLocaleString()} total entries
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No audit log entries found</p>
            <p className="text-zinc-400 text-sm mt-1">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log._id}
                  className={cn(!log.success && 'bg-red-50/50')}
                >
                  <TableCell className="text-sm text-zinc-600 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{log.action}</span>
                  </TableCell>
                  <TableCell>{getRoleBadge(log.role)}</TableCell>
                  <TableCell>{getOperationBadge(log.operation)}</TableCell>
                  <TableCell>
                    {log.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {log.targetId ? (
                      <span className="font-mono text-xs text-zinc-500 truncate block max-w-[120px]" title={log.targetId}>
                        {log.targetId}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </TableCell>
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
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-zinc-500">
            Page {pagination.page} of {pagination.totalPages}
            {' '}({pagination.totalCount.toLocaleString()} entries)
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
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Audit Log Detail</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Action</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Operation</p>
                  {getOperationBadge(selectedLog.operation)}
                </div>
                <div>
                  <p className="text-zinc-500">Role</p>
                  {getRoleBadge(selectedLog.role)}
                </div>
                <div>
                  <p className="text-zinc-500">Status</p>
                  {selectedLog.success ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-zinc-500">Timestamp</p>
                  <p className="font-medium">{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">User ID</p>
                  <p className="font-mono text-xs break-all">{selectedLog.userId}</p>
                </div>
                {selectedLog.targetId && (
                  <div>
                    <p className="text-zinc-500">Target ID</p>
                    <p className="font-mono text-xs break-all">{selectedLog.targetId}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-zinc-500">IP Address</p>
                    <p className="font-mono text-xs">{selectedLog.ipAddress}</p>
                  </div>
                )}
              </div>

              {selectedLog.userAgent && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">User Agent</p>
                  <p className="text-xs text-zinc-600 bg-zinc-50 rounded p-2 break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Metadata</p>
                  <div className="bg-zinc-50 rounded-lg p-3 text-xs font-mono space-y-1">
                    {Object.entries(selectedLog.metadata).map(([key, value]) =>
                      value !== null && value !== undefined ? (
                        <div key={key}>
                          <span className="text-zinc-500">{key}:</span>{' '}
                          <span className="text-zinc-800">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {selectedLog.integrityHash && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Integrity Hash</p>
                  <p className="font-mono text-xs text-zinc-400 break-all bg-zinc-50 rounded p-2">
                    {selectedLog.integrityHash}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
