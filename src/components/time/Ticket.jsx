import { AFISHA_URL, asset } from '../../config'
import { Button } from '../Button'

// Штрихкод корешка из макета: [смещение, толщина] полос по высоте 169px
const bars = [
  [0, 3], [5, 1], [8, 2], [12, 1], [15, 4], [21, 1], [24, 1], [27, 3], [32, 2], [36, 1], [39, 3],
  [44, 1], [47, 1], [50, 2], [54, 4], [60, 1], [63, 2], [67, 1], [70, 3], [75, 1], [78, 1], [81, 4],
  [87, 2], [91, 1], [94, 1], [97, 3], [102, 1], [105, 2], [109, 1], [112, 4], [118, 1], [121, 1],
  [124, 2], [128, 3], [133, 1], [136, 2], [140, 1], [143, 1], [146, 3], [151, 2], [155, 1], [158, 4],
  [164, 1], [167, 2],
]

function Field({ label, children, className = '' }) {
  return (
    <div className={`ticket-field ${className}`.trim()}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

/** «Путёвка на лучшее лето в жизни» — посадочный талон: фото, маршрут Город → Деревня, корешок «Билеты на Афише». */
export function Ticket() {
  return (
    <section className="ticket" aria-label="Путёвка на лучшее лето в жизни">
      <div className="ticket-photo">
        <img src={asset('village.jpg')} alt="Деревенский дом с подсолнухами за забором" />
        <p className="ticket-photo-title">
          Путёвка
          <span>на лучшее лето в жизни</span>
        </p>
      </div>

      <div className="ticket-main">
        <div className="ticket-heading">
          <p className="ticket-kicker">Путёвка</p>
          <h2 className="ticket-name">на лучшее лето в жизни</h2>
        </div>

        <ul className="ticket-labels">
          <li className="label label-yellow">Лучшее лето в жизни</li>
          <li className="label label-outline">6+</li>
        </ul>

        <div className="route">
          <div className="route-point">
            <span className="route-caption">Отправление</span>
            <strong className="route-city">Город</strong>
          </div>
          <div className="route-path">
            <span className="label label-yellow route-duration">Два часа в пути</span>
            <span className="route-line" aria-hidden="true" />
          </div>
          <div className="route-point route-point-end">
            <span className="route-caption">Прибытие</span>
            <strong className="route-city">Деревня</strong>
          </div>
        </div>

        <dl className="ticket-fields">
          <Field label="Путешественники">Дети</Field>
          <Field label="Сопровождающие">Бабушка и&nbsp;дедушка</Field>
          <Field label="Отправление" className="f-date">с 12 ноября 2026</Field>
          <Field label="Программа" className="f-program">
            Приключения, клубника, первая любовь и&nbsp;перевоспитание
          </Field>
          <Field label="Длительность" className="f-duration">Два часа</Field>
        </dl>

        <Button
          as="a"
          variant="dark"
          size="lg"
          icon="external"
          className="ticket-buy d-only"
          href={AFISHA_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Купить билеты
        </Button>
      </div>

      <div className="ticket-stub">
        <a className="stub-link" href={AFISHA_URL} target="_blank" rel="noopener noreferrer">
          <span className="stub-caption">Билеты</span>
          <span className="stub-title">
            <span className="d-only">Билеты </span>на Афише
          </span>
          <svg className="stub-barcode" viewBox="0 0 56 169" aria-hidden="true">
            {bars.map(([y, h]) => (
              <rect key={y} x="0" y={y} width="56" height={h} />
            ))}
          </svg>
        </a>
        <Button
          as="a"
          variant="dark"
          size="lg"
          icon="external"
          className="stub-buy"
          href={AFISHA_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Купить билеты
        </Button>
      </div>
    </section>
  )
}
