"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Underline } from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { Link } from "@tiptap/extension-link"
import { TextAlign } from "@tiptap/extension-text-align"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Code,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, CodeSquare,
  Link as LinkIcon,
  Highlighter,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Palette,
  Undo, Redo,
  Type
} from "lucide-react"
import { useRef } from "react"

const FONT_FAMILIES = [
  { value: "inherit", label: "Inherit" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Monaco, monospace", label: "Monospace" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
]

const FONT_SIZES = [
  "10px", "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px", "60px", "72px"
]

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  height?: string
}

function MenuButton({ 
  onClick, 
  isActive = false, 
  icon: Icon, 
  title,
  ...props 
}: {
  onClick: () => void
  isActive?: boolean
  icon: React.ElementType
  title: string
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-accent hover:text-accent-foreground ${isActive ? "bg-accent text-accent-foreground" : ""}`}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export default function TiptapEditor({ content, onChange, placeholder, height = "min-h-[200px]" }: TiptapEditorProps) {
  const menuContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editable: true,
    content: content || "",
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({
        types: ["paragraph", "heading", "listItem", "codeBlock"],
      }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert prose-sm max-w-none focus:outline-none ${height} w-full`,
        placeholder: placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt("Enter URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const setColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(e.target.value).run()
  }

  const setHighlight = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setHighlight({ color: e.target.value }).run()
  }

  const setFontFamily = (family: string) => {
    editor.chain().focus().setFontFamily(family).run()
  }

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run()
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div
        ref={menuContainerRef}
        className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50 overflow-x-auto"
      >
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Undo"
        />
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Redo"
        />
        <div className="w-px h-6 bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Type}
          title="H1"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Type}
          title="H2"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Type}
          title="H3"
        />
        <div className="w-px h-6 bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          title="Bold (Cmd+B)"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          title="Italic (Cmd+I)"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={UnderlineIcon}
          title="Underline (Ctrl+U)"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          title="Strikethrough"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          icon={Code}
          title="Inline Code"
        />
        <div className="w-px h-6 bg-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedlist")}
          icon={ListOrdered}
          title="Ordered List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          title="Blockquote"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={CodeSquare}
          title="Code Block"
        />
        <div className="w-px h-6 bg-border mx-1" />

        <MenuButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          title="Add Link"
        />
        <div className="flex items-center gap-1">
          <Palette className="h-4 w-4" />
          <input
            type="color"
            defaultValue="#000000"
            className="w-6 h-6 p-0 border rounded cursor-pointer"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            title="Text Color"
          />
        </div>
        <div className="flex items-center gap-1">
          <Highlighter className="h-4 w-4" />
          <input
            type="color"
            defaultValue="#ffff00"
            className="w-6 h-6 p-0 border rounded cursor-pointer"
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            title="Highlight"
          />
        </div>
        <div className="w-px h-6 bg-border mx-1" />

        <select
          onChange={(e) => setFontFamily(e.target.value)}
          className="text-xs px-2 py-1 rounded border border-input bg-background focus:outline-none"
          defaultValue="inherit"
        >
          {FONT_FAMILIES.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          onChange={(e) => setFontSize(e.target.value)}
          className="text-xs px-2 py-1 rounded border border-input bg-background focus:outline-none"
          defaultValue=""
        >
          <option value="">Size</option>
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <MenuButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive("subscript")}
          icon={SubscriptIcon}
          title="Subscript"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive("superscript")}
          icon={SuperscriptIcon}
          title="Superscript"
        />
        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).align("left").run()}
            className={`p-1.5 rounded hover:bg-accent ${editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).align("center").run()}
            className={`p-1.5 rounded hover:bg-accent ${editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).align("right").run()}
            className={`p-1.5 rounded hover:bg-accent ${editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => (editor.chain().focus() as any).align("justify").run()}
            className={`p-1.5 rounded hover:bg-accent ${editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""}`}
            title="Align Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
