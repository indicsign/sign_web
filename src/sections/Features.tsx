import { SectionHeading } from '../components/SectionHeading'
import { features } from '../content'
import type { Principle } from '../content'
import { useReveal } from '../reveal'
import './Features.css'

/**
 * Each principle demonstrates itself with the real thing rather than an icon: the
 * actual containers, the actual uniform tokens.
 *
 * The verb sits in a hexagon, not a diamond. The diamond is the auxiliary — is, are —
 * and eats is the verb itself. This demo stands a few hundred pixels from the table
 * that says so, so getting it wrong taught the reader the opposite of the section.
 */
function Demo({ kind }: { kind: Principle['demo'] }) {
  if (kind === 'shapes') {
    return (
      <span aria-hidden="true" className="demo demo--shapes">
        <span className="coded__shape coded__shape--oval coded__shape--who">
          <span className="coded__words">
            <span className="coded__word coded__word--article">A</span>
            <span className="coded__word coded__word--noun">boy</span>
          </span>
        </span>
        <span className="coded__shape coded__shape--hexagon">
          <span className="coded__words">
            <span className="coded__word coded__word--verb">eats</span>
          </span>
        </span>
      </span>
    )
  }

  return (
    <span aria-hidden="true" className="demo demo--tokens">
      <span className="demo__token">a</span>
      <span className="demo__token">apple</span>
      <span className="demo__token">at school</span>
    </span>
  )
}

export function Features() {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section aria-labelledby="features-heading" className="section" id="features">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <SectionHeading body={features.body} id="features-heading" title={features.heading} />

        <h3 className="features__key" id="features-key">
          {features.featuresHeading}
        </h3>

        <div className="features__flows">
          {features.flows.map((flow) => (
            <div className="flow" key={flow.id}>
              <h4 className="flow__title">{flow.title}</h4>
              <p className="flow__line">{flow.line}</p>
              <ol className="flow__steps">
                {flow.steps.map((step) => (
                  <li className="flow__step" key={step}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <ul className="features__principles">
          {features.principles.map((item) => (
            <li className="principle" key={item.id}>
              <Demo kind={item.demo} />
              <h4 className="principle__title">{item.title}</h4>
              <p className="principle__body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
