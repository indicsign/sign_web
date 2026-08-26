import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { APP_URL, CTA_LABEL, LOGO_ALT, PRODUCT, nav } from '../content'
import logoUrl from '../assets/logo.png'
import './Header.css'

export function Header() {
  const [progress, setProgress] = useState(0)

  // The page is long enough now that a reader wants to know how much of it is left.
  // Read inside a frame so a fast scroll cannot queue a measurement per event.
  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {nav.skipToContent}
      </a>
      <div className="shell site-header__inner">
        <a className="site-header__brand" href="#main">
          {/* The visible wordmark names the link, so the mark itself is decorative —
              otherwise the lockup announces its name twice. */}
          <img alt="" className="site-header__logo" height={170} src={logoUrl} width={204} />
          <span className="site-header__product">{PRODUCT}</span>
          <span className="visually-hidden">{LOGO_ALT}</span>
        </a>
        <nav className="site-header__nav">
          <a className="site-header__link" href="#journey">
            {nav.journey}
          </a>
          <a className="site-header__link" href="#practice">
            {nav.practice}
          </a>
          <Button href={APP_URL}>{CTA_LABEL}</Button>
        </nav>
      </div>

      <div aria-hidden="true" className="site-header__progress">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  )
}
