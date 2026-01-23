import { create } from 'zustand';

type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'hi', // Default to Hindi
  setLanguage: (language) => set({ language }),
}));
