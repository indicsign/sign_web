import { Button } from '../components/Button'
import { LottieScene } from '../components/LottieScene'
import { APP_URL, CTA_LABEL, closing } from '../content'
import sceneUrl from '../assets/lottie/help-sign.json?url'
import './ClosingCta.css'

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-heading" className="section closing">
      <div className="shell closing__inner">
        <div className="closing__copy">
          <h2 className="closing__title" id="closing-heading">
            {closing.heading}
          </h2>
          <p className="closing__body">{closing.body}</p>
          <Button href={APP_URL}>{CTA_LABEL}</Button>
        </div>
        <LottieScene className="closing__scene" loop src={sceneUrl} />
      </div>
    </section>
  )
}
