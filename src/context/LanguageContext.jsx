// src/contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
  },
  am: {
    code: 'am',
    name: 'አማርኛ',
    nativeName: 'አማርኛ',
    dir: 'ltr',
    flag: '🇪🇹',
  },
};

 const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en'; // Default to English
  });

  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    localStorage.setItem('language', language);
    setDirection(languages[language]?.dir || 'ltr');
    document.documentElement.dir = languages[language]?.dir || 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setLanguage(langCode);
    }
  };

  const value = {
    language,
    direction,
    changeLanguage,
    languages,
    t: (key, options = {}) => {
      // This will be handled by i18next
      return key;
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

