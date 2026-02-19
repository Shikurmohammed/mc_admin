// src/hooks/useTranslation.js
import { useTranslation as useI18NextTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18NextTranslation();

  const translate = (key, options = {}) => {
    return t(key, options);
  };

  return {
    t: translate,
    i18n,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    dir: i18n.language === 'am' ? 'ltr' : 'ltr', // Both are LTR
  };
};