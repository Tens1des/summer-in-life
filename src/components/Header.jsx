import { AFISHA_URL } from '../config'
import { Button } from './Button'

export function Header() {
  return (
    <header className="header container">
      <nav className="nav-tabs" aria-label="Разделы">
        <a className="nav-tab" href="#about">
          О фильме
        </a>
        <a className="nav-tab" href="#map">
          Карта
        </a>
      </nav>
      <Button
        as="a"
        variant="yellow"
        size="sm"
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
