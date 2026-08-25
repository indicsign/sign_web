import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, KeyboardEvent, PointerEvent } from 'react'
import { slides } from '../content'
import type { Slide } from '../content'
import ateSvg from '../assets/sentences/A_boy_ate_an_apple.svg'
import eatingSvg from '../assets/sentences/A_boy_is_eating_an_apple.svg'
import willEatSvg from '../assets/sentences/A_boy_will_eat_an_apple.svg'
import ateVideo from '../assets/video/ate.mp4?url'
import eatingVideo from '../assets/video/eating.mp4?url'
import eatVideo from '../assets/video/eat.mp4?url'
import './Slideshow.css'

const SLIDE_MS = 6500
const SWIPE_PX = 44

const ASSETS: Record<Slide['id'], { svg: string; video: string }> = {
  past: { svg: ateSvg, video: ateVideo },
  present: { svg: eatingSvg, video: eatingVideo },
  future: { svg: willEatSvg, video: eatVideo },
}

export function Slideshow() {
  const items = slides.items
  const count = items.length

  const [index, setIndex] = useState(0)
  const [stopped, setStopped] = useState(false)
  // Hover and keyboard are held apart on purpose. Folded into one flag, letting go
  // of one releases the other's hold too.
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduce, setReduce] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  // Bumped every time the dwell timer restarts, and used as the progress bar's key,
  // so the bar and the clock it reports on can never drift apart.
  const [tick, setTick] = useState(0)
  // Which clips may fetch. A slide's clip starts loading one slide early, so the
  // next one is buffered before it is shown without the page opening on three
  // videos at once.
  const [warm, setWarm] = useState<readonly number[]>([0, 1])

  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null)

  const slide = items[index]
  const running = !stopped && !hovered && !focused && !reduce

  const go = useCallback(
    (to: number) => setIndex(((to % count) + count) % count),
    [count],
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduce(query.matches)

    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

  useEffect(() => {
    const next = (index + 1) % count
    setWarm((current) => {
      const missing = [index, next].filter((i) => !current.includes(i))
      return missing.length ? [...current, ...missing] : current
    })
  }, [count, index])

  // Advances on its own, but holds while the panel has the pointer or the keyboard,
  // stops for good when asked to, and never runs for anyone who asked for reduced
  // motion — slides that move under you are otherwise impossible to read.
  useEffect(() => {
    if (!running) return

    setTick((t) => t + 1)
    const timer = window.setTimeout(() => go(index + 1), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [go, index, running])

  // The clips are never remounted, only played and paused, because a remounted
  // <video> has no decoded frame to show and blinks its empty box at the reader
  // on every turn of the slideshow.
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return

      if (i !== index) {
        video.pause()
        video.currentTime = 0
        return
      }

      if (reduce || stopped) video.pause()
      else void video.play().catch(() => undefined)
    })
  }, [index, reduce, stopped])

  // Only a keyboard visit holds the slides. A mouse click leaves focus sitting on
  // the button it hit, which would otherwise hold them for the rest of the visit.
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
      setFocused(true)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    go(event.key === 'ArrowLeft' ? index - 1 : index + 1)
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = swipe.current
    swipe.current = null
    // A finger lifted off the panel never reports back here, so only the gesture
    // this element actually started counts.
    if (!start || start.id !== event.pointerId) return

    const x = event.clientX - start.x
    const y = event.clientY - start.y
    // A gesture that travelled further down than across is a scroll, not a swipe.
    if (Math.abs(x) < SWIPE_PX || Math.abs(x) < Math.abs(y)) return

    go(x < 0 ? index + 1 : index - 1)
  }

  const fill = ['slides__fill']
  if (reduce) fill.push('slides__fill--static')
  else if (!running) fill.push('slides__fill--held')

  return (
    <figure
      className="slides"
      onBlur={() => setFocused(false)}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerCancel={() => {
        swipe.current = null
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ '--dwell': `${SLIDE_MS}ms` } as CSSProperties}
    >
      <div className="slides__bar">
        <span className={`slides__tense slides__tense--${slide.tense}`}>{slide.tenseLabel}</span>
        <p className="slides__count">
          <span aria-hidden="true">
            {index + 1} / {count}
          </span>
          <span aria-live="polite" className="visually-hidden">
            {`${index + 1} ${slides.nav.of} ${count} — ${slide.tenseLabel}: ${slide.sentence}`}
          </span>
        </p>
      </div>

      <div className="slides__viewport">
        <ul className="slides__track" style={{ transform: `translateX(${index * -100}%)` }}>
          {items.map((item, i) => {
            const asset = ASSETS[item.id]
            const shown = i === index

            return (
              <li aria-hidden={!shown} className="slides__slide" key={item.id}>
                <img
                  alt={item.sentence}
                  className="slides__sentence"
                  height={390}
                  src={asset.svg}
                  width={1200}
                />

                <div className="slides__frame">
                  {/* No control bar: it plays itself, like the illustrations do.
                      Controls come back only under reduced motion, where nothing
                      autoplays and the viewer would otherwise have no way to start
                      it. */}
                  <video
                    aria-label={slides.videoLabel}
                    className="slides__video"
                    controls={reduce}
                    disablePictureInPicture
                    height={3218}
                    loop
                    muted
                    playsInline
                    preload={warm.includes(i) ? 'auto' : 'none'}
                    ref={(node) => {
                      videos.current[i] = node
                    }}
                    src={asset.video}
                    tabIndex={shown ? undefined : -1}
                    width={2574}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="slides__nav">
        <span />

        <div className="slides__transport">
          <button
            aria-label={slides.nav.prev}
            className="slides__step"
            onClick={() => go(index - 1)}
            type="button"
          >
            <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>

          <ul className="slides__dots">
            {items.map((item, i) => (
              <li key={item.id}>
                <button
                  aria-current={i === index ? 'true' : undefined}
                  aria-label={`${slides.nav.pick} ${item.tenseLabel}`}
                  className={`slides__dot${i === index ? ' slides__dot--on' : ''}`}
                  onClick={() => go(i)}
                  type="button"
                >
                  <span className="slides__rail">
                    {i === index && <span className={fill.join(' ')} key={tick} />}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            aria-label={slides.nav.next}
            className="slides__step"
            onClick={() => go(index + 1)}
            type="button"
          >
            <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {reduce ? (
          <span />
        ) : (
          <button
            aria-label={stopped ? slides.nav.play : slides.nav.stop}
            className="slides__step"
            onClick={() => setStopped((s) => !s)}
            type="button"
          >
            <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24">
              <path
                d={stopped ? 'M8 5l11 7-11 7z' : 'M9 5h3v14H9zm6 0h3v14h-3z'}
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </figure>
  )
}
