import { create } from 'zustand';

export type Language = {
  code: string;
  name: string;
};

type LanguageStore = {
  language: Language;
  supportedLanguages: Language[];
  setLanguage: (language: Language) => void;
};

const supportedLanguages: Language[] = [
    { code: 'en-IN', name: 'English' },
    { code: 'as', name: 'Assamese' },
    { code: 'bn', name: 'Bengali' },
    { code: 'gu', name: 'Gujarati' },
{ code: 'hi', name: 'Hindi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ne', name: 'Nepali' },
    { code: 'or', name: 'Oriya' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'si', name: 'Sinhala' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ur', name: 'Urdu' },
];

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: { code: 'en-IN', name: 'English' }, // Default to Hindi
  supportedLanguages,
  setLanguage: (language) => set({ language }),
}));
