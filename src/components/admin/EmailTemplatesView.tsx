import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Plus, Pencil, Trash2, Eye, Code } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { RichTextEditor, EmailContentPreview } from '@/components/admin/RichTextEditor';

import {
  useEmailTemplates, useCreateEmailTemplate, useUpdateEmailTemplate, useDeleteEmailTemplate,
} from '@/hooks/useEmailTemplateQueries';
import { emailTemplateFormSchema } from '@/types/email-template-types';
import type { EmailTemplate, EmailTemplateFormValues } from '@/types/email-template-types';

export const EmailTemplatesView = () => {
  const { data, isLoading, error } = useEmailTemplates();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const deleteMutation = useDeleteEmailTemplate();

  const templates = data?.templates ?? [];

  const openCreate = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (t: EmailTemplate) => { setEditing(t); setEditorOpen(true); };

  const handleDelete = (t: EmailTemplate) => {
    if (!window.confirm(`Deactivate "${t.title}"? It will stop being sent (history is kept).`)) return;
    deleteMutation.mutate(t._id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dark-teal">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            The monthly drip emails. Each active template is sent to every subscriber once, in order.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#005044] text-white">
          <Plus className="h-4 w-4 mr-1" /> Add template
        </Button>
      </div>

      {isLoading && <div className="flex justify-center py-8"><LoadingSpinner /></div>}
      {error && <Alert variant="destructive" title="Error">Failed to load templates.</Alert>}

      {!isLoading && !error && (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="text-right w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No templates yet. Click “Add template” to create the first one.
                  </TableCell>
                </TableRow>
              )}
              {templates.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">{t.order}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell className="text-muted-foreground">{t.subject}</TableCell>
                  <TableCell>
                    <Badge variant={t.isActive ? 'default' : 'secondary'}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editorOpen && (
        <TemplateEditorDialog template={editing} onClose={() => setEditorOpen(false)} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const TemplateEditorDialog = ({ template, onClose }: { template: EmailTemplate | null; onClose: () => void }) => {
  const isEdit = !!template;
  const createMutation = useCreateEmailTemplate();
  const updateMutation = useUpdateEmailTemplate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState(template?.html ?? '');

  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateFormSchema),
    defaultValues: {
      title: template?.title ?? '',
      subject: template?.subject ?? '',
      order: template?.order ?? 1,
      isActive: template?.isActive ?? true,
    },
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: EmailTemplateFormValues) => {
    setSubmitError(null);
    if (!content || content === '<p></p>') {
      setSubmitError('The email content is empty.');
      return;
    }
    const payload = { ...values, html: content };
    try {
      if (isEdit && template) {
        await updateMutation.mutateAsync({ id: template._id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setSubmitError(isAxiosError(err) ? err.response?.data?.error ?? 'Save failed' : 'Save failed');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit template' : 'Add template'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Title (internal)</Label>
              <Input placeholder="Month 1 – Welcome" {...form.register('title')} />
              {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Order</Label>
              <Input type="number" min={1} {...form.register('order')} />
              {form.formState.errors.order && <p className="text-xs text-red-500">{form.formState.errors.order.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Subject</Label>
            <Input placeholder="Välkommen till Vidacure" {...form.register('subject')} />
            {form.formState.errors.subject && <p className="text-xs text-red-500">{form.formState.errors.subject.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={(v) => form.setValue('isActive', v === true)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">Active (included in the sequence)</Label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>Email content</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreview((p) => !p)}>
                {showPreview ? <><Code className="h-4 w-4 mr-1" /> Editor</> : <><Eye className="h-4 w-4 mr-1" /> Preview</>}
              </Button>
            </div>
            {!showPreview ? (
              <RichTextEditor value={content} onChange={setContent} />
            ) : (
              <EmailContentPreview html={content} />
            )}
            <p className="text-xs text-muted-foreground">
              Tip: type <code className="bg-gray-100 px-1 rounded">{'{given_name}'}</code> where the patient’s first name should appear.
            </p>
          </div>

          {submitError && <Alert variant="destructive" title="Error">{submitError}</Alert>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-[#005044] text-white">
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
