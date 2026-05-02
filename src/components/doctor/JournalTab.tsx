import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import DOMPurify from 'dompurify';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/Button';
import {
  useDoctorPatientJournal,
  useUpsertDoctorPatientJournal,
  useDoctorUnassignedPatientJournal,
  useUpsertDoctorUnassignedPatientJournal,
} from '@/hooks/useDoctorDashboardQueries';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Pilcrow,
  Pencil,
} from 'lucide-react';

type JournalTabProps = {
  patientId: string | null;
  enabled: boolean;
  isUnassigned?: boolean;
};

const hasJournalContent = (html?: string | null) => {
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>/g, '').trim();
  return stripped.length > 0;
};

export const JournalTab: React.FC<JournalTabProps> = ({ patientId, enabled, isUnassigned = false }) => {
  const { t } = useTranslation();
  const assignedQuery = useDoctorPatientJournal(patientId, enabled && !isUnassigned);
  const unassignedQuery = useDoctorUnassignedPatientJournal(patientId, enabled && isUnassigned);
  const { data, isLoading } = isUnassigned ? unassignedQuery : assignedQuery;
  const assignedMutation = useUpsertDoctorPatientJournal();
  const unassignedMutation = useUpsertDoctorUnassignedPatientJournal();
  const upsertMutation = isUnassigned ? unassignedMutation : assignedMutation;
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t('treatmentJournal.placeholder'),
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'min-h-[200px] p-4 font-manrope text-[#282828] text-sm',
      },
    },
  });

  // Sync content into editor whenever fresh data arrives or we re-enter edit mode
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const incoming = data?.journal?.content ?? '';
    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [data?.journal?.content, editor, isEditing]);

  // Reset to view mode when switching patients
  useEffect(() => {
    setIsEditing(false);
  }, [patientId]);

  // If there's no existing journal content, drop straight into edit mode
  useEffect(() => {
    if (!isLoading && !hasJournalContent(data?.journal?.content)) {
      setIsEditing(true);
    }
  }, [isLoading, data?.journal?.content]);

  const handleSave = () => {
    if (!editor || !patientId) return;
    const content = editor.getHTML();
    upsertMutation.mutate(
      { patientId, content },
      {
        onSuccess: () => {
          setSaved(true);
          setIsEditing(false);
          setTimeout(() => setSaved(false), 2000);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    if (editor && !editor.isDestroyed && data?.journal?.content) {
      editor.commands.setContent(data.journal.content);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-1">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    );
  }

  const journal = data?.journal;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const timestamps = journal && (
    <div className="text-xs text-[#b0b0b0] font-manrope text-right space-y-0.5">
      <p>
        {t('treatmentJournal.created')}: {formatDate(journal.createdAt)}
      </p>
      {journal.updatedAt !== journal.createdAt && (
        <p>
          {t('treatmentJournal.lastUpdated')}: {formatDate(journal.updatedAt)}
        </p>
      )}
    </div>
  );

  const inViewMode = !isEditing && hasJournalContent(journal?.content);

  return (
    <div className="space-y-4 p-1">
      {inViewMode && (
        <>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-[#e0e0e0] text-[#005044] rounded-xl font-sora font-semibold hover:bg-[#E6F7F5] hover:text-[#005044]"
            >
              <Pencil className="w-4 h-4" />
              {t('treatmentJournal.edit')}
            </Button>
            {timestamps}
          </div>

          <div
            className="journal-content border border-[#e0e0e0] rounded-xl bg-white p-4 font-manrope text-[#282828] text-sm"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(journal!.content),
            }}
          />
        </>
      )}

      <div className={inViewMode ? 'hidden' : 'space-y-4'}>
      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-1 border border-[#e0e0e0] rounded-lg p-1.5 bg-white">
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-[#e0e0e0] mx-1" />
          <ToolbarButton
            active={editor.isActive('paragraph') && !editor.isActive('heading')}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-[#e0e0e0] mx-1" />
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </div>
      )}

      {/* Editor */}
      <div className="tiptap-editor border border-[#e0e0e0] rounded-xl bg-white overflow-hidden">
        <EditorContent editor={editor} />
      </div>

      {/* Save / Cancel + timestamps */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className="bg-[#005044] text-white rounded-xl px-6 font-sora font-semibold hover:bg-[#004038]"
          >
            {upsertMutation.isPending
              ? t('treatmentJournal.saving')
              : saved
                ? t('treatmentJournal.saved')
                : t('treatmentJournal.save')}
          </Button>
          {hasJournalContent(journal?.content) && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={upsertMutation.isPending}
              className="border-[#e0e0e0] text-[#282828] rounded-xl px-5 font-sora font-semibold"
            >
              {t('treatmentJournal.cancel')}
            </Button>
          )}
        </div>

        {timestamps}
      </div>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded-md transition-colors ${
      active ? 'bg-[#E6F7F5] text-[#005044]' : 'text-[#666] hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);
