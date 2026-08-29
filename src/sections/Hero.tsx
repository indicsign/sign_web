import { Button } from '../components/Button'
import { LottieScene } from '../components/LottieScene'
import { SentencePanel } from '../components/SentencePanel'
import { APP_URL, CTA_LABEL, hero } from '../content'
import learnersUrl from '../assets/lottie/boy-girl.json?url'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero">
      <div className="shell hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__body measure">{hero.body}</p>
          <div className="hero__actions">
            <Button href={APP_URL}>{CTA_LABEL}</Button>
            <p className="hero__note">{hero.ctaNote}</p>
          </div>
          <LottieScene className="hero__scene" loop src={learnersUrl} />
        </div>

        <div className="hero__panel">
          <SentencePanel />
        </div>
      </div>
    </section>
  )
}
