"use client" 

import { useEditor, EditorContent } from '@tiptap/react'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from '@/store/use-editor-store'
import { IndicTransliteration } from '@/extensions/indic-transliteration' 

// --- NEW IMPORTS FOR DATABASE ---
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";         // <--- Added two more ../
import { Id } from "../../../../convex/_generated/dataModel";   // <--- Added two more ../
import { useRef } from "react"; // For the timer

// Define the props this component expects
interface EditorProps {
  documentId: Id<"documents">;
  initialContent?: string;
}

export const Editor = ({ documentId, initialContent }: EditorProps) => {
    const { setEditor } = useEditorStore();
    
    // 1. Get the update function from backend
    const update = useMutation(api.documents.update);
    
    // 2. Create a reference for the auto-save timer
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const editor = useEditor({
        onCreate({ editor }) { setEditor(editor); },
        onDestroy() { setEditor(null); },
        
        // --- 3. THE AUTO-SAVE LOGIC ---
        onUpdate({ editor }) { 
            setEditor(editor);
            
            // Clear the previous timer (cancel the save if you kept typing)
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }

            // Set a new timer to save in 2 seconds
            saveTimerRef.current = setTimeout(() => {
                console.log("Auto-saving...");
                update({ 
                    id: documentId, 
                    content: JSON.stringify(editor.getJSON()) // Convert doc to string
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
        // 4. Load the real content from the database (or default to Hindi greeting)
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