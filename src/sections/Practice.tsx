import { useState } from 'react'
import type { DragEvent } from 'react'
import { CodedSentence } from '../components/CodedSentence'
import { Confetti } from '../components/Confetti'
import { LottieScene } from '../components/LottieScene'
import { SectionHeading } from '../components/SectionHeading'
import { practice, shapeKey } from '../content'
import sceneUrl from '../assets/lottie/sign-language.json?url'
// TODO(team): a correct answer shows a plain tick, not a sign. wrong-sign.json cannot
// be turned into a "correct" one: the negation is carried by the L2 forearm swing and
// the head sway, not only by the red hand on L3. This needs a real ISL recording.
import wrongSignUrl from '../assets/lottie/wrong-sign.json?url'
import './Practice.css'

export function Practice() {
  const [step, setStep] = useState(0)
  const [answeredId, setAnsweredId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [over, setOver] = useState(false)

  const count = practice.questions.length
  const question = practice.questions[step]
  const answered = question.options.find((option) => option.id === answeredId) ?? null
  const last = step === count - 1

  const place = (id: string) => {
    setAnsweredId(id)
    setDragging(false)
    setOver(false)
  }

  const advance = () => {
    setStep((i) => (i + 1) % count)
    setAnsweredId(null)
  }

  const handleDrop = (event: DragEvent<HTMLSpanElement>) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (question.options.some((option) => option.id === id)) place(id)
  }

  const slotClass = [
    'quiz__slot',
    answered && 'quiz__slot--filled',
    dragging && 'quiz__slot--armed',
    over && 'quiz__slot--over',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section aria-labelledby="practice-heading" className="section" id="practice">
      <div className="shell practice__inner">
        <div className="practice__intro">
          <SectionHeading body={practice.body} id="practice-heading" title={practice.heading} />
          {/* Loops the whole 6.27s file rather than a short segment: motion ends at
              f47 and the rest is a held frame, so the restart lands once every six
              seconds instead of every two. */}
          <LottieScene className="practice__scene" loop src={sceneUrl} />
        </div>

        <div className="quiz">
          <div className="quiz__bar">
            <span className={`quiz__tense quiz__tense--${question.tense}`}>
              {question.tenseLabel}
            </span>
            <span className="quiz__count">
              {step + 1} / {count}
            </span>
          </div>

          <div className="quiz__body">
            <CodedSentence
              blank={practice.blank}
              className="quiz__prompt"
              slot={
                <span
                  className={slotClass}
                  onDragEnter={() => setOver(true)}
                  onDragLeave={() => setOver(false)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                >
                  {answered ? answered.label : practice.blank}
                </span>
              }
              tokens={question.prompt}
            />

            <div className="quiz__options">
              {!answered && !dragging && (
                <span aria-hidden="true" className="quiz__demo">
                  <span className="quiz__demo-chip">{question.options[0].label}</span>
                  <span className="quiz__demo-cursor">
                    <svg height="22" viewBox="0 0 20 20" width="22">
                      <path
                        d="M5.5 2.2 L5.5 17.6 L9.4 13.9 L11.9 19.3 L14.4 18.2 L11.9 12.9 L17.2 12.9 Z"
                        fill="currentColor"
                        stroke="var(--color-raised)"
                        strokeWidth="1.1"
                      />
                    </svg>
                  </span>
                </span>
              )}
              {question.options.map((option) => {
                const state =
                  answered?.id !== option.id
                    ? ''
                    : option.correct
                      ? ' quiz__option--correct'
                      : ' quiz__option--wrong'

                return (
                  <button
                    className={`quiz__option${state}`}
                    draggable
                    key={option.id}
                    onClick={() => place(option.id)}
                    onDragEnd={() => setDragging(false)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', option.id)
                      event.dataTransfer.effectAllowed = 'copy'
                      setDragging(true)
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>

            <div aria-live="polite" className="quiz__feedback">
              {answered ? (
                <div className="quiz__verdict">
                  {answered.correct ? (
                    /* A tick and a burst, not a sign. There is no ISL "correct" asset
                       yet, and a recoloured "wrong" clip would teach the wrong sign. */
                    <span className="quiz__burst" key={`${question.id}-${answered.id}`}>
                      <Confetti />
                      <svg
                        aria-hidden="true"
                        className="quiz__tick"
                        viewBox="0 0 48 48"
                        width="48"
                      >
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
                  ) : (
                    <LottieScene
                      className="quiz__sign"
                      key={`${question.id}-${answered.id}`}
                      loop
                      src={wrongSignUrl}
                    />
                  )}
                  <div className="quiz__verdict-copy">
                    <p
                      className={`quiz__label quiz__label--${answered.correct ? 'correct' : 'wrong'}`}
                    >
                      {answered.correct ? practice.verdict.correct : practice.verdict.wrong}
                    </p>
                    <p className="quiz__feedback-text">{answered.feedback}</p>
                    <button className="quiz__next" onClick={advance} type="button">
                      {last ? practice.restart : practice.next}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Collapsed: the pictograms carry most of this, and three permanent legend
              rows cost more panel than they earn. */}
          <details className="quiz__key">
            <summary className="quiz__key-toggle">{shapeKey.heading}</summary>
            <ul className="quiz__key-list">
              {shapeKey.items.map((item) => (
                <li className="quiz__key-item" key={item.shape}>
                  <span className={`coded__shape coded__shape--${item.shape}`}>
                    <span className="coded__words">
                      <span className="coded__word">{item.label}</span>
                    </span>
                  </span>
                  <span className="quiz__key-meaning">{item.meaning}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  )
}
