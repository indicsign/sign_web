import { useEffect, useRef } from 'react'
import type { AnimationItem, AnimationSegment } from 'lottie-web'
import './LottieScene.css'

type Props = {
  src: string
  className?: string
  ratio?: number
  /** Frame to play up to and hold. Use when an animation's own ending is unusable. */
  stopAt?: number
  loop?: boolean
}

export function LottieScene({ src, className, ratio, stopAt, loop = false }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let animation: AnimationItem | null = null
    let cancelled = false

    const start = async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import('lottie-web/build/player/lottie_light'),
        fetch(src).then((response) => response.json() as Promise<unknown>),
      ])
      if (cancelled) return

      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const segment: AnimationSegment | undefined = stopAt ? [0, stopAt] : undefined

      animation = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: still ? false : loop,
        autoplay: !still,
        animationData: data,
        initialSegment: segment,
      })

      // The static fallback has to be a settled frame, not frame 0 — frame 0 is the
      // state before anything has been drawn.
      if (still) animation.goToAndStop(stopAt ?? animation.totalFrames - 1, true)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        // A decorative illustration must never take the page down with it.
        void start().catch(() => undefined)
      },
      { rootMargin: '200px' },
    )

    observer.observe(host)

    return () => {
      cancelled = true
      observer.disconnect()
      animation?.destroy()
    }
  }, [src, stopAt, loop])

  return (
    <div
      aria-hidden="true"
      className={className ? `lottie ${className}` : 'lottie'}
      ref={hostRef}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  )
}
