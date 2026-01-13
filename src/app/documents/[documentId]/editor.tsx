"use client" //as we cannot use hooks in server components
import { useEditor, EditorContent } from '@tiptap/react'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'

export const Editor=()=>{
    const editor = useEditor({
        editorProps:{
            attributes:{
                style:"padding-left: 56px; padding-right:56px",
                class:"focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-coll min-h-[1054px] w-[816px] pt-10 pr-14 pd-10 cursor-text"
            }
        },
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({
                nested:true,
            }),
            TableKit.configure({
                table:{resizable:true},
            }),
            // Use ImageResize which extends the base Image extension
            ImageResize.configure({
                inline: true,
                allowBase64: true,
            }),
            Image
        ],
        content: '<p>Hello World! 🌎️</p>',
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    })
    return (
        <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
            <div className="min-w-max flex-justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}