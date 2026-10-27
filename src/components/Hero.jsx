import { asset } from '../config'
import { Button } from './Button'

export function Hero() {
  return (
    <section id="about" className="hero">
      {/* Мобильный первый экран */}
      <div className="hero-mobile">
        <img className="hm-sunflower hm-sunflower-top" src={asset('sunflower-hero.png')} alt="" aria-hidden="true" />
        <img className="hm-sunflower hm-sunflower-bottom" src={asset('sunflower-bottom.png')} alt="" aria-hidden="true" />
        <img className="hm-petal hm-petal-a" src={asset('sunflower-2.png')} alt="" aria-hidden="true" />
        <img className="hm-petal hm-petal-b" src={asset('sunflower-3.png')} alt="" aria-hidden="true" />

        <img className="hm-poster" src={asset('poster.jpg')} alt="Постер фильма «Лучшее лето в жизни»" />
        <div className="hm-copy">
          <p className="hm-meta">В кино с 12 ноября · 6+</p>
          <h1 className="hm-title">Лучшее лето в&nbsp;жизни</h1>
          <p className="hm-text">
            Городские дети попадают к бабушке и дедушке в деревню, где их ждут огород,
            расследование и первая любовь.
          </p>
          <Button as="a" variant="dark" size="lg" icon="down" className="hm-share" href="#map">
            Поделиться лучшим летом
          </Button>
        </div>
      </div>

      {/* Десктоп */}
      <div className="container">
        <div className="hero-card">
          <img className="hero-poster" src={asset('poster.jpg')} alt="Постер фильма «Лучшее лето в жизни»" />
          <div className="hero-content">
            <h1 className="hero-title">Лучшее лето в жизни</h1>
            <ul className="tags" aria-label="О фильме">
              <li className="tag tag-dark">12 ноября</li>
              <li className="tag">Комедия</li>
              <li className="tag">Детектив</li>
              <li className="tag">6+</li>
            </ul>
            <p className="hero-text">
              Семейная комедия о лете, которое пошло совсем не по плану. Городские дети попадают
              к бабушке и дедушке в деревню, где их ждут огород, расследование и первая любовь.
            </p>
            <Button as="a" variant="yellow" size="lg" icon="down" className="hero-share" href="#map">
              Рассказать о своём лучшем лете
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
