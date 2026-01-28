"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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
  Languages,
  FileJson,
  FileType,
  FileCode,
  // 👇 NEW ICONS IMPORTED
  SpellCheck, 
  Sparkles 
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
import { translateText } from "@/lib/translate"

import { asBlob } from "html-docx-js-typescript"
import { saveAs } from "file-saver"
// @ts-ignore
import html2pdf from "html2pdf.js"

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
  
  // 👇 New States for the features
  const [isGrammarOn, setIsGrammarOn] = useState(true)
  const [isAutocompleteOn, setIsAutocompleteOn] = useState(true)

  const [searchText, setSearchText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
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

  // --- DOWNLOAD FUNCTIONS ---
  const onDownloadDocx = useCallback(() => {
    if (!editor) return
    const htmlContent = editor.getHTML()
    const docContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>body { font-family: 'Mangal', 'Noto Sans Devanagari', sans-serif; }</style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `
    asBlob(docContent).then((data: any) => {
      saveAs(data as Blob, "BharatDocs_Document.docx")
    })
  }, [editor])

  const onDownloadPdf = useCallback(() => {
    const element = document.querySelector(".ProseMirror") as HTMLElement
    if (!element) return
    const opt = {
      margin: 1,
      filename: "BharatDocs_Document.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in" as const, format: "letter" as const, orientation: "portrait" as const },
    }
    html2pdf().set(opt).from(element).save()
  }, [])

  const onDownloadHtml = useCallback(() => {
    const content = editor?.getHTML() || ""
    const blob = new Blob(
      [`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${content}</body></html>`],
      { type: "text/html" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "BharatDocs_Document.html"
    a.click()
    URL.revokeObjectURL(url)
  }, [editor])

  // --- EXISTING HANDLERS ---
  const handleVoiceTyping = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported.")
      return
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition;
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
      setIsListening(false)
    }
    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null;
    }
    recognition.start()
  }, [editor, isListening, language])

  const handleTranslate = useCallback(async () => {
    if (!editor) return;
    const text = editor.getText();
    if (!text) return;
    try {
      const translatedText = await translateText(text, 'en', language.code);
      editor.chain().focus().setContent(translatedText).run();
    } catch (error) {
      console.error("Translation failed", error);
      alert("Translation failed. Please try again.");
    }
  }, [editor, language]);

  const handleReadAloud = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported.")
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
      printWindow.document.write(`<html><body>${content}</body></html>`)
      printWindow.document.close()
      printWindow.print()
    }
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
    if (!found) alert("Text not found")
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

  const ToolbarButton = ({ icon: Icon, onClick, active = false, tooltip, disabled = false }: any) => (
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
        <TooltipContent side="bottom" className="text-xs">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="flex flex-col bg-[#F1F4F9] border-b border-neutral-300 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a5276] text-white">
        <div className="flex items-center gap-3">
          <FileTextIcon className="size-6" />
          <span className="font-semibold text-lg">भारतीय वर्ड प्रोसेसर</span>
        </div>
        <span className="text-xs opacity-80 tracking-wide">INDIAN WORD PROCESSOR</span>
      </div>

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

      <div className="flex items-center gap-x-2 px-3 py-2 min-h-[52px] bg-white border-t border-neutral-200 flex-wrap">
        {/* FILE TAB */}
        {activeTab === "file" && (
          <>
            <button onClick={() => { editor.chain().focus().clearContent().run(); editor.chain().focus().setContent("<p></p>").run() }} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"><FilePlusIcon className="size-4" /> New / नया</button>
            <button className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"><FolderOpenIcon className="size-4" /> Open / खोलें</button>
            <button onClick={onDownloadHtml} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"><SaveIcon className="size-4" /> Save / सहेजें</button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <button onClick={handlePrint} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"><PrinterIcon className="size-4" /> Print / प्रिंट</button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50 hover:bg-white hover:border-[#1a5276] transition"><DownloadIcon className="size-4" /> Download / डाउनलोड</button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <p className="text-xs font-medium mb-2 text-neutral-500">Select Format / प्रारूप चुनें</p>
                <div className="flex flex-col gap-1">
                  <button onClick={onDownloadDocx} className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded text-sm text-left"><FileType className="size-4 text-blue-600" /> Word (.docx)</button>
                  <button onClick={onDownloadPdf} className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded text-sm text-left"><FileJson className="size-4 text-red-600" /> PDF (.pdf)</button>
                  <Separator className="my-1" />
                  <button onClick={onDownloadHtml} className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded text-sm text-left"><FileCode className="size-4 text-green-600" /> HTML (.html)</button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}

        {/* HOME TAB - UPDATED WITH SPELL CHECK & AUTOCOMPLETE */}
        {activeTab === "home" && (
          <>
            <ToolbarButton icon={Undo2Icon} onClick={() => editor.chain().focus().undo().run()} tooltip="Undo / पूर्ववत" disabled={!editor.can().undo()} />
            <ToolbarButton icon={Redo2Icon} onClick={() => editor.chain().focus().redo().run()} tooltip="Redo / फिर से" disabled={!editor.can().redo()} />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton icon={ScissorsIcon} onClick={() => document.execCommand("cut")} tooltip="Cut / काटें" />
            <ToolbarButton icon={CopyIcon} onClick={() => document.execCommand("copy")} tooltip="Copy / कॉपी" />
            <ToolbarButton icon={ClipboardIcon} onClick={() => document.execCommand("paste")} tooltip="Paste / चिपकाएं" />
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} className="bg-neutral-50 border text-xs p-1.5 rounded min-w-[150px] font-medium focus:border-[#1a5276] focus:outline-none" value={editor.getAttributes("textStyle").fontFamily || "Mangal"}>
              {indianFonts.map((font) => (<option key={font.value} value={font.value}>{font.label}</option>))}
            </select>
            <select onChange={(e) => { const selectedLang = supportedLanguages.find(lang => lang.code === e.target.value); if (selectedLang) setLanguage(selectedLang); }} className="bg-neutral-50 border text-xs p-1.5 rounded min-w-[150px] font-medium focus:border-[#1a5276] focus:outline-none" value={language.code}>
              {supportedLanguages.map((lang) => (<option key={lang.code} value={lang.code}>{lang.name}</option>))}
            </select>
            
            <ToolbarButton icon={Languages} onClick={handleTranslate} tooltip="Translate Selection / अनुवाद" />
            
            <select onChange={(e) => { const size = e.target.value; editor.chain().focus().setMark("textStyle", { fontSize: `${size}px` }).run() }} className="bg-neutral-50 border text-xs p-1.5 rounded w-[65px] font-medium focus:border-[#1a5276] focus:outline-none" defaultValue="14">
              {FONT_SIZES.map((size) => (<option key={size} value={size}>{size}</option>))}
            </select>
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Formatting Tools */}
            <Popover>
              <PopoverTrigger asChild><button type="button" className="p-1.5 rounded hover:bg-neutral-200 relative"><TypeIcon className="size-4" /><div className="absolute bottom-0.5 left-1 right-1 h-1 rounded-full" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000" }} /></button></PopoverTrigger>
              <PopoverContent className="w-48 p-2"><div className="grid grid-cols-6 gap-1">{TEXT_COLORS.map((color) => (<button key={color} className="w-6 h-6 rounded border" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().setColor(color).run()} />))}</div></PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild><button type="button" className="p-1.5 rounded hover:bg-neutral-200"><HighlighterIcon className="size-4" /></button></PopoverTrigger>
              <PopoverContent className="w-48 p-2"><div className="grid grid-cols-6 gap-1">{HIGHLIGHT_COLORS.map((color) => (<button key={color} className="w-6 h-6 rounded border" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().toggleHighlight({ color }).run()} />))}</div></PopoverContent>
            </Popover>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton icon={BoldIcon} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} tooltip="Bold" />
            <ToolbarButton icon={ItalicIcon} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} tooltip="Italic" />
            <ToolbarButton icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} tooltip="Underline" />
            <ToolbarButton icon={StrikethroughIcon} onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} tooltip="Strike" />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton icon={AlignLeftIcon} onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} tooltip="Left" />
            <ToolbarButton icon={AlignCenterIcon} onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} tooltip="Center" />
            <ToolbarButton icon={AlignRightIcon} onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} tooltip="Right" />
            <ToolbarButton icon={AlignJustifyIcon} onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} tooltip="Justify" />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton icon={ListIcon} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} tooltip="Bullet List" />
            <ToolbarButton icon={ListOrderedIcon} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} tooltip="Ordered List" />
            <ToolbarButton icon={CheckSquareIcon} onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} tooltip="Task List" />
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* 🆕 SMART FEATURES SECTION */}
            <div className="flex items-center gap-1 bg-yellow-50 px-1 rounded border border-yellow-200">
               <ToolbarButton
                icon={Mic}
                onClick={handleVoiceTyping}
                active={isListening}
                tooltip={isListening ? "Listening..." : "Voice Type / बोलकर लिखें"}
              />
              <ToolbarButton
                icon={Volume2Icon}
                onClick={handleReadAloud}
                active={isSpeaking}
                tooltip="Read Aloud / पढ़कर सुनाएं"
              />
              {/* SPELL CHECK TOGGLE */}
              <ToolbarButton 
                icon={SpellCheck}
                active={isGrammarOn}
                onClick={() => {
                  setIsGrammarOn(!isGrammarOn)
                  // Note: True disabling requires updating the extension logic
                  alert(`Grammar Check is now ${!isGrammarOn ? 'Active' : 'Paused'} (Status only)`)
                }}
                tooltip="Grammar Check / व्याकरण जाँच"
              />
              {/* SMART AUTOCOMPLETE TOGGLE */}
              <ToolbarButton 
                icon={Sparkles}
                active={isAutocompleteOn}
                onClick={() => {
                  setIsAutocompleteOn(!isAutocompleteOn)
                  alert(`Smart Autocomplete is now ${!isAutocompleteOn ? 'Active' : 'Paused'} (Status only)`)
                }}
                tooltip="Smart Suggestions / सुझाव"
              />
            </div>

          </>
        )}

        {/* INSERT & VIEW TABS (Keeping them compact for you) */}
        {activeTab === "insert" && (
          <>
            <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50"><TableIcon className="size-4" /> Table</button>
            <button onClick={() => { const url = window.prompt("Image URL:"); if (url) editor.chain().focus().setImage({ src: url }).run() }} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50"><ImageIcon className="size-4" /> Picture</button>
            <Popover>
              <PopoverTrigger asChild><button className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50"><Link2Icon className="size-4" /> Link</button></PopoverTrigger>
              <PopoverContent className="w-72 p-3"><div className="flex gap-2"><Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." /><Button size="sm" onClick={setLink}>Add</Button></div></PopoverContent>
            </Popover>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded bg-neutral-50"><MinusIcon className="size-4" /> Divider</button>
          </>
        )}
        {activeTab === "view" && (
          <div className="flex items-center gap-2">
            <Input placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="text-xs w-48 h-8" onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <Button size="sm" variant="outline" onClick={handleSearch} className="h-8"><SearchIcon className="size-4 mr-1" /> Find</Button>
          </div>
        )}
      </div>
    </div>
  )
}