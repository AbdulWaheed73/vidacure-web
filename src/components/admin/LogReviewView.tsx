import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardCheck,
  RefreshCw,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useLogReviews, useResolveLogReview } from '@/hooks/useAuditQueries';
import type { LogReview, LogReviewOutcome, LogReviewsQueryParams } from '@/types/admin-types';
import { cn } from '@/lib/utils';

const PARAMETER_LABELS: Record<string, string> = {
  high_volume: 'High-volume access',
  failed_clusters: 'Failed access clusters',
  after_hours: 'After-hours access',
  single_patient: 'Single-patient frequency',
  protected_identity: 'Protected identity',
  cross_unit: 'Cross-unit access',
  break_glass: 'Forced overrides',
};

const LIMIT = 20;

export const LogReviewView = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<LogReview | null>(null);
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const params = useMemo<LogReviewsQueryParams>(() => ({
    page,
    limit: LIMIT,
    ...(outcomeFilter !== 'all' && { outcome: outcomeFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
  }), [page, outcomeFilter, statusFilter]);

  const { data, isLoading, refetch } = useLogReviews(params);
  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination ?? { page, limit: LIMIT, totalCount: 0, totalPages: 0 };

  const resolveMutation = useResolveLogReview();

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const formatPeriod = (from: string, to: string) =>
    `${new Date(from).toLocaleDateString()} – ${new Date(to).toLocaleDateString()}`;

  const getOutcomeBadge = (outcome: LogReviewOutcome) => {
    const styles: Record<LogReviewOutcome, string> = {
      clean: 'bg-green-100 text-green-700 border-green-200',
      flagged: 'bg-amber-100 text-amber-700 border-amber-200',
      escalated: 'bg-red-100 text-red-700 border-red-200',
    };
    return <Badge className={styles[outcome]}>{outcome}</Badge>;
  };

  const getStatusBadge = (status: string) => (
    <Badge className={status === 'resolved' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-zinc-100 text-zinc-700'}>
      {status}
    </Badge>
  );

  const handleResolve = () => {
    if (!selected) return;
    resolveMutation.mutate(
      { id: selected._id, resolutionNotes: resolutionNotes.trim() || undefined },
      {
        onSuccess: ({ review }) => {
          toast.success('Review resolved');
          setSelected(review);
          setResolutionNotes('');
        },
        onError: (error) => {
          console.error('Failed to resolve review:', error);
          toast.error('Failed to resolve review');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-manrope">Log Reviews</h2>
          <p className="text-sm text-zinc-500">
            Documented systematic log reviews (loggkontroll) — proof of PDL-compliant access monitoring
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={outcomeFilter} onValueChange={(v) => { setOutcomeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="clean">Clean</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-sm text-zinc-500">
          {pagination.totalCount.toLocaleString()} recorded reviews
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardCheck className="h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No log reviews recorded yet</p>
            <p className="text-zinc-400 text-sm mt-1">Run an anomaly scan in Audit Logs, then record a review</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recorded</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r._id} className={cn(r.outcome === 'escalated' && r.status === 'open' && 'bg-red-50/50')}>
                  <TableCell className="text-sm text-zinc-600 whitespace-nowrap">{formatDate(r.createdAt)}</TableCell>
                  <TableCell className="text-sm font-medium">{r.reviewerName}</TableCell>
                  <TableCell className="text-sm text-zinc-600">{formatPeriod(r.periodFrom, r.periodTo)}</TableCell>
                  <TableCell>{getOutcomeBadge(r.outcome)}</TableCell>
                  <TableCell>{getStatusBadge(r.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(r); setResolutionNotes(''); }}>
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
          <p className="text-sm text-zinc-500">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Review Detail</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Reviewer</p>
                  <p className="font-medium">{selected.reviewerName}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Recorded</p>
                  <p className="font-medium">{formatDate(selected.createdAt)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Period</p>
                  <p className="font-medium">{formatPeriod(selected.periodFrom, selected.periodTo)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Outcome</p>
                  {getOutcomeBadge(selected.outcome)}
                </div>
                <div>
                  <p className="text-zinc-500">Status</p>
                  {getStatusBadge(selected.status)}
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-1">Parameters reviewed</p>
                {selected.parametersReviewed.length === 0 ? (
                  <p className="text-sm text-zinc-400">None specified</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selected.parametersReviewed.map((p) => (
                      <Badge key={p} className="bg-zinc-100 text-zinc-700">{PARAMETER_LABELS[p] || p}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {selected.notes && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Notes</p>
                  <p className="text-sm text-zinc-700 bg-zinc-50 rounded p-2 whitespace-pre-wrap">{selected.notes}</p>
                </div>
              )}

              {selected.status === 'resolved' && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Resolution</p>
                  <p className="text-sm text-zinc-700 bg-blue-50 rounded p-2 whitespace-pre-wrap">
                    {selected.resolvedAt && <span className="block text-xs text-zinc-500 mb-1">Resolved {formatDate(selected.resolvedAt)}</span>}
                    {selected.resolutionNotes || '—'}
                  </p>
                </div>
              )}

              {selected.anomalySnapshot && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Anomaly snapshot</p>
                  <pre className="text-xs text-zinc-600 bg-zinc-50 rounded p-2 overflow-x-auto max-h-48">
                    {JSON.stringify(selected.anomalySnapshot, null, 2)}
                  </pre>
                </div>
              )}

              {selected.integrityHash && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Integrity Hash</p>
                  <p className="font-mono text-xs text-zinc-400 break-all bg-zinc-50 rounded p-2">{selected.integrityHash}</p>
                </div>
              )}

              {selected.status === 'open' && (
                <div className="space-y-2 border-t pt-4">
                  <Label>Resolution notes</Label>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Describe the resolution or follow-up taken…"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {selected.status === 'open' && (
              <DialogFooter>
                <Button onClick={handleResolve} disabled={resolveMutation.isPending}>
                  {resolveMutation.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Mark Resolved
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
