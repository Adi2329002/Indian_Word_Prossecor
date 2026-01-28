"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEditorStore } from "@/store/use-editor-store"
import { IndicTransliteration } from "@/extensions/indic-transliteration"
import FontFamily from "@tiptap/extension-font-family"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Placeholder from "@tiptap/extension-placeholder"
import { useLiveblocksExtension } from "@liveblocks/react-tiptap"

// 👇 Import the new smart extensions
// (Make sure you created these files in src/extensions/ first!)
import { GrammarChecker } from "@/extensions/grammar-checker"
import { SmartAutocomplete } from "@/extensions/smart-autocomplete"

export const Editor = () => {
  const { setEditor } = useEditorStore()
  const liveblocks = useLiveblocksExtension()

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor)
    },
    onDestroy() {
      setEditor(null)
    },
    onUpdate({ editor }) {
      setEditor(editor)
    },
    editorProps: {
      attributes: {
        style: "padding-left: 56px; padding-right: 56px;",
        class:
          "focus:outline-none bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text shadow-sm mx-auto prose prose-sm max-w-none",
        // 👇 Disable browser spellcheck so it doesn't fight with our Grammar Checker
        spellcheck: "false",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        // 👇 FIX: Ignore the type error, but keep the functionality!
        // @ts-ignore
        history: false, 
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      FontFamily,
      Underline,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      
      // 👇 Your Custom Extensions
      IndicTransliteration.configure({
        defaultLanguage: "hi",
      }),
      GrammarChecker,    // Adds the red/yellow underlines
      SmartAutocomplete, // Adds the grey ghost text suggestions

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Subscript,
      Superscript,
      Placeholder.configure({
        placeholder: "यहाँ टाइप करें... Start typing here...",
      }),
    ],
    immediatelyRender: false,
  })

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 py-6">
      <EditorContent editor={editor} />
    </div>
  )
}