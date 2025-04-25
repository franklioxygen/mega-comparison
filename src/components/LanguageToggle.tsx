import React from 'react';
import { Language, useLanguage } from '../i18n/languageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'zh' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
    >
      {t(`language.${language === 'en' ? 'zh' : 'en'}`)}
    </button>
  );
};

export default LanguageToggle; 