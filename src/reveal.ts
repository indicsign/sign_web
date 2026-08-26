import { useLayoutEffect, useRef, useState } from 'react'

/**
 * One reveal, used by every section, rather than a different effect per section.
 * Fires once and never again, so nothing re-animates on the way back up.
 *
 * The check runs in a layout effect, before the browser paints: anything already on
 * screen is marked shown straight away. Deciding after paint left a frame at zero
 * opacity, which read as a white flash.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  const [reduce, setReduce] = useState(false)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node || shown) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduce(true)
      setShown(true)
      return
    }

    // Already in view on load: show it immediately rather than animating something
    // the reader is looking at.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setShown(true)
      },
      // Held back slightly, so a block reveals as it settles rather than the instant
      // its first pixel appears.
      { rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  return { ref, shown, reduce, className: shown ? 'reveal reveal--in' : 'reveal' }
}
