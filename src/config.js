export const AFISHA_URL =
  'https://www.afisha.ru/movie/luchshee-leto-v-zhizni-1004334/'

// Трейлер пока ведёт на страницу фильма на Афише — замените ссылкой на ролик, когда он будет.
export const TRAILER_URL = AFISHA_URL

export const MAP_DEFAULT = {
  lat: 55.751244,
  lng: 37.618423,
  zoom: 6,
}

export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// Подпись выбранной точки («Выбранная точка: Озерки») — обратное геокодирование OSM Nominatim.
export const GEOCODER_URL = 'https://nominatim.openstreetmap.org/reverse'

// Относительный путь: api.php лежит рядом с index.html
export const API_URL = 'api.php'

// Демо-сборка (GitHub Pages): без PHP, истории хранятся в браузере
export const DEMO_MODE = import.meta.env.VITE_DEMO === '1'

export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`

// Страницы сайта: главная с картой и «Время для себя» (отдельная точка входа Vite — time/index.html)
// Прод-сборка только с картой: пункт «Время для себя» в меню скрыт
export const SINGLE_PAGE = import.meta.env.VITE_SINGLE_PAGE === '1'

// Яндекс.Метрика (есть только в прод-сборке)
export const YM_ID = Number(import.meta.env.VITE_YM_ID) || 0

export function reachGoal(goal) {
  if (YM_ID && typeof window.ym === 'function') window.ym(YM_ID, 'reachGoal', goal)
}

// Клик по любой ссылке с data-goal="…" отправляет эту цель в Метрику (кнопки «Купить билеты» → buy_ticket)
export function trackGoalClicks() {
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('[data-goal]') : null
    if (link) reachGoal(link.dataset.goal)
  }, true)
}

// Документы конкурса (лежат на сервере в /docs/ рядом с index.html)
export const DOCS = {
  consent: `${import.meta.env.BASE_URL}docs/consent.pdf`,
  rules: `${import.meta.env.BASE_URL}docs/rules.pdf`,
}

export const PAGES = {
  map: import.meta.env.BASE_URL,
  time: `${import.meta.env.BASE_URL}time/`,
}

export const MAX_STORY_LENGTH = 300
export const MIN_STORY_LENGTH = 10

// Попап «Победители конкурса». На тесте (GitHub Pages, демо-сборка) показывается всегда,
// в прод-сборке — с VITE_WINNERS=1 (включён в build:prod и build:prod:map; убрать, чтобы скрыть попап).
export const SHOW_WINNERS = DEMO_MODE || import.meta.env.VITE_WINNERS === '1'

// Пять победителей (почты скрыты звёздочками).
export const WINNERS = {
  date: '25 ноября 2026',
  list: [
    { email: 'pre***********@gmail.com' },
    { email: 'myp******@mail.ru' },
    { email: 'ska*******@mail.ru' },
    { email: 'g.r**********@gmail.com' },
    { email: 'liz********@gmail.com' },
  ],
}
