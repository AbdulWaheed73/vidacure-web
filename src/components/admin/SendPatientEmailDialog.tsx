import { useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { AlertTriangle, CheckCircle2, Circle, Eye, Code } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RichTextEditor, EmailContentPreview } from '@/components/admin/RichTextEditor';

import { useEmailTemplates } from '@/hooks/useEmailTemplateQueries';
import { usePatientEmailStatus, useSendPatientEmail } from '@/hooks/useEmailSendQueries';
import { EmailLogView } from '@/components/admin/EmailLogView';

type Props = {
  patient: { id: string; name: string };
  onClose: () => void;
};

export const SendPatientEmailDialog = ({ patient, onClose }: Props) => {
  const { data: templatesData } = useEmailTemplates();
  const { data: status, isLoading: statusLoading } = usePatientEmailStatus(patient.id);
  const sendMutation = useSendPatientEmail();

  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Merge full templates (for html/preview) with per-patient sent flags.
  const templates = useMemo(() => {
    const sentMap = new Map((status?.templates ?? []).map((t) => [t._id, t]));
    return (templatesData?.templates ?? [])
      .filter((t) => t.isActive)
      .map((t) => ({ ...t, sent: sentMap.get(t._id)?.sent ?? false, sentAt: sentMap.get(t._id)?.sentAt ?? null }));
  }, [templatesData, status]);

  const selectedTemplate = templates.find((t) => t._id === selectedTemplateId) ?? null;
  const consentGranted = status?.communicationConsentGranted ?? true;

  const previewHtml = mode === 'template' ? selectedTemplate?.html ?? '' : customContent;

  const handleSend = async () => {
    setSubmitError(null);
    try {
      if (mode === 'template') {
        if (!selectedTemplateId) { setSubmitError('Pick a template to send.'); return; }
        await sendMutation.mutateAsync({ patientId: patient.id, payload: { mode: 'template', templateId: selectedTemplateId } });
      } else {
        if (!customSubject.trim()) { setSubmitError('Subject is required.'); return; }
        if (!customContent || customContent === '<p></p>') { setSubmitError('Email content is empty.'); return; }
        await sendMutation.mutateAsync({ patientId: patient.id, payload: { mode: 'custom', subject: customSubject, html: customContent } });
      }
      onClose();
    } catch (err) {
      setSubmitError(isAxiosError(err) ? err.response?.data?.error ?? 'Send failed' : 'Send failed');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send email to {patient.name}</DialogTitle>
        </DialogHeader>

        {!consentGranted && (
          <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              This patient has <strong>not</strong> agreed to communication consent. You can still send,
              but please proceed with care — the send will be recorded as “no consent”.
            </span>
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex gap-2">
          <Button type="button" variant={mode === 'template' ? 'default' : 'outline'} size="sm" onClick={() => setMode('template')}>
            Use a template
          </Button>
          <Button type="button" variant={mode === 'custom' ? 'default' : 'outline'} size="sm" onClick={() => setMode('custom')}>
            Custom email
          </Button>
        </div>

        {mode === 'template' ? (
          <div className="space-y-2">
            <Label>Choose a template</Label>
            {statusLoading ? (
              <div className="flex justify-center py-6"><LoadingSpinner /></div>
            ) : templates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active templates. Create one in “Email Templates”.</p>
            ) : (
              <div className="space-y-1 max-h-56 overflow-y-auto rounded-md border">
                {templates.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => setSelectedTemplateId(t._id)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedTemplateId === t._id ? 'bg-[#E6F7F5]' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-5">{t.order}</span>
                      <span className="font-medium">{t.title}</span>
                      <span className="text-muted-foreground">— {t.subject}</span>
                    </span>
                    {t.sent ? (
                      <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> Sent</Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1"><Circle className="h-3 w-3" /> Not sent</Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Subject</Label>
              <Input value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} placeholder="Subject line" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreview((p) => !p)}>
                  {showPreview ? <><Code className="h-4 w-4 mr-1" /> Editor</> : <><Eye className="h-4 w-4 mr-1" /> Preview</>}
                </Button>
              </div>
              {showPreview
                ? <EmailContentPreview html={customContent} />
                : <RichTextEditor value={customContent} onChange={setCustomContent} />}
              <p className="text-xs text-muted-foreground">
                Tip: type <code className="bg-gray-100 px-1 rounded">{'{given_name}'}</code> for the patient’s first name.
              </p>
            </div>
          </div>
        )}

        {/* Template preview */}
        {mode === 'template' && selectedTemplate && (
          <div className="space-y-1">
            <Label>Preview</Label>
            <EmailContentPreview html={previewHtml} />
          </div>
        )}

        {submitError && <Alert variant="destructive" title="Error">{submitError}</Alert>}

        {/* This patient's email history */}
        <details className="rounded-md border bg-gray-50/50">
          <summary className="cursor-pointer px-3 py-2 text-sm font-medium">Email history for this patient</summary>
          <div className="p-2">
            <EmailLogView patientId={patient.id} />
          </div>
        </details>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSend} disabled={sendMutation.isPending} className="bg-[#005044] text-white">
            {sendMutation.isPending ? 'Sending…' : 'Send email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
