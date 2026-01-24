"use client"
import Image from "next/image"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"

import { useState, useCallback, useRef,useEffect } from "react"
import { useEditorStore } from "@/store/use-editor-store"
import {
  Undo2Icon,
  Redo2Icon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Mic,
  Volume2Icon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  TableIcon,
  ImageIcon,
  SaveIcon,
  FolderOpenIcon,
  PrinterIcon,
  TypeIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  IndentIcon,
  OutdentIcon,
  HighlighterIcon,
  Link2Icon,
  SubscriptIcon,
  SuperscriptIcon,
  RemoveFormattingIcon,
  FileTextIcon,
  DownloadIcon,
  FilePlusIcon,
  CheckSquareIcon,
  MinusIcon,
  SearchIcon,
  CopyIcon,
  ScissorsIcon,
  ClipboardIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const FONT_SIZES = ["10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"]

const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff",
  "#4a86e8", "#0000ff", "#9900ff", "#ff00ff", "#e6b8af", "#f4cccc",
]

const HIGHLIGHT_COLORS = [
  "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff0000", "#0000ff",
  "#ffa500", "#800080", "#ffc0cb", "#90ee90", "#add8e6", "#ffb6c1",
]

interface ToolbarProps {
  document: any
}

export const Toolbar = ({ document }: ToolbarProps) => {
const updateDocument = useMutation(api.documents.update)

  const { editor, zoom, setZoom, wideMode, toggleWideMode } = useEditorStore()

  const wordCount =
    editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0

  const [activeTab, setActiveTab] = useState("home")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [saveStatus, setSaveStatus] = useState("Saved")
  // ✅ Title state (local for smooth typing)
const [title, setTitle] = useState(document?.title || "")
const [isSaving, setIsSaving] = useState(false)
useEffect(() => {
  if (document?.title) {
    setTitle(document.title)
  }
}, [document])




  // 2. Create a reference to hold the recognition object
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])
useEffect(() => {
  if (!editor) return

  const updateHandler = () => {
    setSaveStatus("Saving...")

    setTimeout(() => {
      setSaveStatus("Saved just now")
    }, 800)
  }

  editor.on("update", updateHandler)

  return () => {
    editor.off("update", updateHandler)
  }
}, [editor])

  const indianFonts = [
    { label: "Hindi (Mangal)", value: "Mangal" },
    { label: "Hindi (Devanagari)", value: "Noto Sans Devanagari" },
    { label: "Tamil (Lohit)", value: "Lohit Tamil" },
    { label: "Bengali (Lohit)", value: "Lohit Bengali" },
    { label: "Telugu (Gautami)", value: "Gautami" },
    { label: "Marathi (Sanskrit)", value: "Noto Serif Devanagari" },
    { label: "Gujarati (Shruti)", value: "Shruti" },
    { label: "Kannada (Tunga)", value: "Tunga" },
    { label: "Malayalam (Kartika)", value: "Kartika" },
    { label: "Punjabi (Raavi)", value: "Raavi" },
    { label: "English (Arial)", value: "Arial" },
    { label: "English (Times)", value: "Times New Roman" },
  ]

