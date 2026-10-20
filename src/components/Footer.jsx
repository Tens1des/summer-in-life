import { useState } from 'react'

export function Footer() {
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <footer className="footer" id="rules">
      <div className="container footer-inner">
        <ul className="footer-pills">
          <li className="pill">© 2026 «Лучшее лето в жизни»</li>
          <li>
            <button type="button" className="pill" onClick={() => setRulesOpen((v) => !v)} aria-expanded={rulesOpen}>
              Правила публикации
            </button>
          </li>
          <li>
            <a className="pill" href="#">
              Политика конфиденциальности
            </a>
          </li>
          <li>
            <a className="pill" href="#">
              Правовая информация
            </a>
          </li>
          <li className="pill pill-age">6+</li>
        </ul>

        {rulesOpen ? (
          <div className="rules-note">
            <h3>Правила публикации</h3>
            <p>
              Оставляйте только свои воспоминания. Не публикуйте оскорбления, персональные данные
              третьих лиц и запрещённый контент. Истории проходят премодерацию и появляются на карте
              после проверки. Самые интересные истории могут быть использованы в наружной рекламе
              и на интерактивных стойках в кинотеатрах.
            </p>
          </div>
        ) : null}
      </div>
    </footer>
  )
}
