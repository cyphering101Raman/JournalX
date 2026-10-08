"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Image as ImageExtension } from '@tiptap/extension-image';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#141624]/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full mb-6 shadow-xl select-none">
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {/* Paragraph / Heading Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span>
              {editor.isActive('heading', { level: 1 })
                ? 'Heading 1'
                : editor.isActive('heading', { level: 2 })
                ? 'Heading 2'
                : 'Normal text'}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col bg-[#181a2c] border border-white/10 rounded-xl p-1 z-50 shadow-2xl min-w-[120px]">
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className="text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 rounded-lg"
            >
              Normal text
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 rounded-lg font-bold"
            >
              Heading 1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 rounded-lg font-semibold"
            >
              Heading 2
            </button>
          </div>
        </div>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Formatting Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm font-serif transition-colors ${
            editor.isActive('bold') ? 'bg-white/15 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm font-serif italic transition-colors ${
            editor.isActive('italic') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Italic"
        >
          I
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Lists & Task Checkboxes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bulletList') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Bullet List"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('orderedList') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Numbered List"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>

        {/* Task List / Checklist */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('taskList') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Task List / Checklist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Code Block with Syntax Highlighting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg text-xs font-mono transition-colors ${
            editor.isActive('codeBlock') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Code Block (Syntax Highlighted)"
        >
          &lt;/&gt;
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-colors ${
            editor.isActive('blockquote') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Quote"
        >
          &ldquo;&rdquo;
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Image Attachment */}
        <button
          type="button"
          onClick={addImage}
          className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-white/5`}
          title="Insert Image URL"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
          title="Undo"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your thoughts here...',
        emptyEditorClass: 'is-editor-empty',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    immediatelyRender: false,
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'w-full h-full text-base md:text-lg text-zinc-200 focus:outline-none leading-relaxed font-sans min-h-[350px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full flex-grow flex flex-col tiptap-wrapper">
      <MenuBar editor={editor} />
      <div className="flex-grow w-full outline-none">
        <EditorContent editor={editor} className="h-full w-full outline-none" />
      </div>
    </div>
  );
}
