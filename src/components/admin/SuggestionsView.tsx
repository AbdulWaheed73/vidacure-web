import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, Trash2, Loader2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/Alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import {
  useAdminSuggestions,
  useDeleteSuggestion,
} from '@/hooks/useSuggestionQueries';
import type { Suggestion } from '@/types/suggestion-types';

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncate = (s: string, n = 80) => (s.length > n ? `${s.slice(0, n)}…` : s);

export const SuggestionsView = () => {
  const { data, isLoading, isError, error } = useAdminSuggestions();
  const deleteMutation = useDeleteSuggestion();

  const [viewing, setViewing] = useState<Suggestion | null>(null);
  const [toDelete, setToDelete] = useState<Suggestion | null>(null);

  const suggestions = data?.suggestions ?? [];

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete._id, {
      onSuccess: () => {
        toast.success('Suggestion deleted');
        setToDelete(null);
      },
      onError: () => {
        toast.error('Failed to delete suggestion');
      },
    });
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Platform Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading && (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <Alert variant="destructive" title="Error">
              {(error as any)?.response?.data?.error ||
                (error as Error)?.message ||
                'Failed to load suggestions'}
            </Alert>
          )}

          {!isLoading && !isError && suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No suggestions yet.
            </p>
          )}

          {!isLoading && !isError && suggestions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell className="font-medium">{s.submitterName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={s.submitterRole === 'doctor' ? 'default' : 'secondary'}
                      >
                        {s.submitterRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">{s.title}</TableCell>
                    <TableCell className="max-w-md text-muted-foreground text-sm">
                      {truncate(s.description)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(s.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewing(s)}
                          aria-label="View suggestion"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setToDelete(s)}
                          aria-label="Delete suggestion"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>
              From <strong>{viewing?.submitterName}</strong> ({viewing?.submitterRole}) ·{' '}
              {viewing ? formatDate(viewing.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-gray-800 max-h-[60vh] overflow-y-auto">
            {viewing?.description}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this suggestion?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The suggestion will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
