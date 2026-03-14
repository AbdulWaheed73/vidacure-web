import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDoctorPatientJournal,
  useUpsertDoctorPatientJournal,
} from '@/hooks/useDoctorDashboardQueries';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Pilcrow,
} from 'lucide-react';

type JournalTabProps = {
  patientId: string | null;
  enabled: boolean;
};

export const JournalTab: React.FC<JournalTabProps> = ({ patientId, enabled }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useDoctorPatientJournal(patientId, enabled);
  const upsertMutation = useUpsertDoctorPatientJournal();
  const [saved, setSaved] = useState(false);

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

  // Sync content when data loads
  useEffect(() => {
    if (editor && data?.journal?.content && !editor.isDestroyed) {
      const currentContent = editor.getHTML();
      if (currentContent === '<p></p>' || currentContent === '') {
        editor.commands.setContent(data.journal.content);
      }
    }
  }, [data?.journal?.content, editor]);

  // Reset editor when patientId changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent('');
    }
  }, [patientId, editor]);

  const handleSave = () => {
    if (!editor || !patientId) return;
    const content = editor.getHTML();
    upsertMutation.mutate(
      { patientId, content },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      }
    );
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

  return (
    <div className="space-y-4 p-1">
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

      {/* Save button + timestamps */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          disabled={upsertMutation.isPending}
          className="bg-[#005044] text-white rounded-xl px-6 py-2.5 font-sora font-semibold text-sm hover:bg-[#004038] transition-colors disabled:opacity-50"
        >
          {upsertMutation.isPending
            ? t('treatmentJournal.saving')
            : saved
              ? t('treatmentJournal.saved')
              : t('treatmentJournal.save')}
        </button>

        {journal && (
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
        )}
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
