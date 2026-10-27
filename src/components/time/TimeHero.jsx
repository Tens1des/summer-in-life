import { AFISHA_URL, asset } from '../../config'
import { Button } from '../Button'

const poster = 'Постер фильма «Лучшее лето в жизни»'

export function TimeHero() {
  return (
    <section className="time-hero">
      <img className="th-sunflower th-sunflower-top" src={asset('sunflower-hero.png')} alt="" aria-hidden="true" />
      <img className="th-sunflower th-sunflower-side" src={asset('sunflower-hero.png')} alt="" aria-hidden="true" />
      <img className="hm-petal hm-petal-a" src={asset('sunflower-2.png')} alt="" aria-hidden="true" />
      <img className="hm-petal hm-petal-b" src={asset('sunflower-3.png')} alt="" aria-hidden="true" />

      <div className="container">
        <div className="th-card">
          <div className="th-content">
            <ul className="tags th-tags" aria-label="О фильме">
              <li className="tag tag-yellow">В кино с 12 ноября</li>
              <li className="tag">Два часа отпуска без детей</li>
              <li className="tag">6+</li>
            </ul>
            <p className="th-meta">В кино с 12 ноября · 6+</p>

            <div className="th-message">
              <h1 className="th-title">Устали настолько, что уже смотрите билеты?</h1>
              <p className="th-text">
                Им&nbsp;— приключения, клубника, первая любовь и&nbsp;перевоспитание.{' '}
                <br className="br-desktop" />
                Вам&nbsp;— два часа на&nbsp;себя.
              </p>
            </div>

            <div className="th-actions">
              <Button
                as="a"
                variant="yellow"
                size="lg"
                icon="external"
                className="th-buy"
                href={AFISHA_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Купить билеты
              </Button>
              <Button as="a" variant="ghost" size="lg" icon="down" href="#how">
                Как это устроить
              </Button>
            </div>
          </div>
          <img className="th-poster" src={asset('poster.jpg')} alt={poster} />
        </div>
      </div>
    </section>
  )
}
