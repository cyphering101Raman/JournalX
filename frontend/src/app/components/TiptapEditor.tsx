"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-8 p-2 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl w-full shadow-sm">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${editor.isActive('bold') ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${editor.isActive('italic') ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
      >
        Italic
      </button>
      <div className="w-px h-6 bg-zinc-800 mx-2"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
      >
        H2
      </button>
      <div className="w-px h-6 bg-zinc-800 mx-2"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${editor.isActive('bulletList') ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${editor.isActive('orderedList') ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
      >
        Numbered List
      </button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write about your day...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    immediatelyRender: false,
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'w-full h-full text-lg md:text-xl text-zinc-300 focus:outline-none leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full flex-grow flex flex-col tiptap-wrapper">
      <MenuBar editor={editor} />
      <div className=" min-h-[400px] flex-grow w-full bg-zinc-900/30 bg-blue- border border-zinc-800/50 rounded-2xl p-6 md:p-10 transition-colors duration-300 focus-within:bg-zinc-900/50 focus-within:border-zinc-700/50">
        <EditorContent editor={editor} className="h-full w-full outline-none" />
      </div>
    </div>
  );
}
