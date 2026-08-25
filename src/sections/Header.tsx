import { Button } from '../components/Button'
import { APP_URL, CTA_LABEL, LOGO_ALT, nav } from '../content'
import logoUrl from '../assets/logo.png'
import './Header.css'

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {nav.skipToContent}
      </a>
      <div className="shell site-header__inner">
        <a className="site-header__brand" href="#main">
          <img
            alt={LOGO_ALT}
            className="site-header__logo"
            height={170}
            src={logoUrl}
            width={204}
          />
        </a>
        <nav className="site-header__nav">
          <a className="site-header__link" href="#units">
            {nav.units}
          </a>
          <a className="site-header__link" href="#practice">
            {nav.practice}
          </a>
          <Button href={APP_URL}>{CTA_LABEL}</Button>
        </nav>
      </div>
    </header>
  )
}
