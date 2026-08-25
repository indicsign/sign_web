import { LottieScene } from '../components/LottieScene'
import { SectionHeading } from '../components/SectionHeading'
import { tenseLabels, units } from '../content'
import mapUrl from '../assets/lottie/mind-mapping.json?url'
import libraryUrl from '../assets/lottie/digital-library.json?url'
import './Units.css'

// Both loop a segment rather than the whole file, so neither reaches its own ending.
// mind-mapping stops moving at f94 and then holds a dead frame for 3s; digital-library
// runs past its f241 out point with keyframes that collapse it to nothing at f280.
const MAP_LOOP = 110
const LIBRARY_LOOP = 140

export function Units() {
  return (
    <section aria-labelledby="units-heading" className="section section--raised" id="units">
      <div className="shell">
        <SectionHeading body={units.body} id="units-heading" title={units.heading} />
        <div className="units__body">
          <ul className="units__list">
            {units.items.map((unit) => (
              <li className="unit" key={unit.n}>
                <div className="unit__meta">
                  <p className="unit__n">Unit {unit.n}</p>
                  <p className={`unit__tense unit__tense--${unit.tense}`}>
                    {tenseLabels[unit.tense]}
                  </p>
                </div>
                <h3 className="unit__title">{unit.title}</h3>
                <p className="unit__covers">{unit.covers}</p>
                <p className="unit__lessons">{unit.lessons} lessons</p>
              </li>
            ))}
          </ul>
          <div className="units__scenes">
            <LottieScene className="units__scene" loop src={mapUrl} stopAt={MAP_LOOP} />
            <LottieScene className="units__scene" loop src={libraryUrl} stopAt={LIBRARY_LOOP} />
          </div>
        </div>
      </div>
    </section>
  )
}
