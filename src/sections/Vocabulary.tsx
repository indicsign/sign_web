import { LottieScene } from '../components/LottieScene'
import { SectionHeading } from '../components/SectionHeading'
import { vocabulary } from '../content'
import type { VocabWord } from '../content'
import { useReveal } from '../reveal'
import waterSign from '../assets/signs/water.mp4?url'
import moreSignUrl from '../assets/lottie/more-sign.json?url'
import './Vocabulary.css'

const SIGNS: Record<NonNullable<VocabWord['sign']>, string> = {
  water: waterSign,
}

export function Vocabulary() {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <section aria-labelledby="vocabulary-heading" className="section" id="vocabulary">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <SectionHeading
          body={vocabulary.body}
          id="vocabulary-heading"
          title={vocabulary.heading}
        />
        <div className="vocabulary__bar">
          <p className="vocabulary__label">{vocabulary.label}</p>
          <LottieScene className="vocabulary__scene" loop src={moreSignUrl} />
        </div>
        <ul className="vocabulary__list">
          {vocabulary.items.map((item) => (
            <li className="word" key={item.word}>
              {/* Mounted only once the section is in view, so the clips are never
                  fetched on page load. It plays itself and has no controls — the
                  sign is the content, not a video to operate. */}
              {item.sign && reveal.shown ? (
                <video
                  aria-label={`${item.word} in Indian Sign Language`}
                  autoPlay={!reveal.reduce}
                  className="word__sign"
                  controls={reveal.reduce}
                  controlsList="nodownload"
                  disablePictureInPicture
                  height={672}
                  loop
                  muted
                  playsInline
                  src={SIGNS[item.sign]}
                  width={448}
                />
              ) : null}
              {/* The word wears the colour its part of speech has everywhere else on
                  the page, so stage one already teaches the code stage two uses. */}
              <span className={`word__base word__base--${item.kind}`}>{item.word}</span>
              <span className={`word__kind word__kind--${item.kind}`}>{item.kind}</span>
              <p className="word__gloss">{item.gloss}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
