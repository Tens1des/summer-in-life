import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MOCK_API=1 — локальная разработка без PHP/MySQL: истории живут в памяти dev-сервера.
const useMock = process.env.MOCK_API === '1'

const demoStories = [
  [55.86, 37.36, 'Деревня Озерки', 'Одним летом мне ужасно нравился Денис, и я решила эффектно пройти мимо него, размахивая пакетом с вещами. Пакет оказался дырявым, и всё содержимое — от купальника до бабушкиных огурцов — рассыпалось прямо у его ног. Денис молча помог собрать огурцы. Через неделю мы вместе ловили раков на старом мостике, а огурцы я с тех пор люблю.'],
  [55.7, 37.9, 'Люберцы', 'Каждое утро бегали на речку, пока взрослые спали. Самое вкусное в мире — хлеб с солью на берегу.'],
  [55.62, 37.45, 'Москва', 'Строили шалаш из веток и думали, что это навсегда.'],
  [55.9, 37.7, 'Мытищи', 'Ночевали в палатке на участке и считали падающие звёзды.'],
  [55.78, 37.6, 'Москва', 'Первый раз поехал на велосипеде без рук.'],
  [55.79, 37.62, 'Москва', 'Лето, когда мы с братом нашли ежа.'],
  [55.77, 37.64, 'Москва', 'Мороженое за 7 копеек и бесконечные вечера во дворе.'],
  [59.93, 30.33, 'Санкт-Петербург', 'Белые ночи и мосты — гуляли до утра.'],
  [56.86, 35.9, 'Тверь', 'Бабушкин огород и самая сладкая клубника.'],
]

function mockApi() {
  let nextId = 1
  const stories = demoStories.map(([lat, lng, place, comment]) => ({
    id: String(nextId++),
    lat,
    lng,
    place,
    comment,
    created_at: '2026-07-01 12:00:00',
  }))

  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api.php', (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        if (req.method === 'GET') {
          setTimeout(() => res.end(JSON.stringify({ ok: true, markers: stories })), 600)
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          const input = JSON.parse(body || '{}')
          const length = Array.from(String(input.comment || '').trim()).length
          let error = ''
          if (!length) error = 'Напишите короткое воспоминание.'
          else if (length > 300) error = 'Комментарий должен быть не длиннее 300 символов.'
          else if (String(input.name || '').trim().length < 2) error = 'Укажите имя.'
          else if (String(input.phone || '').replace(/\D/g, '').length < 10) error = 'Укажите корректный телефон.'
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(input.email || ''))) error = 'Укажите корректный e-mail.'
          else if (!input.agree_rules) error = 'Без согласия с правилами отправить не получится.'
          if (error) {
            res.statusCode = 422
            res.end(JSON.stringify({ ok: false, error }))
            return
          }
          setTimeout(() => {
            res.statusCode = 201
            res.end(
              JSON.stringify({
                ok: true,
                id: String(nextId++),
                status: 'pending',
                message:
                  'Спасибо! Она появится на карте после проверки. Авторы самых интересных воспоминаний смогут принять участие в конкурсе и выиграть памятные подарки.',
              }),
            )
          }, 900)
        })
      })
    },
  }
}

export default defineConfig({
  // GitHub Pages открывает сайт в подпапке /<repo>/ — путь задаётся при сборке
  base: process.env.BASE_PATH || '/',
  plugins: [react(), useMock && mockApi()].filter(Boolean),
  server: {
    port: 5173,
    proxy: useMock
      ? undefined
      : {
          '/api.php': {
            target: 'http://127.0.0.1:8766',
            changeOrigin: true,
          },
        },
  },
})
