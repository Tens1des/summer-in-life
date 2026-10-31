import { asset, DOCS } from '../config'
import { Button } from './Button'
import { StoryMap } from './StoryMap'

export function MapSection() {
  return (
    <section id="map" className="map-section container">
      <div className="map-intro">
        <h2>Расскажи о своём лучшем лете</h2>
        <p>
          На карте выбери точку, с которой у тебя связаны воспоминания о лучшем лете, и расскажи
          свою историю. <br className="br-desktop" />
          После проверки она появится на карте и её сможет увидеть вся страна!
        </p>
      </div>

      <aside className="promo-banner">
        <img className="promo-swoosh" src={asset('prize-swoosh.svg')} alt="" aria-hidden="true" />
        <div className="promo-copy">
          <p>
            Авторы самых интересных и запоминающихся историй смогут принять участие в&nbsp;розыгрыше
            памятных призов, а&nbsp;именно, фотоаппаратов моментальной печати!
          </p>
          <Button
            as="a"
            variant="dark"
            size="lg"
            icon="external"
            className="promo-rules"
            href={DOCS.rules}
            target="_blank"
            rel="noopener noreferrer"
          >
            Правила участия
          </Button>
        </div>
        <figure className="promo-prize">
          <img src={asset('prize-camera.jpg')} alt="Фотоаппарат моментальной печати" />
          <figcaption>Фотоаппарат</figcaption>
        </figure>
      </aside>

      <StoryMap />
    </section>
  )
}
