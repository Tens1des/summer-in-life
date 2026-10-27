# Лучшее лето в жизни — карта воспоминаний

React (Vite) фронтенд по макету Figma + PHP/MySQL бэкенд с премодерацией (механика из архива `lookdigital.ru/sand/2gis`).

**Демо:** https://tens1des.github.io/summer-in-life/ — сборка без сервера: истории демонстрационные,
отправка формы показывает сценарий премодерации, но никуда не сохраняется.

## Локально

```bash
npm install

# Только фронт, API замокан в памяти dev-сервера (MySQL не нужен)
npm run dev:mock

# Фронт + настоящий PHP API (нужна MySQL из backend/config.php)
npm run api
npm run dev
```

Перед запуском с PHP: `cp backend/config.example.php backend/config.php` и впишите доступы к MySQL
и пароль админки. `config.php` в репозиторий не попадает.

Открой http://127.0.0.1:5173. Админка премодерации: `http://127.0.0.1:8766/admin.php`.

## Сборка и выкладка

```bash
npm run build
```

`dist/` — готовая папка для хостинга: статика + `api.php`, `admin.php`, `db.php`, `config.php`, `install.sql`.

`npm run build:demo` — демо-сборка без бэкенда (её же GitHub Actions выкладывает на Pages при пуше в `main`).
Фронт ходит в `/api.php` рядом с `index.html`.

При первом запросе `db.php` сам создаёт таблицу `stories` и докидывает новые колонки
`place` (подпись точки), `allow_ads` (согласие с правилами конкурса), `author_name`, `phone`, `email`
(контакты автора — видны только в админке, публичный API их не отдаёт) в уже существующую таблицу.

## Что где

- Две страницы (Vite multi-page): `index.html` — карта лучшего лета, `time/index.html` — «Время для себя».
  Ссылки между ними — `PAGES` в `src/config.js`, меню — `src/components/Header.jsx`.
- `src/TimeApp.jsx`, `src/components/time/`, `src/styles/time.css` — страница «Время для себя».
- `src/components/StoryMap.jsx` — карта: пины, кластеры, карточка истории, форма, ошибки, успех, «На проверке».
- `src/config.js` — ссылка на Афишу, трейлер, центр карты, тайлы, лимиты текста.
- `src/styles/app.css` — вся вёрстка (Desktop 1440 / Mobile 375 по Figma).
- `backend/` — PHP API и админка.
- `design/` — скриншоты макета для сверки.

## Заметки

- Карта — OpenStreetMap с CSS-стилизацией под палитру макета. Для крупной кампании лучше
  коммерческий провайдер тайлов: поменять `OSM_TILE_URL` в `src/config.js`.
- Подпись «Выбранная точка: …» берётся из OSM Nominatim (обратное геокодирование).
- Кнопка «Смотреть трейлер» пока ведёт на страницу фильма на Афише — `TRAILER_URL` в `src/config.js`.
- Картинки «Время для себя» `village.jpg`, `tour-*.jpg`, `map-illustration.jpg` в `public/assets/` — временные,
  вырезаны из скриншота макета 1x (Figma MCP упёрся в лимит тарифа). Заменить экспортом из Figma в 2x
  с теми же именами файлов. В `map-illustration.jpg` слева «запечена» белая карточка — в экспорте её быть не должно.
