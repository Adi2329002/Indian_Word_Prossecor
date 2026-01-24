"use client"

import { useState, useCallback, useRef,useEffect } from "react"
import { useEditorStore } from "@/store/use-editor-store"
import { useLanguageStore } from "@/store/use-language-store"
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
import { translations } from "@/lib/translations"

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

export const Toolbar = () => {
  const { editor } = useEditorStore()
  const { language, supportedLanguages, setLanguage } = useLanguageStore()
  const [activeTab, setActiveTab] = useState("home")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
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

    recognition.lang = language.code
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
  }, [editor, isListening, language])

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
      ut.lang = language.code
      ut.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(ut)
    }
  }, [editor, isSpeaking, language])

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

  const handleSearch = useCallback(() => {
    if (!searchText || !editor) return
    const { state } = editor
    const { doc } = state
    let found = false

    doc.descendants((node, pos) => {
      if (found) return false
      if (node.isText && node.text?.toLowerCase().includes(searchText.toLowerCase())) {
        const index = node.text.toLowerCase().indexOf(searchText.toLowerCase())
        editor.chain().focus().setTextSelection({ from: pos + index, to: pos + index + searchText.length }).run()
        found = true
        return false
      }
    })

    if (!found) {
      alert("Text not found / टेक्स्ट नहीं मिला")
    }
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
              "p-1.5 rounded transition-colors disabled:opacity-50",
              active ? "bg-[#1a5276] text-white" : "hover:bg-neutral-200 text-neutral-700"
            )}
          >
            <Icon className="size-4" />
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
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a5276] text-white">
        <div className="flex items-center gap-3">
          <FileTextIcon className="size-6" />
          <span className="font-semibold text-lg">भारतीय वर्ड प्रोसेसर</span>
        </div>
        <span className="text-xs opacity-80 tracking-wide">INDIAN WORD PROCESSOR</span>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-x-1 px-2 pt-1 bg-[#E8ECF1]">
        {["file", "home", "insert", "view"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-t-md transition capitalize",
              activeTab === tab
                ? "bg-white font-semibold text-[#1a5276] border-x border-t border-neutral-300"
                : "hover:bg-neutral-200 text-neutral-600"
            )}
          >
            {`${translations[tab]['en']} / ${translations[tab][language.code]}`}
          </button>
        ))}
      </div>

      {/* Toolbar Content */}
      <div className="flex items-center gap-x-2 px-3 py-2 min-h-[52px] bg-white border-t border-neutral-200 flex-wrap">
        {/* FILE TAB */}
        {activeTab === "file" && (
          <>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().clearContent().run()
                editor.chain().focus().setContent("<p></p>").run()
              }}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <FilePlusIcon className="size-4" /> New / नया
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <FolderOpenIcon className="size-4" /> Open / खोलें
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <SaveIcon className="size-4" /> Save / सहेजें
            </button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <PrinterIcon className="size-4" /> Print / प्रिंट
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
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
              className="bg-neutral-50 border text-xs p-1.5 rounded min-w-[150px] font-medium focus:border-[#1a5276] focus:outline-none"
              value={editor.getAttributes("textStyle").fontFamily || "Mangal"}
            >
              {indianFonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            {/* Language Selection for Transliteration */}
            <select
              onChange={(e) => {
                const selectedLang = supportedLanguages.find(lang => lang.code === e.target.value);
                if (selectedLang) {
                  setLanguage(selectedLang);
                }
              }}
              className="bg-neutral-50 border text-xs p-1.5 rounded min-w-[150px] font-medium focus:border-[#1a5276] focus:outline-none"
              value={language.code}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            {/* Font Size */}
            <select
              onChange={(e) => {
                const size = e.target.value
                editor.chain().focus().setMark("textStyle", { fontSize: `${size}px` }).run()
              }}
              className="bg-neutral-50 border text-xs p-1.5 rounded w-[65px] font-medium focus:border-[#1a5276] focus:outline-none"
              defaultValue="14"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Color */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="p-1.5 rounded hover:bg-neutral-200 relative">
                  <TypeIcon className="size-4" />
                  <div
                    className="absolute bottom-0.5 left-1 right-1 h-1 rounded-full"
                    style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000" }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <p className="text-xs font-medium mb-2">Text Color / टेक्स्ट रंग</p>
                <div className="grid grid-cols-6 gap-1">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border hover:scale-110 transition"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Highlight Color */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="p-1.5 rounded hover:bg-neutral-200">
                  <HighlighterIcon className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <p className="text-xs font-medium mb-2">Highlight / हाइलाइट</p>
                <div className="grid grid-cols-6 gap-1">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border hover:scale-110 transition"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    />
                  ))}
                </div>
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
            <ToolbarButton icon={ListIcon} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} tooltip="Bullet List / बुलेट लिस्ट" />
            <ToolbarButton icon={ListOrderedIcon} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} tooltip="Numbered List / क्रमांकित सूची" />
            <ToolbarButton icon={CheckSquareIcon} onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} tooltip="Task List / कार्य सूची" />
            <ToolbarButton icon={OutdentIcon} onClick={() => editor.chain().focus().liftListItem("listItem").run()} tooltip="Decrease Indent / इंडेंट घटाएं" />
            <ToolbarButton icon={IndentIcon} onClick={() => editor.chain().focus().sinkListItem("listItem").run()} tooltip="Increase Indent / इंडेंट बढ़ाएं" />
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
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <TableIcon className="size-4" /> Table / तालिका
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Enter Image URL / छवि URL दर्ज करें:")
                if (url) editor.chain().focus().setImage({ src: url }).run()
              }}
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <ImageIcon className="size-4" /> Picture / चित्र
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
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
              className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"
            >
              <MinusIcon className="size-4" /> Divider / विभाजक
            </button>
          </>
        )}

        {/* VIEW TAB */}
        {activeTab === "view" && (
          <>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search text... / टेक्स्ट खोजें..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="text-xs w-48 h-8"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="sm" variant="outline" onClick={handleSearch} className="h-8 bg-transparent">
                <SearchIcon className="size-4 mr-1" /> Find / खोजें
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
