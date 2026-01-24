import { create } from "zustand"
import type { Editor } from "@tiptap/react"

interface EditorStore {
  editor: Editor | null
  setEditor: (editor: Editor | null) => void

  zoom: number
  setZoom: (zoom: number) => void

  wideMode: boolean
  toggleWideMode: () => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),

  zoom: 100,
  setZoom: (zoom) => set({ zoom }),

  wideMode: false,
  toggleWideMode: () => set((state) => ({ wideMode: !state.wideMode })),
}))
