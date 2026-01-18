"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import { 
    LucideIcon, 
    PrinterIcon, 
    Redo2Icon, 
    Undo2Icon,
    SpellCheckIcon, 
    BoldIcon, 
    ItalicIcon, 
    UnderlineIcon, 
    MessageSquarePlusIcon, 
    ListTodoIcon, 
    RemoveFormattingIcon,
    Mic,
    Volume2Icon,
    FileTextIcon,
    HomeIcon,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// --- Sub-component: Font Family Dropdown ---
const FontFamilyButton = () => {
    const { editor } = useEditorStore();

    const fonts = [
        { label: "Arial", value: "Arial" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Courier New", value: "Courier New" },
        { label: "Mangal (Hindi)", value: "Mangal" },
        { label: "Devanagari", value: "Noto Sans Devanagari" },
    ];

    if (!editor) return null;

    // This dynamically finds the current font family to show in the menu
    const currentFont = editor.getAttributes("textStyle").fontFamily || "Arial";

    return (
        <div className="flex items-center gap-x-1 px-2 hover:bg-neutral-200/80 rounded-sm cursor-pointer h-7 transition border border-neutral-300 bg-white">
            <select 
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                className="bg-transparent text-xs outline-none cursor-pointer min-w-[100px]"
                value={currentFont}
            >
                {fonts.map((font) => (
                    <option key={font.value} value={font.value}>
                        {font.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="size-3 text-neutral-500 ml-1" />
        </div>
    );
};

// --- Sub-component: Toolbar Button ---
interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    icon: LucideIcon;
    label?: string;
    showLabel?: boolean;
}

const ToolbarButton = ({ onClick, isActive, icon: Icon, label, showLabel }: ToolbarButtonProps) => {
    return (
        <button 
            onClick={onClick} 
            className={cn(
                "text-sm h-7 px-2 flex items-center justify-center gap-x-2 rounded-sm hover:bg-neutral-200/80 transition",
                isActive && "bg-neutral-200/80",
                isActive && label === "Voice Typing" && "text-red-600 animate-pulse"
            )}
        >
            <Icon className="size-4" />
            {showLabel && <span className="text-xs font-medium">{label}</span>}
        </button>
    );
};

export const Toolbar = () => {
    const { editor } = useEditorStore();
    const [isListening, setIsListening] = useState(false);

    if (!editor) return null;

    const handleVoiceTyping = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        if (isListening) { recognition.stop(); return; }
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            editor.chain().focus().insertContent(transcript + ' ').run();
        };
        recognition.start();
    };

    return (
        <div className="flex flex-col gap-y-1 bg-[#F1F4F9] p-1 shadow-sm border-b border-neutral-300">
            {/* TOP LINE: Main Navigation/Menu */}
            <div className="flex items-center gap-x-1 px-2">
                <ToolbarButton label="File" showLabel icon={FileTextIcon} onClick={() => {}} />
                <ToolbarButton label="Home" showLabel icon={HomeIcon} onClick={() => {}} isActive />
                <div className="flex-grow" /> {/* Spacer */}
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Indian Word Processor</span>
            </div>

            <Separator className="bg-neutral-300" />

            {/* BOTTOM LINE: Formatting Tools */}
            <div className="flex items-center gap-x-0.5 px-2 py-0.5 overflow-x-auto">
                <ToolbarButton icon={Undo2Icon} onClick={() => editor.chain().focus().undo().run()} />
                <ToolbarButton icon={Redo2Icon} onClick={() => editor.chain().focus().redo().run()} />
                <ToolbarButton icon={PrinterIcon} onClick={() => window.print()} />
                
                <Separator orientation="vertical" className="h-6 bg-neutral-300 mx-1" />

                <FontFamilyButton />

                <Separator orientation="vertical" className="h-6 bg-neutral-300 mx-1" />

                <ToolbarButton icon={BoldIcon} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} />
                <ToolbarButton icon={ItalicIcon} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} />
                <ToolbarButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} />

                <Separator orientation="vertical" className="h-6 bg-neutral-300 mx-1" />

                <ToolbarButton label="Voice Typing" icon={Mic} onClick={handleVoiceTyping} isActive={isListening} />
                <ToolbarButton icon={Volume2Icon} onClick={() => {
                    const text = editor.getText();
                    if (!text) return;
                    window.speechSynthesis.cancel();
                    const ut = new SpeechSynthesisUtterance(text);
                    ut.lang = 'hi-IN';
                    window.speechSynthesis.speak(ut);
                }} />

                <Separator orientation="vertical" className="h-6 bg-neutral-300 mx-1" />

                <ToolbarButton icon={ListTodoIcon} onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive("taskList")} />
                <ToolbarButton icon={RemoveFormattingIcon} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
            </div>
        </div>
    );
};