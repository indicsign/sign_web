import { SectionHeading } from '../components/SectionHeading'
import { shapeKey, shapeNames } from '../content'
import { useReveal } from '../reveal'
import './ShapeKey.css'

/**
 * The framework's own table, drawn rather than described. Four columns a reader
 * compares across, so it is a real table: the part of the sentence, the container it
 * takes, the colour its word carries, and the three of them together.
 */
export function ShapeKey() {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section aria-labelledby="shapes-heading" className="section section--raised" id="shapes">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <SectionHeading body={shapeKey.body} id="shapes-heading" title={shapeKey.heading} />

        <div
          aria-label={shapeKey.tableLabel}
          className="key__scroll"
          role="region"
          tabIndex={0}
        >
          <table className="key">
            <thead>
              <tr>
                <th className="key__head" scope="col">
                  {shapeKey.columns.part}
                </th>
                <th className="key__head" scope="col">
                  {shapeKey.columns.shape}
                </th>
                <th className="key__head" scope="col">
                  {shapeKey.columns.colour}
                </th>
                <th className="key__head" scope="col">
                  {shapeKey.columns.example}
                </th>
              </tr>
            </thead>
            <tbody>
              {shapeKey.items.map((item) => (
                <tr className="key__row" key={item.part}>
                  <th className="key__cell key__cell--part" scope="row">
                    <span className="key__part">{item.part}</span>
                    <span className="key__question">{item.question}</span>
                  </th>

                  {/* The container on its own. The word that goes in it is the next
                      column along, so the form is compared against form here. */}
                  <td className="key__cell">
                    <span
                      className={`coded__shape coded__shape--${item.shape}${
                        item.slot ? ` coded__shape--${item.slot}` : ''
                      }`}
                    >
                      <span className="visually-hidden">{shapeNames[item.shape]}</span>
                    </span>
                  </td>

                  <td className="key__cell">
                    <span className="key__colour">
                      <span
                        aria-hidden="true"
                        className={`key__swatch key__swatch--${item.colour.role}`}
                      />
                      <span>
                        <span className="key__colour-name">{item.colour.name}</span>
                        {item.colour.only ? (
                          <span className="key__colour-only">{item.colour.only}</span>
                        ) : null}
                      </span>
                    </span>
                  </td>

                  <td className="key__cell">
                    <span className="key__example">
                      {item.words.map((word) => (
                        <span
                          className={
                            word.role ? `coded__word coded__word--${word.role}` : 'coded__word'
                          }
                          key={word.text}
                        >
                          {word.text}
                        </span>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="key__note measure">{shapeKey.note}</p>
      </div>
    </section>
  )
}
