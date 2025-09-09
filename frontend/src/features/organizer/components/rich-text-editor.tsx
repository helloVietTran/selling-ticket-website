import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Type,
  Strikethrough,
} from 'lucide-react';

import { Editor } from '@tiptap/react';
import { Toggle } from '@/components/ui/toggle';

function EditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: 1 })
          .run(),
      preesed: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: 2 })
          .run(),
      preesed: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: 3 })
          .run(),
      preesed: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <Type className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .setParagraph()
          .run(),
      preesed: editor.isActive('paragraph'),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleBold()
          .run(),
      preesed: editor.isActive('bold'),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleItalic()
          .run(),
      preesed: editor.isActive('italic'),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleStrike()
          .run(),
      preesed: editor.isActive('strike'),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .setTextAlign('left')
          .run(),
      preesed: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .setTextAlign('center')
          .run(),
      preesed: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .setTextAlign('right')
          .run(),
      preesed: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleBulletList()
          .run(),
      preesed: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleOrderedList()
          .run(),
      preesed: editor.isActive('orderedList'),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight()
          .run(),
      preesed: editor.isActive('highlight'),
    },
  ];

  return (
    <div className="p-1 space-x-2 z-50 border-b flex items-center">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}

      <input
        type="color"
        className="size-5 p-0 rounded cursor-pointer"
        onInput={e =>
          editor
            .chain()
            .focus()
            .setColor((e.target as HTMLInputElement).value)
            .run()
        }
        value={editor.getAttributes('textStyle').color || '#000000'}
      />
    </div>
  );
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'h-64 rounded-md py-2 px-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      className="
            rounded-lg
            border 
            border-gray-300 
            bg-white 
            text-gray-900
            dark:border-gray-600 
            dark:bg-gray-900 
            dark:text-gray-100
      "
    >
      <EditorMenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="
                    prose prose-sm max-w-none
                    text-gray-900 dark:text-gray-100
                    overflow-y-auto max-h-64

                    [&_h1]:text-3xl [&_h1]:font-bold
                    [&_h2]:text-2xl [&_h2]:font-semibold
                    [&_h3]:text-xl [&_h3]:font-medium
                    [&_p]:text-base [&_p]:font-normal

                    font-[Roboto]
        "
      />
    </div>
  );
}
