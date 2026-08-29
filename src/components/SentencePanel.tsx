import { useEffect, useRef, useState } from 'react'
import { sentencePanel } from '../content'
import sentenceSvg from '../assets/sentences/A_boy_is_eating_an_apple.svg'
import sentenceVideo from '../assets/video/eating.mp4?url'
import './SentencePanel.css'

/**
 * One shape-coded sentence and the same sentence signed. This was a three-slide
 * carousel over past, present and future; the page no longer teaches tense contrast,
 * and a carousel of one is just a panel with dead controls attached.
 */
export function SentencePanel() {
  // Autoplay is only permitted while muted, so the clip starts silent and the reader
  // turns sound on. The signing carries the lesson, but the audio track is real
  // stereo narration, so it has to be reachable.
  const [sound, setSound] = useState(false)
  const [reduce, setReduce] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const video = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduce(query.matches)

    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

  useEffect(() => {
    const node = video.current
    if (!node) return

    node.muted = !sound

    if (reduce) {
      node.pause()
      return
    }

    void node.play().catch(() => {
      // An unmuted autoplay can still be refused. Fall back to silent playback rather
      // than leaving the clip stalled on a dead frame.
      node.muted = true
      setSound(false)
    })
  }, [reduce, sound])

  return (
    <figure className="panel">
      <div className="panel__bar">
        <span className="panel__stage">{sentencePanel.stage}</span>
      </div>

      <div className="panel__body">
        <img
          alt={sentencePanel.sentence}
          className="panel__sentence"
          height={390}
          src={sentenceSvg}
          width={1200}
        />

        <div className="panel__frame">
          {/* No control bar: it plays itself, like the illustrations do. Controls
              come back only under reduced motion, where nothing autoplays and the
              viewer would otherwise have no way to start it. */}
          <video
            aria-label={sentencePanel.videoLabel}
            className="panel__video"
            controls={reduce}
            controlsList="nodownload"
            disablePictureInPicture
            height={3218}
            loop
            muted
            playsInline
            preload="auto"
            ref={video}
            src={sentenceVideo}
            width={2574}
          />
        </div>
      </div>

      {/* Reduced motion already renders the native controls, which carry their own
          volume, so a second one would only duplicate it. */}
      {reduce ? null : (
        <div className="panel__nav">
          <button
            aria-label={sound ? sentencePanel.sound.on : sentencePanel.sound.off}
            aria-pressed={sound}
            className="panel__step"
            onClick={() => setSound((on) => !on)}
            type="button"
          >
            <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24">
              <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" />
              {sound ? (
                <>
                  <path
                    d="M15.5 9.2a4 4 0 0 1 0 5.6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </>
              ) : (
                <path
                  d="M15.8 9.8l4.4 4.4m0-4.4l-4.4 4.4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              )}
            </svg>
          </button>
        </div>
      )}
    </figure>
  )
}