const handleVoiceTyping = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported.")
      return
    }

    // 3. TOGGLE LOGIC: If it's already listening, stop the EXISTING instance
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // 4. START LOGIC: Create the instance and store it in the ref
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition; // Save it here!

    recognition.lang = "hi-IN"
    recognition.continuous = true; 
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true)
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("")

      if (event.results[event.results.length - 1].isFinal && editor) {
        editor.chain().focus().insertContent(transcript + " ").run()
      }
    }

    recognition.onerror = (event: any) => {
      console.error(event.error)
      setIsListening(false)
    }

    // Reset UI if the recognition ends naturally (e.g., silence)
    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null;
    }

    recognition.start()
  }, [editor, isListening])

  const handleReadAloud = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.")
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const text = editor?.getText() || ""
    if (text) {
      const ut = new SpeechSynthesisUtterance(text)
      ut.lang = "hi-IN"
      ut.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(ut)
    }
  }, [editor, isSpeaking])

  const handlePrint = useCallback(() => {
    const content = editor?.getHTML()
    const printWindow = window.open("", "", "width=800,height=600")
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document</title>
            <style>
              body { font-family: 'Mangal', 'Noto Sans Devanagari', sans-serif; padding: 40px; line-height: 1.6; }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #ccc; padding: 8px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [editor])

  const handleDownload = useCallback(() => {
    const content = editor?.getHTML() || ""
    const blob = new Blob(
      [
        `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
          <style>
            body { font-family: 'Mangal', 'Noto Sans Devanagari', sans-serif; padding: 40px; line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ccc; padding: 8px; }
          </style>
        </head>
        <body>${content}</body>
      </html>`,
      ],
      { type: "text/html" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.html"
    a.click()
    URL.revokeObjectURL(url)
  }, [editor])



const handleZoom = (value: number) => {
  setZoom(value)
}
const currentMatchRef = useRef(0)

const handleSearch = useCallback(() => {
  if (!searchText || !editor) return

  const matches: { from: number; to: number }[] = []

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText) return

    const text = node.text?.toLowerCase()
    const searchLower = searchText.toLowerCase()

    let index = 0
    while (text && (index = text.indexOf(searchLower, index)) !== -1) {
      matches.push({
        from: pos + index,
        to: pos + index + searchText.length,
      })
      index += searchText.length
    }
  })

  if (matches.length === 0) {
    alert("Text not found / टेक्स्ट नहीं मिला")
    return
  }

  const match = matches[currentMatchRef.current % matches.length]

  editor
    .chain()
    .focus()
    .setTextSelection({ from: match.from, to: match.to })
    .run()

  currentMatchRef.current++
}, [editor, searchText])

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor?.chain().focus().unsetLink().run()
      return
    }
    editor?.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl("")
  }, [editor, linkUrl])

  if (!editor) return null

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    active = false,
    tooltip,
    disabled = false,
  }: {
    icon: any
    onClick: () => void
    active?: boolean
    tooltip: string
    disabled?: boolean
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
          className={cn(
  "p-1.5 rounded transition-colors disabled:opacity-40",
  active
    ? "bg-[#1a5276] text-white dark:bg-[#25476a]"
    : "text-neutral-700 hover:bg-neutral-200 dark:text-gray-200 dark:hover:bg-[#2a3b52]"
)}



          >
           <Icon className="size-4 stroke-[2.2]" />

          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
<div className="flex flex-col bg-[#F1F4F9] border-b border-neutral-300 shadow-sm">
 <div className="flex items-center justify-between px-6 py-3 bg-[#1a5276] dark:bg-[#0f172a] text-white transition-colors duration-300">


   <div className="flex items-center gap-4">
  <Image
    src="/logo.png"
    alt="BharatDocs Logo"
    width={48}
    height={48}
    className="object-contain"
  />

  <div className="flex flex-col">
    <span className="text-lg font-bold tracking-wide">
      Bharat<span className="text-yellow-300">Docs</span>
    </span>

    <input
      value={document?.title || ""}
      onChange={(e) =>
        updateDocument({
          id: document._id,
          title: e.target.value,
        })
      }
      className="text-sm bg-transparent outline-none border-none text-white placeholder-white/60 focus:ring-0"
      placeholder="Untitled Document"
    />
  </div>
</div>

    <div className="flex items-center relative">
      <div className="flex items-center gap-4 mr-3 text-xs">

  <span className="opacity-80">{saveStatus}</span>
  <span className="opacity-80">{wordCount} words</span>

  <button
   onClick={() => {
  if (typeof window !== "undefined") {
    window.document.documentElement.classList.toggle("dark")
  }
}}

    className="px-2 py-1 border rounded text-xs hover:bg-white hover:text-black transition"
  >
    🌙
  </button>

</div>


  {!showSearch && (
    <SearchIcon
      className="size-6 cursor-pointer"
      onClick={() => setShowSearch(true)}
    />
  )}

  {showSearch && (
    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md shadow-md transition-all duration-200">
      <Input
        autoFocus
        placeholder="Search document..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="h-8 w-64 text-black text-sm border-none focus:ring-0"
      />
      <SearchIcon
        className="size-5 text-gray-600 cursor-pointer"
        onClick={handleSearch}
      />
      <button
        onClick={() => setShowSearch(false)}
        className="text-gray-500 text-sm"
      >
        ✕
      </button>
    </div>
  )}
</div>


  </div>


      {/* Tab Bar */}
     <div className="flex items-center gap-x-1 px-2 pt-1 bg-[#E8ECF1] dark:bg-[#1e293b] transition-colors duration-300">

        {["file", "home", "insert", "view"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-t-md transition capitalize",
              activeTab === tab
                ? "bg-white font-semibold text-[#1a5276] border-x border-t border-neutral-300"
                : "hover:bg-neutral-200 dark:hover:bg-[#334155] text-neutral-600 dark:text-gray-300"

            )}
          >
            {tab === "file" ? "File / फ़ाइल" : tab === "home" ? "Home / होम" : tab === "insert" ? "Insert / डालें" : "View / देखें"}
          </button>
        ))}
      </div>

      {/* Toolbar Content */}
      <div className="flex items-center gap-x-2 px-3 py-2 min-h-[52px] bg-white border-t border-neutral-200 flex-wrap dark:bg-[#1e293b] dark:border-gray-700">


        {/* FILE TAB */}
        {activeTab === "file" && (
          <>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().clearContent().run()
                editor.chain().focus().setContent("<p></p>").run()
              }}
             className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
            >
              <FilePlusIcon className="size-4" /> New / नया
            </button>
            <button
              type="button"
            className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
           >
              <FolderOpenIcon className="size-4" /> Open / खोलें
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
           >
              <SaveIcon className="size-4" /> Save / सहेजें
            </button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <button
              type="button"
              onClick={handlePrint}
             className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
            >
              <PrinterIcon className="size-4" /> Print / प्रिंट
            </button>
            <button
              type="button"
              onClick={handleDownload}
             className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
           >
              <DownloadIcon className="size-4" /> Download / डाउनलोड
            </button>
          </>
        )}

        {/* HOME TAB */}
        {activeTab === "home" && (
          <>
            {/* Undo/Redo */}
            <ToolbarButton icon={Undo2Icon} onClick={() => editor.chain().focus().undo().run()} tooltip="Undo / पूर्ववत" disabled={!editor.can().undo()} />
            <ToolbarButton icon={Redo2Icon} onClick={() => editor.chain().focus().redo().run()} tooltip="Redo / फिर से" disabled={!editor.can().redo()} />
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Clipboard */}
            <ToolbarButton icon={ScissorsIcon} onClick={() => document.execCommand("cut")} tooltip="Cut / काटें" />
            <ToolbarButton icon={CopyIcon} onClick={() => document.execCommand("copy")} tooltip="Copy / कॉपी" />
            <ToolbarButton icon={ClipboardIcon} onClick={() => document.execCommand("paste")} tooltip="Paste / चिपकाएं" />
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Font Selection */}
          <select
  onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
  className="bg-neutral-50 text-black border text-xs p-1.5 rounded min-w-[150px] font-medium 
  focus:border-[#1a5276] focus:outline-none
  dark:bg-[#1f2a3a] dark:text-white dark:border-[#2e3f55]"
  value={editor.getAttributes("textStyle").fontFamily || "Mangal"}
>
  {indianFonts.map((font) => (
    <option key={font.value} value={font.value}>
      {font.label}
    </option>
  ))}
</select>


           {/* Font Size */}
<Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className="w-[65px] text-xs justify-center
      bg-neutral-50 text-black
      dark:bg-[#1f2a3a] dark:text-white dark:border-[#2e3f55]"
    >
      {editor.getAttributes("textStyle").fontSize?.replace("px", "") || "14"}
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-20 p-1 dark:bg-[#1f2a3a] dark:border-[#2e3f55]">
    {FONT_SIZES.map((size) => (
      <button
        key={size}
        onClick={() =>
          editor
            .chain()
            .focus()
            .setMark("textStyle", { fontSize: `${size}px` })
            .run()
        }
        className="w-full text-center px-2 py-1 text-xs rounded 
        hover:bg-neutral-200 
        dark:hover:bg-[#2a3b52] dark:text-white"
      >
        {size}
      </button>
    ))}
  </PopoverContent>
</Popover>
{/* Text Color */}
<Popover>
  <PopoverTrigger asChild>
    <button
      type="button"
      className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#2a3b52] transition"
    >
      <TypeIcon className="size-4" />
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-48 p-2 bg-white dark:bg-[#1e293b] border dark:border-gray-700">
    <p className="text-xs font-medium mb-2 text-black dark:text-white">
      Text Color
    </p>

    <div className="grid grid-cols-6 gap-1">
      {TEXT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: color }}
          onClick={() =>
            editor.chain().focus().setColor(color).run()
          }
        />
      ))}

      {/* Remove color */}
      <button
        type="button"
        className="col-span-6 text-xs mt-2 text-red-500"
        onClick={() =>
          editor.chain().focus().unsetColor().run()
        }
      >
        Remove Color
      </button>
    </div>
  </PopoverContent>
</Popover>


           {/* Highlight Color */}
<Popover>
  <PopoverTrigger asChild>
    <button
      type="button"
      className="p-1.5 rounded transition 
                 hover:bg-neutral-200 
                 dark:text-gray-200 
                 dark:hover:bg-[#2a3b52]"
    >
      <HighlighterIcon className="size-4" />
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-48 p-3 
                             bg-white dark:bg-[#1e293b] 
                             border dark:border-gray-700">

    <p className="text-xs font-medium mb-2 
                  text-black dark:text-white">
      Highlight / हाइलाइट
    </p>

    <div className="grid grid-cols-6 gap-2">
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="w-6 h-6 rounded border 
                     hover:scale-110 transition"
          style={{ backgroundColor: color }}
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color }).run()
          }
        />
      ))}
    </div>

    {/* Remove Highlight */}
    <button
      type="button"
      className="w-full mt-3 text-xs 
                 text-red-500 hover:underline"
      onClick={() =>
        editor.chain().focus().unsetHighlight().run()
      }
    >
      Remove Highlight
    </button>

  </PopoverContent>
