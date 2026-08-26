import { LottieScene } from '../components/LottieScene'
import { SectionHeading } from '../components/SectionHeading'
import { journey } from '../content'
import { useReveal } from '../reveal'
import mapUrl from '../assets/lottie/mind-mapping.json?url'
import libraryUrl from '../assets/lottie/digital-library.json?url'
import './Journey.css'

// Both loop a segment rather than the whole file, so neither reaches its own ending.
// mind-mapping stops moving at f94 and then holds a dead frame for 3s; digital-library
// runs past its f241 out point with keyframes that collapse it to nothing at f280.
const MAP_LOOP = 110
const LIBRARY_LOOP = 140

export function Journey() {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section aria-labelledby="journey-heading" className="section section--raised" id="journey">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <SectionHeading body={journey.body} id="journey-heading" title={journey.heading} />
        <div className="journey__body">
          <ol className="journey__list">
            {journey.items.map((stage) => (
              <li className="stage" key={stage.n}>
                <span aria-hidden="true" className="stage__n">{stage.n}</span>
                <h3 className="stage__title">{stage.title}</h3>
                <p className="stage__line">{stage.line}</p>
                <p className="stage__detail">{stage.detail}</p>
              </li>
            ))}
          </ol>
          <div className="journey__scenes">
            <LottieScene className="journey__scene" loop src={mapUrl} stopAt={MAP_LOOP} />
            <LottieScene className="journey__scene" loop src={libraryUrl} stopAt={LIBRARY_LOOP} />
          </div>
        </div>
      </div>
    </section>
  )
}
