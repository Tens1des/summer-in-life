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
        <svg className="promo-swoosh" viewBox="0 0 1296 97" preserveAspectRatio="none" aria-hidden="true">
          <path d="M560 97 L650 0 H760 L690 60 L860 0 H960 L850 97 Z" />
          <path d="M1000 97 L1080 30 L1130 0 H1296 V20 L1180 97 Z" opacity=".55" />
        </svg>
        <svg className="promo-swoosh-m" viewBox="0 0 200 170" fill="none" aria-hidden="true">
          <path d="M40 250 C48 120 130 50 290 40" stroke="currentColor" strokeWidth="46" strokeLinecap="round" />
        </svg>
        <p>
          Авторы самых интересных и запоминающихся историй смогут принять участие в розыгрыше
          памятных призов, среди которых фотоаппарат моментальной печати, набор свечей, тёплые
          носочки на&nbsp;всю семью и&nbsp;многое другое. С&nbsp;подробным перечнем подарков можно
          ознакомиться в&nbsp;правилах конкурса
        </p>
        <Button as="a" variant="dark" size="sm" icon="external" href="#rules">
          Правила участия
        </Button>
      </aside>

      <StoryMap />
    </section>
  )
}
