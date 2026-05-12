import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations } from '../translations';

export type Language = 'bg' | 'en';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  toggleLanguage: () => {},
  t: () => '',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'bg' || saved === 'en') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => setLanguage((l) => (l === 'bg' ? 'en' : 'bg'));

  const t = (section: string, key: string): string => {
    const sectionData = (translations as Record<string, Record<string, Record<string, string>>>)[section];
    if (!sectionData) return key;
    const entry = sectionData[key];
    if (!entry) return key;
    return entry[language] || key;
  };

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);