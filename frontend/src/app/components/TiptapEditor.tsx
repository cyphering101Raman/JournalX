"use client";

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Image as ImageExtension } from '@tiptap/extension-image';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

const lowlight = createLowlight(common);

const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '25%',
        parseHTML: (element) => element.getAttribute('width') || element.style.width || '25%',
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; max-width: 100%;`,
          };
        },
      },
    };
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('span');
      dom.className = 'inline-block relative my-2 mr-3 align-top max-w-full';

      const container = document.createElement('div');
      container.className = 'relative group inline-block align-top';
      container.style.width = node.attrs.width || '25%';
      container.style.maxWidth = '100%';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.className =
        'w-full h-auto rounded-xl object-contain block transition-all select-none border border-white/10';
      img.draggable = false;

      // Right Border Interactive Resize Rail
      const rightRail = document.createElement('div');
      rightRail.className = 'absolute top-0 -right-1.5 w-3 h-full cursor-ew-resize z-20';
      rightRail.title = 'Drag border to resize';

      // Left Border Interactive Resize Rail
      const leftRail = document.createElement('div');
      leftRail.className = 'absolute top-0 -left-1.5 w-3 h-full cursor-ew-resize z-20';
      leftRail.title = 'Drag border to resize';

      const handleMouseDown = (e: MouseEvent, side: 'right' | 'left') => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const initialWidth = container.offsetWidth || 200;
        const parentWidth =
          (dom.closest('.ProseMirror') as HTMLElement)?.clientWidth ||
          (dom.parentElement as HTMLElement)?.offsetWidth ||
          window.innerWidth;

        let finalWidthPercentage = node.attrs.width || '25%';

        const onMouseMove = (moveEvent: MouseEvent) => {
          const deltaX = side === 'right' ? moveEvent.clientX - startX : startX - moveEvent.clientX;
          const newPixelWidth = Math.max(80, Math.min(parentWidth, initialWidth + deltaX));
          const percentage = Math.round((newPixelWidth / parentWidth) * 100);
          finalWidthPercentage = `${percentage}%`;
          container.style.width = finalWidthPercentage;
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);

          if (typeof getPos === 'function') {
            const pos = getPos();
            if (typeof pos === 'number') {
              editor.view.dispatch(
                editor.view.state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  width: finalWidthPercentage,
                })
              );
            }
          }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };

      rightRail.addEventListener('mousedown', (e) => handleMouseDown(e, 'right'));
      leftRail.addEventListener('mousedown', (e) => handleMouseDown(e, 'left'));

      container.appendChild(img);
      container.appendChild(rightRail);
      container.appendChild(leftRail);
      dom.appendChild(container);

      return {
        dom,
        selectNode: () => {
          img.classList.add('ring-2', 'ring-indigo-500', 'shadow-[0_0_20px_rgba(99,102,241,0.35)]');
        },
        deselectNode: () => {
          img.classList.remove('ring-2', 'ring-indigo-500', 'shadow-[0_0_20px_rgba(99,102,241,0.35)]');
        },
        update: (updatedNode: any) => {
          if (updatedNode.type.name !== 'image') return false;
          container.style.width = updatedNode.attrs.width || '25%';
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || '';
          return true;
        },
      };
    };
  },
});


interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  const headingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(e.target as Node)) {
        setIsHeadingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const isImageActive = editor.isActive('image');

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url })
        .updateAttributes('image', { width: '25%' })
        .run();
    }
  };


  return (
    <div className="flex flex-col gap-2 w-full mb-6 select-none relative z-30">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#141624]/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full shadow-xl">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Paragraph / Heading Dropdown - Placed outside the scroll container */}
          <div className="relative shrink-0" ref={headingMenuRef}>
            <button
              type="button"
              onClick={() => setIsHeadingMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span>
                {editor.isActive('heading', { level: 1 })
                  ? 'Heading 1'
                  : editor.isActive('heading', { level: 2 })
                  ? 'Heading 2'
                  : 'Normal text'}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-150 ${isHeadingMenuOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isHeadingMenuOpen && (
              <div className="absolute left-0 top-full mt-2 flex flex-col bg-[#181a2c] border border-white/10 rounded-xl p-1.5 z-50 shadow-2xl min-w-[130px] animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className={`text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    !editor.isActive('heading')
                      ? 'bg-white/15 text-white font-medium'
                      : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  Normal text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className={`text-left px-3 py-1.5 text-xs rounded-lg font-bold transition-colors ${
                    editor.isActive('heading', { level: 1 })
                      ? 'bg-white/15 text-white'
                      : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  Heading 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className={`text-left px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                    editor.isActive('heading', { level: 2 })
                      ? 'bg-white/15 text-white'
                      : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  Heading 2
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">

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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('blockquote') ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Quote"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            </svg>
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Image Attachment */}
          <button
            type="button"
            onClick={addImage}
            className={`p-2 rounded-lg transition-colors ${
              isImageActive ? 'bg-indigo-600/30 text-indigo-300' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Insert Image URL"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
        </div>
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
      CustomImage.configure({
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

