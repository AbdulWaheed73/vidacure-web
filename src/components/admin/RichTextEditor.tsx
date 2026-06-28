import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered } from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

/**
 * Reusable Tiptap rich-text editor. Used by the email-template editor and the
 * custom manual-send dialog. Authors content as an HTML fragment; the branded
 * Vidacure shell + {given_name} are applied server-side at send time.
 */
export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? 'Write the email content… use {given_name} to insert the patient’s name.',
      }),
    ],
    content: value,
    editorProps: { attributes: { class: 'min-h-[240px] p-4 text-sm focus:outline-none' } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync external value changes (e.g. switching template) into the editor.
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="border rounded-lg bg-white">
      {editor && (
        <div className="flex items-center gap-1 border-b p-1.5">
          <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></ToolbarBtn>
          <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></ToolbarBtn>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></ToolbarBtn>
          <ToolbarBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></ToolbarBtn>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></ToolbarBtn>
          <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></ToolbarBtn>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

const ToolbarBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded-md transition-colors ${active ? 'bg-[#E6F7F5] text-[#005044]' : 'text-gray-500 hover:bg-gray-100'}`}
  >
    {children}
  </button>
);

/** Shared lightweight preview: render content fragment inside an approximation of the email card. */
export const EmailContentPreview = ({ html }: { html: string }) => (
  <div className="border rounded-lg bg-[#f0f7f4] p-4">
    <div className="mx-auto max-w-[600px] bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center pb-3 mb-3 border-b-2 border-[#009689] w-20 mx-auto" />
      <div
        className="prose prose-sm max-w-none [&_a]:text-[#009689] [&_h2]:text-[#005044] [&_h3]:text-[#005044]"
        dangerouslySetInnerHTML={{ __html: (html || '').replace(/\{given_name\}/g, 'Anna') }}
      />
    </div>
    <p className="text-center text-xs text-muted-foreground mt-2">
      Preview ({'{given_name}'} shown as “Anna”). Vidacure header/footer added automatically on send.
    </p>
  </div>
);
