import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { LottieScene } from '../components/LottieScene'
import { APP_URL, CTA_LABEL, hero, slides } from '../content'
import type { Slide } from '../content'
import learnersUrl from '../assets/lottie/boy-girl.json?url'
import ateSvg from '../assets/sentences/A_boy_ate_an_apple.svg'
import eatingSvg from '../assets/sentences/A_boy_is_eating_an_apple.svg'
import willEatSvg from '../assets/sentences/A_boy_will_eat_an_apple.svg'
import ateVideo from '../assets/video/ate.mp4?url'
import eatingVideo from '../assets/video/eating.mp4?url'
import eatVideo from '../assets/video/eat.mp4?url'
import './Hero.css'

const SLIDE_MS = 6500

const ASSETS: Record<Slide['id'], { svg: string; video: string }> = {
  past: { svg: ateSvg, video: ateVideo },
  present: { svg: eatingSvg, video: eatingVideo },
  future: { svg: willEatSvg, video: eatVideo },
}

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduce, setReduce] = useState(false)
  const count = slides.items.length
  const slide = slides.items[index]
  const asset = ASSETS[slide.id]

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Advances on its own, but holds while the panel has the pointer or the keyboard,
  // and not at all for anyone who asked for reduced motion — slides that move under
  // you are otherwise impossible to read.
  useEffect(() => {
    if (paused || reduce) return

    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [index, paused, reduce, count])

  return (
    <section className="hero">
      <div className="shell hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__body measure">{hero.body}</p>
          <div className="hero__actions">
            <Button href={APP_URL}>{CTA_LABEL}</Button>
            <p className="hero__note">{hero.ctaNote}</p>
          </div>
          <LottieScene className="hero__scene" loop src={learnersUrl} />
        </div>

        <div className="hero__panel">
          <figure
            className="slides"
            onBlur={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="slides__bar">
              <span className={`slides__tense slides__tense--${slide.tense}`}>
                {slide.tenseLabel}
              </span>
              <span className="slides__count">
                {index + 1} / {count}
              </span>
            </div>

            <div className="slides__body">
              <img
                alt={slide.sentence}
                className="slides__sentence"
                height={390}
                src={asset.svg}
                width={1200}
              />

              {/* Only the visible slide's video is mounted, so the clips load one at
                  a time as the slides turn rather than all three at once. */}
              {/* No control bar: it plays itself, like the illustrations do. Controls
                  come back only under reduced motion, where nothing autoplays and the
                  viewer would otherwise have no way to start it. */}
              <video
                aria-label={slides.videoLabel}
                autoPlay={!reduce}
                className="slides__video"
                controls={reduce}
                disablePictureInPicture
                height={3218}
                key={slide.id}
                loop
                muted
                playsInline
                src={asset.video}
                width={2574}
              />
            </div>

            <div className="slides__nav">
              <ul className="slides__dots">
                {slides.items.map((item, i) => (
                  <li key={item.id}>
                    <button
                      aria-current={i === index ? 'true' : undefined}
                      aria-label={`${slides.nav.pick} ${item.tenseLabel}`}
                      className={`slides__dot${i === index ? ' slides__dot--on' : ''}`}
                      onClick={() => setIndex(i)}
                      type="button"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
