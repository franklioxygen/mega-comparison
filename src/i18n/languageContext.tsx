import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define available languages
export type Language = 'en' | 'zh';

// Define context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => ''
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Import translations
import translations from './translations';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get saved language from localStorage or default to English
  const savedLanguage = localStorage.getItem('language') as Language;
  const [language, setLanguage] = useState<Language>(savedLanguage || 'en');

  // Function to change language
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 