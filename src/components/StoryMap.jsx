import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import {
  AFISHA_URL,
  GEOCODER_URL,
  MAP_DEFAULT,
  MAX_STORY_LENGTH,
  MIN_STORY_LENGTH,
  OSM_TILE_URL,
} from '../config'
import { fetchStories, submitStory } from '../api'
import { asset } from '../config'
import { Button } from './Button'
import { Check, Close, Spinner } from './Icons'

const SHORT_LENGTH = 140

const pinIcon = L.divIcon({
  className: 'map-icon',
  html: `<img class="pin" src="${asset('pin.svg')}" alt="" draggable="false">`,
  iconSize: [64, 64],
  iconAnchor: [32, 28],
})

const activeIcon = L.divIcon({
  className: 'map-icon',
  html: `<img class="pin-active" src="${asset('pin-active.svg')}" alt="" draggable="false">`,
  iconSize: [76, 101],
  iconAnchor: [38, 92],
})

const newPointIcon = L.divIcon({
  className: 'map-icon',
  html: `<div class="pin-new">
      <span class="pin-new-shadow"></span>
      <svg viewBox="0 0 48 62" width="48" height="62"><path d="M24 60S46 40.6 46 22A22 22 0 0 0 2 22c0 18.6 22 38 22 38Z" fill="#141414"/><circle cx="24" cy="22" r="8" fill="#FFD84D"/></svg>
    </div>`,
  iconSize: [48, 62],
  iconAnchor: [24, 60],
})

const pendingIcon = L.divIcon({
  className: 'map-icon',
  html: `<div class="pin-pending">
      <svg viewBox="0 0 48 62" width="44" height="57"><path d="M24 58S45 39.6 45 22A21 21 0 0 0 3 22c0 17.6 21 36 21 36Z" fill="#fff" stroke="#FFD84D" stroke-width="3"/><circle cx="24" cy="22" r="7" fill="#FFD84D"/></svg>
      <span class="pin-pending-label">На проверке</span>
    </div>`,
  iconSize: [44, 57],
  iconAnchor: [22, 55],
})

