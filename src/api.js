import { API_URL, DEMO_MODE } from './config'

const SUCCESS_MESSAGE =
  'Спасибо! Она появится на карте после проверки. Авторы самых интересных воспоминаний смогут принять участие в конкурсе и выиграть памятные подарки.'

const DEMO_STORIES = [
  [55.86, 37.36, 'Деревня Озерки', 'Одним летом мне ужасно нравился Денис, и я решила эффектно пройти мимо него, размахивая пакетом с вещами. Пакет оказался дырявым, и всё содержимое — от купальника до бабушкиных огурцов — рассыпалось прямо у его ног. Денис молча помог собрать огурцы. Через неделю мы вместе ловили раков на старом мостике, а огурцы я с тех пор люблю.'],
  [55.7, 37.9, 'Люберцы', 'Каждое утро бегали на речку, пока взрослые спали. Самое вкусное в мире — хлеб с солью на берегу.'],
  [55.62, 37.45, 'Москва', 'Строили шалаш из веток и думали, что это навсегда.'],
  [55.9, 37.7, 'Мытищи', 'Ночевали в палатке на участке и считали падающие звёзды.'],
  [55.78, 37.6, 'Москва', 'Первый раз поехал на велосипеде без рук.'],
  [55.79, 37.62, 'Москва', 'Лето, когда мы с братом нашли ежа.'],
  [55.77, 37.64, 'Москва', 'Мороженое за 7 копеек и бесконечные вечера во дворе.'],
  [59.93, 30.33, 'Санкт-Петербург', 'Белые ночи и мосты — гуляли до утра.'],
  [56.86, 35.9, 'Тверь', 'Бабушкин огород и самая сладкая клубника.'],
].map(([lat, lng, place, comment], i) => ({ id: `demo-${i + 1}`, lat, lng, place, comment }))

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchStories() {
  if (DEMO_MODE) {
    await wait(500)
    return DEMO_STORIES
  }
  const response = await fetch(API_URL, { cache: 'no-store' })
  const data = await response.json()
  if (!response.ok || !data.ok) throw new Error(data.error || 'Не удалось загрузить истории.')
  return data.markers || []
}

export async function submitStory(payload) {
  if (DEMO_MODE) {
    // В демо истории никуда не отправляются — просто показываем сценарий премодерации
    await wait(900)
    return { ok: true, id: `local-${Date.now()}`, status: 'pending', message: SUCCESS_MESSAGE }
  }
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.ok) throw new Error(data.error || 'Не удалось сохранить историю.')
  return data
}
