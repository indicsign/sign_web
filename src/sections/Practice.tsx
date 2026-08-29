import { useEffect, useState } from 'react'
import type { DragEvent } from 'react'
import { Confetti } from '../components/Confetti'
import { LottieScene } from '../components/LottieScene'
import { SectionHeading } from '../components/SectionHeading'
import { practice } from '../content'
import { useReveal } from '../reveal'
import boyPic from '../assets/pictograms/boy.webp'
import applePic from '../assets/pictograms/apple.webp'
import sceneUrl from '../assets/lottie/sign-language.json?url'
// TODO(team): a wrong placement shows a real ISL sign; a correct one shows a tick,
// because wrong-sign.json cannot be turned into a "correct" sign — the negation is
// carried by the L2 forearm swing and the head sway, not only by the red hand.
import wrongSignUrl from '../assets/lottie/wrong-sign.json?url'
import './Practice.css'

const PICTURES = { boy: boyPic, apple: applePic }

type Placed = Record<string, string | undefined>


export function Practice() {
  const reveal = useReveal<HTMLDivElement>()

  const [placed, setPlaced] = useState<Placed>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)
  // Carries a counter, not just a slot id: dropping the wrong word on the same shape
  // twice has to shake it twice, and an unchanged value would not re-render.
  const [refused, setRefused] = useState<{ slot: string; n: number } | null>(null)

  const round = practice.round
  const remaining = round.tokens.filter((token) => !placed[token.id])
  const done = remaining.length === 0

  // A token only fits the slot that shares its id, so a placement is either right or
  // it is refused with the reason — nothing lands in the wrong shape.
  const attempt = (tokenId: string, slotId: string) => {
    const token = round.tokens.find((t) => t.id === tokenId)
    if (!token) return

    setSelected(null)

    if (tokenId === slotId) {
      setPlaced((current) => ({ ...current, [tokenId]: slotId }))
      setWrong(null)
      setRefused(null)
      return
    }

    setWrong(token.belongs)
    setRefused((current) => ({ slot: slotId, n: (current?.n ?? 0) + 1 }))
  }

  // Cleared on a timer rather than on animationend: under reduced motion the animation
  // never runs, so that event never fires and the refused state would stick for good.
  useEffect(() => {
    if (!refused) return

    const timer = window.setTimeout(() => setRefused(null), 420)
    return () => window.clearTimeout(timer)
  }, [refused])

  const reset = () => {
    setPlaced({})
    setSelected(null)
    setWrong(null)
    setRefused(null)
  }

  const onDrop = (event: DragEvent<HTMLElement>, slotId: string) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (id) attempt(id, slotId)
  }

  return (
    <section aria-labelledby="practice-heading" className="section" id="practice">
      <div className={`shell practice__inner ${reveal.className}`} ref={reveal.ref}>
        <div className="practice__intro">
          <SectionHeading body={practice.body} id="practice-heading" title={practice.heading} />
          <LottieScene className="practice__scene" loop src={sceneUrl} />
        </div>

        <div className="build">
          <div className="build__bar">
            <span className="build__tag">{practice.tag}</span>
          </div>

          <div className="build__body">
          <div className="build__row">
            {round.slots.map((slot) => {
              const filled = round.tokens.find((t) => t.id === placed[slot.id])
              const classes = [
                'build__slot',
                `coded__shape`,
                `coded__shape--${slot.shape}`,
                slot.slot && `coded__shape--${slot.slot}`,
                filled && 'build__slot--filled',
                refused?.slot === slot.id && 'build__slot--refused',
                selected && !filled && 'build__slot--open',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <div className="build__unit" key={slot.id}>
                  {/* The space is reserved whether or not the picture is showing, so
                      the row does not grow taller each time a shape is filled. */}
                  {slot.picture ? (
                    <span className="build__pic">
                      {filled ? <img alt="" src={PICTURES[slot.picture]} /> : null}
                    </span>
                  ) : null}
                  <button
                    aria-label={
                      filled
                        ? filled.label
                        : `${practice.emptyLabel} ${practice.shapeNames[slot.shape]}`
                    }
                    className={classes}
                    onClick={() => selected && attempt(selected, slot.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => onDrop(event, slot.id)}
                    type="button"
                  >
                    <span className="coded__words">
                      {filled?.words.map((word, i) => (
                        <span
                          className={word.role ? `coded__word coded__word--${word.role}` : 'coded__word'}
                          key={`${word.text}-${i}`}
                        >
                          {word.text}
                        </span>
                      ))}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="build__tray">
            {remaining.map((token) => (
              <button
                aria-pressed={selected === token.id}
                className={`build__token${selected === token.id ? ' build__token--picked' : ''}`}
                draggable
                key={token.id}
                onClick={() => setSelected((current) => (current === token.id ? null : token.id))}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', token.id)
                  event.dataTransfer.effectAllowed = 'move'
                  setSelected(token.id)
                }}
                type="button"
              >
                {token.label}
              </button>
            ))}
          </div>

          <p className="build__tray-note">{practice.tray}</p>

          <div aria-live="polite" className="build__verdict">
            {done ? (
              <div className="build__result">
                <span className="build__burst">
                  <Confetti />
                  <svg aria-hidden="true" className="build__tick" viewBox="0 0 48 48" width="48">
                    <circle cx="24" cy="24" fill="currentColor" opacity="0.12" r="23" />
                    <path
                      d="M13 25.5 L20.5 33 L35 17"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4.5"
                    />
                  </svg>
                </span>
                <div className="build__result-copy">
                  <p className="build__label build__label--done">{practice.doneLabel}</p>
                  <p className="build__message">{round.sentence}</p>
                  <div className="build__actions">
                    <button className="build__again" onClick={reset} type="button">
                      {practice.restart}
                    </button>
                  </div>
                </div>
              </div>
            ) : wrong ? (
              <div className="build__result">
                <LottieScene
                  className="build__sign"
                  key={refused?.n ?? 'wrong'}
                  loop
                  src={wrongSignUrl}
                />
                <div className="build__result-copy">
                  <p className="build__label build__label--wrong">{practice.wrongLabel}</p>
                  <p className="build__message">{wrong}</p>
                </div>
              </div>
            ) : null}
          </div>

          </div>

        </div>
      </div>
    </section>
  )
}
