import { useEffect, useRef, useState } from 'react'
import { asset, PAGES, SHOW_WINNERS, WINNERS } from '../config'
import { Button } from './Button'
import '../styles/winners.css'

const STORAGE_KEY = 'winners-popup-closed'

function wasClosed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/** Всплывающее окно с объявлением пяти победителей конкурса историй. */
export function WinnersPopup({ page = 'map' }) {
  const [open, setOpen] = useState(() => SHOW_WINNERS && !wasClosed())
  const closeRef = useRef(null)

  function close() {
    setOpen(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* приватный режим — просто закрываем */
    }
  }

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  const mapLink = page === 'map' ? '#map' : `${PAGES.map}#map`

  return (
    <div className="winners-overlay" onClick={(event) => event.target === event.currentTarget && close()}>
      <div className="winners-modal" role="dialog" aria-modal="true" aria-labelledby="winners-title">
        <button ref={closeRef} type="button" className="winners-close" onClick={close} aria-label="Закрыть">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="winners-head">
          <img className="winners-prize" src={asset('prize-camera.jpg')} alt="" aria-hidden="true" />
          <div>
            <p className="winners-kicker">Итоги конкурса историй</p>
            <h2 id="winners-title" className="winners-title">Победители конкурса определены!</h2>
          </div>
        </div>

        <p className="winners-lead">
          Поздравляем авторов самых интересных историй о&nbsp;лучшем лете! Каждый из&nbsp;них получает
          <strong> фотоаппарат мгновенной печати</strong>.
        </p>

        <ol className="winners-list">
          {WINNERS.list.map((winner, index) => (
            <li key={index} className="winners-item">
              <span className="winners-num">{index + 1}</span>
              <span className="winners-info">
                <span className="winners-name">{winner.email}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="winners-note">
          Мы свяжемся с&nbsp;победителями по&nbsp;электронной почте и&nbsp;телефону, указанным при отправке
          истории, чтобы рассказать, как получить приз.
        </p>
        <p className="winners-date">Победители определены {WINNERS.date}</p>

        <Button as="a" variant="yellow" size="lg" icon="down" className="winners-cta" href={mapLink} onClick={close}>
          Смотреть истории на карте
        </Button>
      </div>
    </div>
  )
}
