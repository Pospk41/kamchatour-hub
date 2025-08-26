# Kamchatka Aggregator (MVP)

Мобильное приложение‑агрегатор туров по Камчатке (React Native, Expo). Основано на материалах из Word‑файлов (аналитика, UX‑макеты, ЛК, доска).

## Запуск

1. Установите зависимости:
```
cd kamchatka-aggregator
npm install
```
2. Запустите проект:
```
npm run android
# или
npm run web
```

## Структура
- `App.js` — стек‑навигация, экраны
- `src/constants/data.ts` — мок‑данные: ALL_ACTIVITIES, AD_CATEGORIES, MOCK_ADS
- `src/screens/ui/*` — экраны (Home, Activities, Bulletin, Profile, Emergency, OfflineMaps)

## Следующие шаги
- Подключить Supabase (auth, таблицы tours/bookings/ads)
- Перенести данные из моков в БД
- Добавить фильтры и бронирование
- Экстренные контакты и офлайн‑карты — интеграция

## Supabase
Установлены зависимости `@supabase/supabase-js`, полифиллы `react-native-url-polyfill`, `react-native-get-random-values`, хранилище `@react-native-async-storage/async-storage`.

- Настройка:
  - Скопируйте `.env.example` в `.env` и заполните `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
  - Клиент: `src/lib/supabase.ts`.

## Env
Создайте `.env` на базе `.env.example` (после добавления Supabase).