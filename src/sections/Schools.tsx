import { SectionHeading } from '../components/SectionHeading'
import { schools } from '../content'
import { useReveal } from '../reveal'
import './Schools.css'

/**
 * The one section addressed to a school rather than a student. It is marked as such,
 * because a head teacher arriving from a different link should know within a line that
 * this part is written to them.
 */
export function Schools() {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section aria-labelledby="schools-heading" className="section section--raised" id="schools">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <p className="schools__tag">{schools.tag}</p>

        <SectionHeading body={schools.body} id="schools-heading" title={schools.heading} />

        <div className="schools__curriculum">
          <h3 className="schools__subheading">{schools.curriculumHeading}</h3>
          <p className="schools__body measure">{schools.curriculumBody}</p>
        </div>

        <ul className="schools__points">
          {schools.points.map((point) => (
            <li className="point" key={point.id}>
              <h4 className="point__title">{point.title}</h4>
              <p className="point__body">{point.body}</p>
            </li>
          ))}
        </ul>

        <div className="schools__partner">
          <h3 className="schools__subheading">{schools.partnerHeading}</h3>
          <p className="schools__body measure">{schools.partnerBody}</p>
        </div>
      </div>
    </section>
  )
}
