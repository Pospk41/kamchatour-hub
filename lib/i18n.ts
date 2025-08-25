export const i18nNotSetupMessage = `i18n is not yet initialized`;

import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources: Resource = {
  ru: {
    translation: {
      app_name: 'Kamchatka Safe Tour',
      tabs: {
        home: 'Главная',
        culture: 'Культура',
        eco: 'Экология',
        booking: 'Бронирование',
        profile: 'Профиль',
        marketplace: 'Маркетплейс',
      },
      structure: 'Структура',
      actions: {
        open: 'Открыть',
        add_to_cart: 'Добавить в корзину',
        book_now: 'Забронировать',
      },
    },
  },
  en: {
    translation: {
      app_name: 'Kamchatka Safe Tour',
      tabs: {
        home: 'Home',
        culture: 'Culture',
        eco: 'Ecology',
        booking: 'Booking',
        profile: 'Profile',
        marketplace: 'Marketplace',
      },
      structure: 'Structure',
      actions: {
        open: 'Open',
        add_to_cart: 'Add to cart',
        book_now: 'Book now',
      },
    },
  },
};

export function initializeI18n(): Promise<void> {
  if (i18n.isInitialized) return Promise.resolve();
  return i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      compatibilityJSON: 'v4',
    })
    .then(() => undefined);
}

export default i18n;