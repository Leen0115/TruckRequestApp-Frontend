
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';

import ar from './locales/ar.json';
import en from './locales/en.json';
import ur from './locales/ur.json';

const i18n = new I18n({
  en,ar,ur
})
i18n.translations = { en, ar, ur };
i18n.fallbacks = true; //لو ما لقي الترجمة تلقائيا يرجع للانقلش

//تجيب اللغة المحفوظة وتثبتها
export const initLanguage = async () => {
  const storedLang = await AsyncStorage.getItem('appLang');
  const lang = storedLang||'en';
  i18n.locale = lang;
  return lang;
};
// تغير اللغة وتخزنها حتى بعد اغلاق التطبيق
export const setLanguage = async (langCode) => {
  i18n.locale = langCode;
  await AsyncStorage.setItem('appLang', langCode);
  
};

export default i18n;