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
          После проверки её сможет увидеть вся страна!
        </p>
      </div>

      <aside className="promo-banner">
        <svg className="promo-swoosh" viewBox="0 0 1296 97" preserveAspectRatio="none" aria-hidden="true">
          <path d="M560 97 L650 0 H760 L690 60 L860 0 H960 L850 97 Z" />
          <path d="M1000 97 L1080 30 L1130 0 H1296 V20 L1180 97 Z" opacity=".55" />
        </svg>
        <p>
          Самые интересные истории могут появиться на интерактивных стойках в кинотеатрах,
          и&nbsp;их прочитают зрители по всей стране
        </p>
        <Button as="a" variant="dark" size="sm" icon="external" href="#rules">
          Правила участия
        </Button>
      </aside>

      <StoryMap />
    </section>
  )
}
