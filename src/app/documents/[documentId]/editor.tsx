"use client" 

import { useEditor, EditorContent } from '@tiptap/react'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from '@/store/use-editor-store'
import { IndicTransliteration } from '@/extensions/indic-transliteration' 

// --- NEW EXTENSIONS TO FIX FONT ERRORS ---
import FontFamily from '@tiptap/extension-font-family'
import {TextStyle} from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'

// --- DATABASE IMPORTS ---
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api"; 
import { Id } from "../../../../convex/_generated/dataModel"; 
import { useRef } from "react"; 

interface EditorProps {
  documentId: Id<"documents">;
  initialContent?: string;
}

export const Editor = ({ documentId, initialContent }: EditorProps) => {
    const { setEditor } = useEditorStore();
    
    const update = useMutation(api.documents.update);
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const editor = useEditor({
        onCreate({ editor }) { setEditor(editor); },
        onDestroy() { setEditor(null); },
        
        onUpdate({ editor }) { 
            setEditor(editor);
            
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }

            saveTimerRef.current = setTimeout(() => {
                console.log("Auto-saving...");
                update({ 
                    id: documentId, 
                    content: JSON.stringify(editor.getJSON()) 
                })
                .then(() => console.log("Saved!"))
                .catch(() => console.error("Save failed"));
            }, 2000); 
        },
        
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
            TextStyle,    // <--- REQUIRED for Font Family
            FontFamily,   // <--- FIXES setFontFamily error
            Underline,    // <--- FIXES Underline error
            TaskList,
            TaskItem.configure({ nested: true }),
            IndicTransliteration, 
            Table.configure({ resizable: true }), 
            TableRow,
            TableHeader,
            TableCell,
            ImageResize.configure({
                inline: true,
                allowBase64: true,
            }),
            Image
        ],
        content: initialContent ? JSON.parse(initialContent) : '<p>नमस्ते India! Start typing...</p>',
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