import { asset } from '../../config'

const cards = [
  {
    image: 'tour-kids.jpg',
    title: 'Детям — приключения',
    text: 'Новые друзья, клубника, первая любовь и перевоспитание. Настоящее лето, как в кино.',
  },
  {
    image: 'tour-grandparents.jpg',
    title: 'Бабушкам и дедушкам — время с внуками',
    text: 'Фильм, который понравится и детям, и взрослым.',
  },
  {
    image: 'tour-parents.jpg',
    title: 'Родителям — два часа свободы',
    text: 'Отдохните, сходите на свидание или просто выдохните. Вы это заслужили.',
  },
]

export function TourCards() {
  return (
    <section className="tour">
      <h2 className="section-title">Что входит в тур</h2>
      <p className="section-sub">Что получает каждый</p>

      <ul className="tour-cards">
        {cards.map((card) => (
          <li key={card.image} className="tour-card">
            <img src={asset(card.image)} alt="" loading="lazy" />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
