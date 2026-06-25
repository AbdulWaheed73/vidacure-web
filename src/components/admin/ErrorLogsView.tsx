import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
  AlertTriangle,
  Eye,
  RefreshCw,
  CheckCircle,
  RotateCcw,
  Search,
} from 'lucide-react';
import {
  useErrorLogs,
  useErrorLog,
  useErrorLogSummary,
  useResolveErrorLog,
} from '@/hooks/useErrorLogQueries';
import type {
  ErrorLogsQueryParams,
  ErrorLevel,
  ErrorCategory,
} from '@/types/admin-types';
import { cn } from '@/lib/utils';

const LIMIT = 30;

const LEVELS: ErrorLevel[] = ['warning', 'error', 'critical'];
const CATEGORIES: ErrorCategory[] = [
  'auth',
  'payment',
  'prescription',
  'crash',
  'unhandled',
  'render',
  'network',
  'other',
];

const levelBadgeClass = (level: ErrorLevel): string => {
  switch (level) {
    case 'critical':
      return 'bg-red-100 text-red-700';
    case 'error':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

const formatDate = (value: string): string => new Date(value).toLocaleString();

export const ErrorLogsView = () => {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [resolvedFilter, setResolvedFilter] = useState('all');

  const resetPage = () => setPage(1);

  const params = useMemo<ErrorLogsQueryParams>(
    () => ({
      page,
      limit: LIMIT,
      ...(levelFilter !== 'all' && { level: levelFilter }),
      ...(categoryFilter !== 'all' && { category: categoryFilter }),
      ...(originFilter !== 'all' && { origin: originFilter }),
      ...(resolvedFilter !== 'all' && { resolved: resolvedFilter }),
    }),
    [page, levelFilter, categoryFilter, originFilter, resolvedFilter]
  );

  const { data: logsData, isLoading: loading, refetch } = useErrorLogs(params);
  const logs = logsData?.logs ?? [];
  const pagination = logsData?.pagination ?? { page, limit: LIMIT, totalCount: 0, totalPages: 0 };

  const { data: summary } = useErrorLogSummary();
  const { data: detail, isLoading: detailLoading } = useErrorLog(selectedId);
  const resolveMutation = useResolveErrorLog();

  const handleResolve = async (id: string, resolved: boolean) => {
    try {
      await resolveMutation.mutateAsync({ id, resolved });
      toast.success(resolved ? 'Marked as resolved' : 'Reopened');
    } catch {
      toast.error('Failed to update error log');
    }
  };

  const unresolvedTotal = summary?.unresolvedByLevel.reduce((sum, x) => sum + x.count, 0) ?? 0;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Unresolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unresolvedTotal}</div>
          </CardContent>
        </Card>
        {LEVELS.map((level) => {
          const count = summary?.unresolvedByLevel.find((x) => x.level === level)?.count ?? 0;
          return (
            <Card key={level}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize text-zinc-500">
                  Unresolved {level}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top errors (last 7 days) */}
      {summary && summary.topErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top errors (last 7 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.topErrors.map((e) => (
              <div
                key={e.fingerprint}
                className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-2 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.message}</p>
                  <p className="text-xs text-zinc-500">
                    {e.category} · last seen {formatDate(e.lastSeen)}
                  </p>
                </div>
                <Badge className={levelBadgeClass(e.level)}>{e.count}×</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Select
            value={levelFilter}
            onValueChange={(v) => {
              setLevelFilter(v);
              resetPage();
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l} className="capitalize">
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v);
              resetPage();
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={originFilter}
            onValueChange={(v) => {
              setOriginFilter(v);
              resetPage();
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Origin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All origins</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={resolvedFilter}
            onValueChange={(v) => {
              setResolvedFilter(v);
              resetPage();
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="false">Unresolved</SelectItem>
              <SelectItem value="true">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-zinc-500">
                  Loading…
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-zinc-500">
                  <Search className="mx-auto mb-2 h-5 w-5" />
                  No error logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} className={cn(!log.resolved && 'bg-red-50/40')}>
                  <TableCell className="whitespace-nowrap text-sm text-zinc-600">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('capitalize', levelBadgeClass(log.level))}>{log.level}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{log.category}</TableCell>
                  <TableCell className="text-sm">
                    {log.origin === 'client' ? log.source : 'api'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={log.message}>
                    {log.message}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.userName ?? log.actorType}
                  </TableCell>
                  <TableCell>
                    {log.resolved ? (
                      <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                    ) : (
                      <Badge className="bg-zinc-100 text-zinc-600">Open</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedId(log._id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {log.resolved ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={resolveMutation.isPending}
                          onClick={() => handleResolve(log._id, false)}
                          title="Reopen"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={resolveMutation.isPending}
                          onClick={() => handleResolve(log._id, true)}
                          title="Mark resolved"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalCount} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail modal — fetches heavy fields (stack/context) on demand */}
      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Error detail
            </DialogTitle>
          </DialogHeader>
          {detailLoading || !detail ? (
            <p className="py-8 text-center text-zinc-500">Loading…</p>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-zinc-500">Level: </span>
                  <Badge className={cn('capitalize', levelBadgeClass(detail.level))}>
                    {detail.level}
                  </Badge>
                </div>
                <div>
                  <span className="text-zinc-500">Category: </span>
                  <span className="capitalize">{detail.category}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Origin/Source: </span>
                  {detail.origin}/{detail.source}
                </div>
                <div>
                  <span className="text-zinc-500">When: </span>
                  {formatDate(detail.timestamp)}
                </div>
                <div>
                  <span className="text-zinc-500">Actor: </span>
                  {detail.userName ?? detail.actorType}
                </div>
                <div>
                  <span className="text-zinc-500">Status: </span>
                  {detail.resolved ? 'Resolved' : 'Open'}
                </div>
                {detail.route && (
                  <div className="col-span-2">
                    <span className="text-zinc-500">Route: </span>
                    {detail.method ? `${detail.method} ` : ''}
                    {detail.route}
                    {detail.statusCode ? ` → ${detail.statusCode}` : ''}
                  </div>
                )}
                {detail.ipAddress && (
                  <div className="col-span-2">
                    <span className="text-zinc-500">IP / UA: </span>
                    {detail.ipAddress} · {detail.userAgent}
                  </div>
                )}
                {detail.resolvedAt && (
                  <div className="col-span-2">
                    <span className="text-zinc-500">Resolved: </span>
                    {formatDate(detail.resolvedAt)}
                    {detail.resolvedByName ? ` by ${detail.resolvedByName}` : ''}
                  </div>
                )}
              </div>

              <div>
                <p className="text-zinc-500">Message</p>
                <p className="break-words font-medium">{detail.message}</p>
              </div>

              {detail.stack && (
                <div>
                  <p className="text-zinc-500">Stack</p>
                  <pre className="max-h-64 overflow-auto rounded bg-zinc-50 p-3 text-xs">
                    {detail.stack}
                  </pre>
                </div>
              )}

              {detail.context && (
                <div>
                  <p className="text-zinc-500">Context</p>
                  <pre className="max-h-48 overflow-auto rounded bg-zinc-50 p-3 text-xs">
                    {JSON.stringify(detail.context, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                {detail.resolved ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resolveMutation.isPending}
                    onClick={() => handleResolve(detail._id, false)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reopen
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={resolveMutation.isPending}
                    onClick={() => handleResolve(detail._id, true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark resolved
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
