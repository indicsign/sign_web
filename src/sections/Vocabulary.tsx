import { SectionHeading } from '../components/SectionHeading'
import { vocabulary } from '../content'
import './Vocabulary.css'

export function Vocabulary() {
  return (
    <section aria-labelledby="vocabulary-heading" className="section" id="vocabulary">
      <div className="shell">
        <SectionHeading
          body={vocabulary.body}
          id="vocabulary-heading"
          title={vocabulary.heading}
        />
        <p className="vocabulary__label">{vocabulary.unitLabel}</p>
        <ul className="vocabulary__list">
          {vocabulary.items.map((item) => (
            <li className="word" key={item.word}>
              <div className="word__head">
                <span className="word__base">{item.word}</span>
                <span className="word__kind">{item.kind}</span>
              </div>
              {item.past ? (
                <p className="word__past">
                  {vocabulary.pastLabel} <strong>{item.past}</strong>
                </p>
              ) : null}
              <p className="word__gloss">{item.gloss}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
