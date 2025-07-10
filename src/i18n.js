import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import tr from './locales/tr.json'
import zh from './locales/zh.json'


const messages = {
  en,
  fr,
  de,
  tr,
  zh
}

// getting saved language or default to browser language
const savedLocale = localStorage.getItem('userLocale');
const browserLocale = navigator.language.split('-')[0];
const defaultLocale = Object.keys(messages).includes(browserLocale) ? 
browserLocale : 'en';

const initialLocale = savedLocale || defaultLocale;

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n