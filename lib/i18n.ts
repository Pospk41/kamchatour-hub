import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../assets/translations/en.json';
import ru from '../assets/translations/ru.json';

const resources = { en: { translation: en }, ru: { translation: ru } } as const;

const locales = getLocales();
const languageTag = locales[0]?.languageTag ?? 'en';

i18n.use(initReactI18next).init({
	resources,
	lng: languageTag,
	fallbackLng: 'en',
	interpolation: { escapeValue: false },
});

export default i18n;

