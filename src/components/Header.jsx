import { AFISHA_URL, PAGES, SINGLE_PAGE } from '../config'
import { Button } from './Button'

const items = [
  { id: 'map', label: 'Карта лучшего лета', href: PAGES.map },
  { id: 'time', label: 'Время для себя', href: PAGES.time },
  { id: 'about', label: 'О фильме', href: '#about', desktopOnly: true },
].filter((item) => !(SINGLE_PAGE && item.id === 'time'))

/** Шапка из макета: меню-«пилюля» слева (текущая страница — жёлтая), «Купить билеты» справа. */
export function Header({ current }) {
  return (
    <header className="header container">
      <nav className="nav-menu" aria-label="Разделы">
        {items.map((item) => (
          <a
            key={item.id}
            className={`nav-item ${item.id === current ? 'is-active' : ''} ${item.desktopOnly ? 'd-only' : ''}`.trim()}
            href={item.href}
            aria-current={item.id === current ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <Button
        as="a"
        variant="yellow"
        size="lg"
        icon="external"
        className="header-tickets"
        href={AFISHA_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Купить билеты
      </Button>
    </header>
  )
}
