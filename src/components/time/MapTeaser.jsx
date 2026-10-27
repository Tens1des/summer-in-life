import { PAGES, asset } from '../../config'
import { Button } from '../Button'

/** Приглашение на главную, к карте воспоминаний. */
export function MapTeaser() {
  return (
    <section className="map-teaser">
      <img className="mt-map" src={asset('map-illustration.jpg')} alt="" loading="lazy" />
      <div className="mt-card">
        <h2 className="section-title">Где прошло ваше лучшее лето?</h2>
        <p>Отметьте место на карте и расскажите свою историю. После проверки её увидят все.</p>
        <Button as="a" variant="dark" size="lg" icon="external" className="mt-open" href={`${PAGES.map}#map`}>
          Открыть карту
        </Button>
      </div>
    </section>
  )
}
