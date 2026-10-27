import { AFISHA_URL, TRAILER_URL, asset } from '../config'
import { Button } from './Button'
import { Play } from './Icons'

export function Cinema() {
  return (
    <section className="cinema container">
      <div className="cinema-card">
        <svg className="cinema-swoosh" viewBox="856 0 440 274" fill="none" aria-hidden="true">
          <path
            d="M1000 14 C1000 66 1040 118 1090 113 C1130 108 1160 50 1192 -30 M1086 116 C1030 150 960 196 866 316"
            stroke="currentColor"
            strokeWidth="62"
            strokeLinecap="round"
          />
        </svg>
        <img className="cinema-poster" src={asset('poster-v4.jpg')} alt="Постер фильма «Лучшее лето в жизни»" />
        <div className="cinema-copy">
          <h2>Смотрите в&nbsp;кино с&nbsp;12&nbsp;ноября</h2>
          <p>
            Билеты на все сеансы <span className="m-only">— </span>на Афише.
          </p>
          <div className="cinema-actions">
            <Button
              as="a"
              variant="dark"
              size="lg"
              icon="external"
              href={AFISHA_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Купить билеты
            </Button>
            <a className="btn btn-white btn-lg btn-trailer" href={TRAILER_URL} target="_blank" rel="noopener noreferrer">
              <Play className="play-icon" />
              <span className="btn-label">Смотреть трейлер</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
