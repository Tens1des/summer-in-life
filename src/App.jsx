import { asset } from './config'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MapSection } from './components/MapSection'
import { Cinema } from './components/Cinema'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="page">
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

      <Header />
      <Hero />
      <MapSection />
      <Cinema />
      <Footer />

      <div className="sun-layer" aria-hidden="true">
        <img className="petal p1" src={asset('sunflower-3.png')} alt="" />
        <img className="sun sun-l" src={asset('sunflower-bottom.png')} alt="" />
        <img className="sun sun-r" src={asset('sunflower-hero.png')} alt="" />
      </div>
    </div>
  )
}
