import { asset } from './config'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { TimeHero } from './components/time/TimeHero'
import { HowItWorks } from './components/time/HowItWorks'
import { Ticket } from './components/time/Ticket'
import { TourCards } from './components/time/TourCards'
import { MapTeaser } from './components/time/MapTeaser'
import { AboutFilm } from './components/time/AboutFilm'

/** Вторая страница «Время для себя»: родителям — два часа свободы, пока дети в кино с бабушкой и дедушкой. */
export default function TimeApp() {
  return (
    <div className="page page-time">
      <div className="decor" aria-hidden="true">
        <div className="bg-top" />
        <div className="bg-bottom" />
        <img className="petal p2" src={asset('sunflower-1.png')} alt="" />
        <img className="petal p3" src={asset('sunflower-3.png')} alt="" />
        <img className="petal p4" src={asset('sunflower-2.png')} alt="" />
        <img className="petal p5 faint" src={asset('petal.png')} alt="" />
        <img className="petal p6 faint" src={asset('petal-3.png')} alt="" />
        <img className="petal p7 faint" src={asset('petal-6.png')} alt="" />
        <img className="petal p8 faint" src={asset('petal-2.png')} alt="" />
        <img className="petal p9 faint" src={asset('petal-7.png')} alt="" />
      </div>

      <Header current="time" />
      <main>
        <TimeHero />
        <div className="container time-sections">
          <HowItWorks />
          <Ticket />
          <TourCards />
          <MapTeaser />
          <AboutFilm />
        </div>
      </main>
      <Footer />

      <div className="sun-layer" aria-hidden="true">
        <img className="sun sun-l" src={asset('sunflower-bottom.png')} alt="" />
        <img className="sun sun-r" src={asset('sunflower-hero.png')} alt="" />
      </div>
    </div>
  )
}
