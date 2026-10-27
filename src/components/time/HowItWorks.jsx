import { AFISHA_URL } from '../../config'
import { Button } from '../Button'

const steps = [
  {
    title: 'Выберите тур для детей',
    text: '«Лучшее лето в жизни» — приключения, клубника, первая любовь и перевоспитание.',
  },
  {
    title: 'Купите билеты на Афише',
    text: 'Переходите на страницу фильма и покупайте билеты.',
  },
  {
    title: 'Передайте билеты бабушке и дедушке',
    text: 'Они возьмут детей на фильм.',
  },
  {
    title: 'Ваши два часа свободы',
    text: 'Отдохните, сходите на свидание или просто выдохните.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="how card-surface">
      <div className="how-head">
        <div>
          <h2 className="section-title">Как это работает</h2>
          <p className="section-sub">Четыре простых шага к вашим двум часам свободы</p>
        </div>
        <Button
          as="a"
          variant="yellow"
          size="lg"
          icon="external"
          className="how-cta"
          href={AFISHA_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Выбрать сеанс на Афише
        </Button>
      </div>

      <ol className="steps">
        {steps.map((step, index) => (
          <li key={step.title} className="step">
            <span className="step-num">{index + 1}</span>
            <div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
