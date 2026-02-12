import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorStore {
  editor: Editor | null;
  isPresentationMode: boolean; // Add this
  setEditor: (editor: Editor | null) => void;
  togglePresentationMode: () => void; // Add this
}

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  isPresentationMode: false, // Initial state
  setEditor: (editor) => set({ editor }),
  togglePresentationMode: () => set((state) => ({ isPresentationMode: !state.isPresentationMode })),
}));