</Popover>

<Separator orientation="vertical" className="h-6 mx-1" />


            {/* Text Formatting */}
            <ToolbarButton icon={BoldIcon} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} tooltip="Bold / बोल्ड (Ctrl+B)" />
            <ToolbarButton icon={ItalicIcon} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} tooltip="Italic / इटैलिक (Ctrl+I)" />
            <ToolbarButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} tooltip="Underline / रेखांकन (Ctrl+U)" />
            <ToolbarButton icon={StrikethroughIcon} onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} tooltip="Strikethrough / स्ट्राइकथ्रू" />
            <ToolbarButton icon={SubscriptIcon} onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} tooltip="Subscript / सबस्क्रिप्ट" />
            <ToolbarButton icon={SuperscriptIcon} onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} tooltip="Superscript / सुपरस्क्रिप्ट" />
            <ToolbarButton icon={RemoveFormattingIcon} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} tooltip="Clear Formatting / फॉर्मेटिंग हटाएं" />
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Alignment */}
            <ToolbarButton icon={AlignLeftIcon} onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} tooltip="Align Left / बाएं" />
            <ToolbarButton icon={AlignCenterIcon} onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} tooltip="Align Center / केंद्र" />
            <ToolbarButton icon={AlignRightIcon} onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} tooltip="Align Right / दाएं" />
            <ToolbarButton icon={AlignJustifyIcon} onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} tooltip="Justify / जस्टिफाई" />
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
           <Popover>
  <PopoverTrigger asChild>
    <button
      type="button"
      className="p-1.5 rounded transition hover:bg-neutral-200 dark:hover:bg-[#2a3b52]"
    >
      <ListIcon className="size-4" />
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-48 p-2 dark:bg-[#1e293b] dark:text-white">
    <div className="flex flex-col gap-1 text-xs">

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#2a3b52]"
      >
        <ListIcon className="size-4" />
        Bullet List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#2a3b52]"
      >
        <ListOrderedIcon className="size-4" />
        Numbered List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#2a3b52]"
      >
        <CheckSquareIcon className="size-4" />
        Task List
      </button>

      <Separator className="my-1" />

      <button
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#2a3b52]"
      >
        <IndentIcon className="size-4" />
        Increase Indent
      </button>

      <button
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#2a3b52]"
      >
        <OutdentIcon className="size-4" />
        Decrease Indent
      </button>

    </div>
  </PopoverContent>
</Popover>

<Separator orientation="vertical" className="h-6 mx-1" />


            {/* Voice Features */}
            <ToolbarButton
            icon={Mic}
            onClick={handleVoiceTyping}
            active={isListening}
            tooltip={isListening ? "Listening... / सुन रहा हूँ..." : "Voice Input / आवाज इनपुट"}
            // Optional: add a class to pulse if listening
            />
            <ToolbarButton
              icon={Volume2Icon}
              onClick={handleReadAloud}
              active={isSpeaking}
              tooltip="Read Aloud / पढ़कर सुनाएं"
            />
          </>
        )}

        {/* INSERT TAB */}
        {activeTab === "insert" && (
          <div className="flex items-center gap-3 whitespace-nowrap">

            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
            >
              <TableIcon className="size-4" /> Table / तालिका
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Enter Image URL / छवि URL दर्ज करें:")
                if (url) editor.chain().focus().setImage({ src: url }).run()
              }}
              className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
            >
              <ImageIcon className="size-4" /> Picture / चित्र
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
            >
                  <Link2Icon className="size-4" /> Link / लिंक
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3">
                <p className="text-xs font-medium mb-2">Insert Link / लिंक डालें</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={setLink}>
                    Add
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="flex items-center gap-1.5 text-xs border 
           px-3 py-1.5 rounded transition
           bg-neutral-50 text-black border-neutral-300
           hover:bg-white hover:border-[#1a5276]
           dark:bg-[#1e293b] dark:text-gray-200 dark:border-gray-700
           dark:hover:bg-[#2a3b52] dark:hover:border-[#3b82f6]"
            >
              <MinusIcon className="size-4" /> Divider / विभाजक
            </button>
           </div>
)}


      {/* VIEW TAB */}
{activeTab === "view" && (
  <div className="flex items-center gap-4 flex-wrap">

    {/* Search */}
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search text... / टेक्स्ट खोजें..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="text-xs w-48 h-8"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleSearch}
        className="h-8"
      >
        <SearchIcon className="size-4 mr-1" /> Find
      </Button>
    </div>

    {/* Zoom */}
    <select
      value={zoom}
      onChange={(e) => handleZoom(Number(e.target.value))}
      className="bg-neutral-50 border text-xs p-1.5 rounded h-8
                 dark:bg-[#1e293b] dark:text-white dark:border-gray-700"
    >
      {[50, 75, 100, 125, 150, 200].map((z) => (
        <option key={z} value={z}>
          {z}%
        </option>
      ))}
    </select>

    {/* Wide Mode */}
    <button
      onClick={toggleWideMode}
      className="text-xs border px-3 py-1.5 rounded h-8
                 bg-neutral-50 hover:bg-white
                 dark:bg-[#1e293b] dark:text-white dark:border-gray-700
                 dark:hover:bg-[#2a3b52]"
    >
      {wideMode ? "Normal Width" : "Wide Mode"}
    </button>

  </div>
)}

      </div>
    </div>
  )
}
