export const AFISHA_URL =
  'https://www.afisha.ru/movie/luchshee-leto-v-zhizni-1004334/'

// Трейлер пока ведёт на страницу фильма на Афише — замените ссылкой на ролик, когда он будет.
export const TRAILER_URL = AFISHA_URL

export const MAP_DEFAULT = {
  lat: 55.751244,
  lng: 37.618423,
  zoom: 10,
}

export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// Подпись выбранной точки («Выбранная точка: Озерки») — обратное геокодирование OSM Nominatim.
export const GEOCODER_URL = 'https://nominatim.openstreetmap.org/reverse'

// Относительный путь: api.php лежит рядом с index.html
export const API_URL = 'api.php'

// Демо-сборка (GitHub Pages): без PHP, истории хранятся в браузере
export const DEMO_MODE = import.meta.env.VITE_DEMO === '1'

export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`

export const MAX_STORY_LENGTH = 300
export const MIN_STORY_LENGTH = 10
