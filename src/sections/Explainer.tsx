import { useEffect, useRef, useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { explainer } from '../content'
import { useReveal } from '../reveal'
import type { Level } from '../content'
import beginnerUrl from '../assets/video/beginner.mp4?url'
import difficultUrl from '../assets/video/difficult.mp4?url'
import beginnerPoster from '../assets/posters/beginner.webp'
import difficultPoster from '../assets/posters/difficult.webp'
import './Explainer.css'

const SOURCES: Record<Level['id'], string> = {
  beginner: beginnerUrl,
  difficult: difficultUrl,
}

// A still lifted from each file, so the section shows the app before anything is
// fetched instead of an empty dark box.
const POSTERS: Record<Level['id'], string> = {
  beginner: beginnerPoster,
  difficult: difficultPoster,
}

export function Explainer() {
  const reveal = useReveal<HTMLDivElement>()

  const [levelId, setLevelId] = useState<Level['id']>('beginner')
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(false)
  const frameRef = useRef<HTMLDivElement | null>(null)

  const level = explainer.levels.find((item) => item.id === levelId) ?? explainer.levels[0]
  // A media fragment asks the browser for the range; the timeupdate guard below is what
  // actually enforces it, since fragment support is uneven.
  const src = level.cutoff ? `${SOURCES[level.id]}#t=0,${level.cutoff}` : SOURCES[level.id]

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // These files are tens of megabytes, so they start when the reader reaches them
  // rather than on page load. Nothing is fetched until the section is actually on
  // screen, and never at all for anyone who asked for reduced motion.
  useEffect(() => {
    if (reduce || playing) return

    const frame = frameRef.current
    if (!frame) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setPlaying(true)
      },
      { threshold: 0.4 },
    )

    observer.observe(frame)
    return () => observer.disconnect()
  }, [playing, reduce])

  return (
    <section aria-labelledby="explainer-heading" className="section" id="explainer">
      <div className={`shell ${reveal.className}`} ref={reveal.ref}>
        <SectionHeading body={explainer.body} id="explainer-heading" title={explainer.heading} />

        <div className="explainer__levels" role="group" aria-label={explainer.levelLabel}>
          {explainer.levels.map((item) => (
            <button
              aria-pressed={item.id === levelId}
              className={`explainer__level${item.id === levelId ? ' explainer__level--on' : ''}`}
              key={item.id}
              onClick={() => setLevelId(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="explainer__frame" ref={frameRef}>
          {playing ? (
            <video
              aria-label={`${explainer.heading} — ${level.label}`}
              autoPlay
              className="explainer__video"
              controls
              // Strips the download button and the picture-in-picture entry from the
              // control bar's overflow menu.
              controlsList="nodownload"
              disablePictureInPicture
              key={level.id}
              // Muted because no browser autoplays with sound. The tracks are 3-4 kbps,
              // so there is nothing to lose; controls are on if a viewer wants them.
              muted
              onTimeUpdate={(event) => {
                const video = event.currentTarget
                if (level.cutoff && video.currentTime >= level.cutoff) video.pause()
              }}
              playsInline
              poster={POSTERS[level.id]}
              src={src}
            />
          ) : (
            <button
              className="explainer__poster"
              onClick={() => setPlaying(true)}
              style={{ backgroundImage: `url(${POSTERS[level.id]})` }}
              type="button"
            >
              <span className="explainer__play">
                <svg aria-hidden="true" focusable="false" height="28" viewBox="0 0 24 24" width="28">
                  <path d="M8 5l11 7-11 7z" fill="currentColor" />
                </svg>
              </span>
              <span className="explainer__play-label">
                {explainer.play} — {level.label}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