function clusterIcon(cluster) {
  const count = cluster.getChildCount()
  const size = count < 10 ? 50 : count < 100 ? 56 : 64
  return L.divIcon({
    className: 'map-icon',
    html: `<div class="pin-cluster" style="width:${size}px;height:${size}px"><span>${count}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function charCount(text) {
  return Array.from(text).length
}

function truncate(text, max = SHORT_LENGTH) {
  const chars = Array.from(text)
  if (chars.length <= max) return { short: text, truncated: false }
  return { short: `${chars.slice(0, max).join('').trimEnd()}…`, truncated: true }
}

function formatCoords({ lat, lng }) {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

async function reverseGeocode({ lat, lng }, signal) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
    zoom: '14',
    'accept-language': 'ru',
  })
  const response = await fetch(`${GEOCODER_URL}?${params}`, { signal })
  if (!response.ok) throw new Error('geocoder')
  const data = await response.json()
  const a = data.address || {}
  return (
    a.village ||
    a.hamlet ||
    a.town ||
    a.city ||
    a.suburb ||
    a.municipality ||
    a.county ||
    a.state ||
    data.name ||
    ''
  )
}

/* ---------- Внутренние компоненты карты ---------- */

function MapEvents({ onPick, onMove }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng)
    },
    move: onMove,
    zoom: onMove,
    resize: onMove,
  })
  return null
}

function ZoomButtons() {
  const map = useMap()
  const ref = useRef(null)

  useEffect(() => {
    // Клики по кнопкам не должны доходить до карты (иначе открывается форма)
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current)
      L.DomEvent.disableScrollPropagation(ref.current)
    }
  }, [])

  return (
    <div className="map-zoom" ref={ref}>
      <button type="button" aria-label="Приблизить" onClick={() => map.zoomIn()}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" /></svg>
      </button>
      <button type="button" aria-label="Отдалить" onClick={() => map.zoomOut()}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11" /></svg>
      </button>
    </div>
  )
}

function ClusterLayer({ markers, activeId, onSelect }) {
  const map = useMap()
  const groupRef = useRef(null)
  const layersRef = useRef(new Map())

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 56,
      iconCreateFunction: clusterIcon,
    })
    groupRef.current = group
    map.addLayer(group)
    return () => {
      map.removeLayer(group)
      groupRef.current = null
    }
  }, [map])

  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    group.clearLayers()
    layersRef.current.clear()
    const layers = markers
      .filter((m) => Number.isFinite(Number(m.lat)) && Number.isFinite(Number(m.lng)))
      .map((m) => {
        const layer = L.marker([Number(m.lat), Number(m.lng)], {
          icon: pinIcon,
          keyboard: true,
          title: m.place ? `История: ${m.place}` : 'Летнее воспоминание',
        })
        layer.on('click', (event) => {
          L.DomEvent.stop(event)
          onSelect(m)
        })
        layersRef.current.set(m.id, layer)
        return layer
      })
    group.addLayers(layers)
  }, [markers, onSelect])

  // Активная история: её пин убираем из кластера и рисуем отдельным «сердечком»
  useEffect(() => {
    const layer = activeId ? layersRef.current.get(activeId) : null
    if (!layer) return undefined
    layer.setOpacity(0)
    return () => layer.setOpacity(1)
  }, [activeId, markers])

  return null
}

// Источник карты (обязателен по лицензии OSM) — свёрнут в кнопку «i», раскрывается по нажатию
function MapCredits() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ref.current) L.DomEvent.disableClickPropagation(ref.current)
  }, [])

  return (
    <div className={`map-credits ${open ? 'is-open' : ''}`} ref={ref}>
      {open ? (
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          © OpenStreetMap
        </a>
      ) : null}
      <button type="button" aria-label="Источник карты" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        i
      </button>
    </div>
  )
}

/* ---------- Основной компонент ---------- */

export function StoryMap() {
  const mapRef = useRef(null)
  const shellRef = useRef(null)
  const textareaRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [markers, setMarkers] = useState([])
  const [pendingPins, setPendingPins] = useState([])

  const [story, setStory] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [cardPos, setCardPos] = useState(null)

  const [point, setPoint] = useState(null) // { lat, lng }
  const [place, setPlace] = useState('')
  const [comment, setComment] = useState('')
  const [agreeRules, setAgreeRules] = useState(false)
  const [agreeAds, setAgreeAds] = useState(false)
  const [touched, setTouched] = useState(false)
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [wheelHint, setWheelHint] = useState(false)

  /*
   * Колесо/тачпад: щипок на тачпаде (приходит как wheel + ctrlKey) и Ctrl/⌘ + колесо масштабируют карту,
   * обычная прокрутка листает страницу и показывает подсказку — карта не «перехватывает» скролл.
   */
  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined
    let timer
    function onWheel(event) {
      if (event.ctrlKey || event.metaKey) return
      event.stopPropagation()
      setWheelHint(true)
      clearTimeout(timer)
      timer = setTimeout(() => setWheelHint(false), 1400)
    }
    shell.addEventListener('wheel', onWheel, { capture: true, passive: true })
    return () => {
      clearTimeout(timer)
      shell.removeEventListener('wheel', onWheel, { capture: true })
    }
  }, [])

  /* Загрузка опубликованных историй */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const markers = await fetchStories()
        if (!cancelled) setMarkers(markers)
      } catch (err) {
        console.error('Markers load error', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /* Подпись выбранной точки */
  useEffect(() => {
    if (!point) return undefined
    const controller = new AbortController()
    setPlace('')
    const timer = setTimeout(() => {
      reverseGeocode(point, controller.signal)
        .then((name) => setPlace(name))
        .catch(() => {})
    }, 350)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [point])

  /* Позиция карточки истории над пином (десктоп) */
  const updateCardPos = useCallback(() => {
    const map = mapRef.current
    if (!map || !story) return
    const p = map.latLngToContainerPoint([Number(story.lat), Number(story.lng)])
    setCardPos({ x: p.x, y: p.y })
  }, [story])

  useEffect(() => {
    updateCardPos()
  }, [updateCardPos, expanded])

  /* Валидация */
  const length = charCount(comment.trim())
  const textError =
    length > MAX_STORY_LENGTH
      ? 'Слишком длинно'
      : touched && length < MIN_STORY_LENGTH
        ? 'Напишите хотя бы пару предложений'
        : ''
  const rulesError = touched && !agreeRules ? 'Без согласия с правилами отправить не получится' : ''
  const ready = length >= MIN_STORY_LENGTH && length <= MAX_STORY_LENGTH && agreeRules

  /* Сценарии */
  const closeAll = useCallback(() => {
    setStory(null)
    setPoint(null)
    setSuccess(null)
    setExpanded(false)
    setServerError('')
  }, [])

  const openForm = useCallback(
    (latlng) => {
      if (submitting) return
      setStory(null)
      setSuccess(null)
      setPoint({ lat: latlng.lat, lng: latlng.lng })
      setServerError('')
      setTouched(false)

      // Не даём форме перекрыть выбранную точку
      const map = mapRef.current
      if (!map) return
      const size = map.getSize()
      const p = map.latLngToContainerPoint(latlng)
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (isMobile && p.y > size.y * 0.3) {
        map.panBy([0, p.y - size.y * 0.22], { animate: true })
      } else if (!isMobile && p.x > size.x - 440 && p.y < 500) {
        map.panBy([p.x - (size.x - 480), 0], { animate: true })
      }
    },
    [submitting],
  )

  const selectStory = useCallback((marker) => {
    setPoint(null)
    setSuccess(null)
    setExpanded(false)
    setStory(marker)
    const map = mapRef.current
    if (map) {
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      const target = map.project([Number(marker.lat), Number(marker.lng)])
      // На десктопе освобождаем место над пином под карточку, на мобильном — над шторкой
      const shifted = target.subtract([0, isMobile ? -140 : 150])
      map.panTo(map.unproject(shifted), { animate: true })
    }
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeAll])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!point || submitting) return
    setTouched(true)
    if (!ready) {
      if (length < MIN_STORY_LENGTH || length > MAX_STORY_LENGTH) textareaRef.current?.focus()
      return
    }

    setSubmitting(true)
    setServerError('')
    try {
      const data = await submitStory({
        comment: comment.trim(),
        lat: point.lat,
        lng: point.lng,
        place,
        agree_rules: agreeRules,
        allow_ads: agreeAds,
      })

      setPendingPins((pins) => [...pins, { id: data.id || String(Date.now()), ...point }])
      setPoint(null)
      setComment('')
      setAgreeRules(false)
      setAgreeAds(false)
      setTouched(false)
      setSuccess(
        data.message ||
          'Спасибо! Она появится на карте после проверки. Самые интересные воспоминания мы можем выбрать для наружной рекламы фильма.',
      )
    } catch (err) {
      setServerError(err.message || 'Не удалось сохранить историю.')
    } finally {
      setSubmitting(false)
    }
  }

  const storyView = story ? truncate(story.comment || '') : null
  const placeLabel = place || (point ? formatCoords(point) : '')

  const hint = loading
    ? { text: 'Загружаем карту воспоминаний…', loading: true }
    : point
      ? { text: 'Точка выбрана — передвиньте её, если нужно' }
      : !story && !success
        ? { text: 'Нажмите на карту, чтобы добавить историю' }
        : null

  const newPointHandlers = useMemo(
    () => ({
      dragend(event) {
        const ll = event.target.getLatLng()
        setPoint({ lat: ll.lat, lng: ll.lng })
      },
      click(event) {
        L.DomEvent.stop(event)
      },
    }),
    [],
  )

  const cardStyle =
    cardPos && shellRef.current
      ? (() => {
          const width = shellRef.current.clientWidth
          const cardWidth = 330
          const left = Math.min(Math.max(cardPos.x - cardWidth / 2 + 15, 20), width - cardWidth - 20)
          return { left, top: cardPos.y - 86, transform: 'translateY(-100%)' }
        })()
      : undefined

  return (
    <div className={`map-shell ${point || story || success ? 'has-panel' : ''}`} ref={shellRef}>
      <MapContainer
        ref={mapRef}
        className="map-canvas"
        center={[MAP_DEFAULT.lat, MAP_DEFAULT.lng]}
        zoom={MAP_DEFAULT.zoom}
        minZoom={3}
        maxZoom={18}
        worldCopyJump
        zoomControl={false}
        attributionControl={false}
        dragging
        touchZoom
        scrollWheelZoom
        wheelPxPerZoomLevel={90}
        zoomSnap={0.25}
        zoomDelta={1}
        bounceAtZoomLimits={false}
      >
        <TileLayer
          url={OSM_TILE_URL}
          className="map-tiles"
        />
        <ZoomButtons />
        <MapCredits />
        <MapEvents onPick={openForm} onMove={updateCardPos} />
        <ClusterLayer markers={markers} activeId={story?.id} onSelect={selectStory} />
        {story ? (
          <Marker position={[Number(story.lat), Number(story.lng)]} icon={activeIcon} interactive={false} />
        ) : null}
        {pendingPins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pendingIcon} interactive={false} />
        ))}
        {point ? (
          <Marker
            position={[point.lat, point.lng]}
            icon={newPointIcon}
            draggable
            autoPan
            eventHandlers={newPointHandlers}
          />
        ) : null}
      </MapContainer>

      <div className={`map-gesture-hint ${wheelHint ? 'is-visible' : ''}`} aria-hidden="true">
        Чтобы изменить масштаб, сведите или разведите пальцы на тачпаде либо крутите колесо с&nbsp;зажатым Ctrl
      </div>

      {hint ? (
        <div className={`map-hint ${hint.loading ? 'is-loading' : ''}`} role="status">
          {hint.loading ? <Spinner /> : null}
          {hint.text}
        </div>
      ) : null}

      {story ? (
        <aside className={`map-card story-card ${expanded ? 'is-expanded' : ''}`} style={cardStyle} aria-label="История">
          <div className="card-head">
            <span className="card-label">{story.place || 'Летнее воспоминание'}</span>
            <button type="button" className="card-close" onClick={closeAll} aria-label="Закрыть">
              <Close />
            </button>
          </div>
          <h3 className="card-title">Моё лучшее лето</h3>
          <p className="card-text">{expanded ? story.comment : storyView.short}</p>
          {storyView.truncated || story.author ? (
            <div className="card-foot">
              {storyView.truncated ? (
                <button type="button" className="link-gold" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? 'Свернуть' : 'Читать полностью'}
                </button>
              ) : (
                <span />
              )}
              {story.author ? <span className="card-author">{story.author}</span> : null}
            </div>
          ) : null}
        </aside>
      ) : null}

      {point ? (
        <aside className="map-card form-card" aria-label="Новая история">
          <div className="card-head">
            <span className="card-label">Выбранная точка: {placeLabel}</span>
            <button type="button" className="card-close" onClick={closeAll} aria-label="Закрыть">
              <Close />
            </button>
          </div>
          <h3 className="form-title">Что здесь произошло?</h3>
          <form onSubmit={handleSubmit} noValidate>
            <textarea
              ref={textareaRef}
              className={`story-input ${textError ? 'is-error' : ''}`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={MAX_STORY_LENGTH + 100}
              placeholder="Расскажите о своём лучшем лете…"
              aria-label="Ваша история"
              aria-invalid={Boolean(textError)}
            />
            <div className={`counter ${textError ? 'is-error' : ''}`}>
              {textError ? `${textError} · ` : ''}
              {length} / {MAX_STORY_LENGTH}
            </div>

            <label className={`check ${rulesError ? 'is-error' : ''}`}>
              <input type="checkbox" checked={agreeRules} onChange={(e) => setAgreeRules(e.target.checked)} />
              <span className="check-box">
                <Check />
              </span>
              <span className="check-text">
                Согласен с{' '}
                <a className="link-gold" href="#rules" onClick={(e) => e.stopPropagation()}>
                  правилами публикации
                </a>
              </span>
            </label>
            {rulesError ? <div className="check-error">{rulesError}</div> : null}

            <label className="check">
              <input type="checkbox" checked={agreeAds} onChange={(e) => setAgreeAds(e.target.checked)} />
              <span className="check-box">
                <Check />
              </span>
              <span className="check-text">
                Разрешаю использовать историю в наружной рекламе фильма.{' '}
                <a className="link-gold" href="#rules" onClick={(e) => e.stopPropagation()}>
                  Условия
                </a>
              </span>
            </label>

            {serverError ? <div className="form-error">{serverError}</div> : null}

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={closeAll}>
                Отмена
              </button>
              {submitting ? (
                <button type="submit" className="btn btn-yellow btn-md btn-submit is-sending" disabled>
                  <Spinner />
                  <span className="btn-label">Отправляем…</span>
                </button>
              ) : ready ? (
                <Button type="submit" variant="yellow" size="md" icon="external" className="btn-submit">
                  Отправить историю
                </Button>
              ) : (
                <button type="submit" className="btn btn-muted btn-md btn-submit" aria-disabled="true">
                  <span className="btn-label">Отправить историю</span>
                </button>
              )}
            </div>
          </form>
        </aside>
      ) : null}

      {success ? (
        <aside className="map-card success-card" role="status">
          <div className="card-head card-head-end">
            <button type="button" className="card-close" onClick={closeAll} aria-label="Закрыть">
              <Close />
            </button>
          </div>
          <span className="success-icon">
            <Check />
          </span>
          <h3 className="success-title">История отправлена</h3>
          <p className="success-text">{success}</p>
          <div className="success-actions">
            <Button
              as="a"
              variant="yellow"
              size="md"
              icon="external"
              className="btn-block"
              href={AFISHA_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Купить билеты
            </Button>
            <button type="button" className="btn btn-white btn-md btn-block btn-back" onClick={closeAll}>
              <span className="btn-label">Вернуться к карте</span>
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  )
}
