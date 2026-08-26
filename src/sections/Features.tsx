import { SectionHeading } from '../components/SectionHeading'
import { features } from '../content'
import type { Principle } from '../content'
import { useReveal } from '../reveal'
import './Features.css'

/**
 * Each principle demonstrates itself with the real thing rather than an icon: the
 * actual containers, the actual uniform tokens, the actual disclosure.
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
        <span className="coded__shape coded__shape--diamond">
          <span className="coded__words">
            <span className="coded__word coded__word--verb">eats</span>
          </span>
        </span>
      </span>
    )
  }

  if (kind === 'tokens') {
    return (
      <span aria-hidden="true" className="demo demo--tokens">
        <span className="demo__token">a</span>
        <span className="demo__token">apple</span>
        <span className="demo__token">at school</span>
      </span>
    )
  }

  return (
    <span aria-hidden="true" className="demo demo--legend">
      <span className="demo__chip">
        <span className="demo__chevron" />
        How to read the shapes
      </span>
    </span>
  )
}

export function Features() {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section aria-labelledby="features-heading" className="section section--raised" id="features">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <SectionHeading body={features.body} id="features-heading" title={features.heading} />

        <div className="features__flows">
          {features.flows.map((flow) => (
            <div className="flow" key={flow.id}>
              <h3 className="flow__title">{flow.title}</h3>
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
              <h3 className="principle__title">{item.title}</h3>
              <p className="principle__body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
