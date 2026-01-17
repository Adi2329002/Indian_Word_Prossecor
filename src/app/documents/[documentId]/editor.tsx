"use client" 
import { useEditor, EditorContent } from '@tiptap/react'
import { TaskItem, TaskList } from '@tiptap/extension-list'
// 1. IMPORT ALL TABLE PARTS HERE
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from '@/store/use-editor-store'
import { IndicTransliteration } from '@/extensions/indic-transliteration' 

export const Editor = () => {
    const { setEditor } = useEditorStore();

    const editor = useEditor({
        onCreate({ editor }) { setEditor(editor); },
        onDestroy() { setEditor(null); },
        onUpdate({ editor }) { setEditor(editor); },
        onSelectionUpdate({ editor }) { setEditor(editor); },
        onTransaction({ editor }) { setEditor(editor); },
        onFocus({ editor }) { setEditor(editor); },
        onBlur({ editor }) { setEditor(editor); },
        onContentError({ editor }) { setEditor(editor); },
        
        editorProps: {
            attributes: {
                style: "padding-left: 56px; padding-right:56px",
                class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text" 
            }
        },
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({ nested: true }),
            
            // --- YOUR INDIAN EXTENSION ---
            IndicTransliteration, 
            
            // --- FIXED TABLE CONFIGURATION ---
            Table.configure({ resizable: true }), 
            TableRow,    // <--- Added this
            TableHeader, // <--- Added this
            TableCell,   // <--- Added this
            // --------------------------------

            ImageResize.configure({
                inline: true,
                allowBase64: true,
            }),
            Image
        ],
        content: '<p>नमस्ते India! Start typing...</p>',
        immediatelyRender: false,
    })

    return (
        <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
            <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}