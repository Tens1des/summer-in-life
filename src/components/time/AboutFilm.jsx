import { AFISHA_URL, TRAILER_URL, asset } from '../../config'
import { Button } from '../Button'
import { Play } from '../Icons'

const facts = [
  ['Жанр', 'Комедия'],
  ['Возрастное ограничение', '6+'],
  ['В кино', 'с 12 ноября 2026'],
]

export function AboutFilm() {
  return (
    <section id="about" className="about card-surface">
      <a className="trailer-preview" href={TRAILER_URL} target="_blank" rel="noopener noreferrer">
        <img src={asset('village.jpg')} alt="" loading="lazy" />
        <span className="trailer-play" aria-hidden="true">
          <Play />
        </span>
        <span className="trailer-caption">Смотреть трейлер</span>
      </a>

      <div className="about-copy">
        <p className="about-kicker">О фильме</p>
        <h2 className="section-title">Лучшее лето в жизни</h2>
        <p className="about-text">
          Семейная комедия о приключениях, дружбе, первой любви и о том, как лето может изменить всё.
        </p>

        <dl className="about-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="about-actions">
          <Button
            as="a"
            variant="yellow"
            size="lg"
            icon="external"
            className="about-buy"
            href={AFISHA_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Купить билеты
          </Button>
          <Button
            as="a"
            variant="ghost"
            size="lg"
            icon="play"
            className="about-trailer"
            href={TRAILER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Смотреть трейлер
          </Button>
        </div>
      </div>
    </section>
  )
}
