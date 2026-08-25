import { LottieScene } from '../components/LottieScene'
import { SocialIcon } from '../components/SocialIcon'
import { LOGO_ALT, footer, nav, social, stores } from '../content'
import logoUrl from '../assets/logo.png'
import playUrl from '../assets/lottie/google-play-download-button.json?url'
import appStoreUrl from '../assets/lottie/ios-store-download-now-button.json?url'
import './Footer.css'

// Both badges are fully drawn and motionless from f100 to f150, then an outro scales
// them to zero by f210. Holding f120 keeps the finished badge and never reaches that.
const BADGE_STOP_FRAME = 120

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand">
          <img alt={LOGO_ALT} height={170} src={logoUrl} width={204} />
          <p className="site-footer__tagline">{footer.tagline}</p>
        </div>

        {/* The header hides these links below 48rem, so on a phone this is the only
            way to move around the page. */}
        <nav className="site-footer__block">
          <h2 className="site-footer__heading">{footer.navHeading}</h2>
          <ul className="site-footer__links">
            <li>
              <a href="#units">{nav.units}</a>
            </li>
            <li>
              <a href="#vocabulary">{nav.words}</a>
            </li>
            <li>
              <a href="#practice">{nav.practice}</a>
            </li>
          </ul>
        </nav>

        <div className="site-footer__block">
          <h2 className="site-footer__heading">
            {stores.heading}
            <span className="site-footer__chip">{stores.pending}</span>
          </h2>
          {/* Dimmed and inert on purpose: a live-looking store badge that does nothing
              when pressed is worse than one that plainly reads as unavailable. */}
          <div className="site-footer__badges">
            <LottieScene className="site-footer__badge" ratio={2} src={playUrl} stopAt={BADGE_STOP_FRAME} />
            <LottieScene className="site-footer__badge" ratio={2} src={appStoreUrl} stopAt={BADGE_STOP_FRAME} />
          </div>
          <p className="site-footer__note">{stores.note}</p>
        </div>

        <div className="site-footer__block">
          <h2 className="site-footer__heading">{social.heading}</h2>
          <ul className="site-footer__social">
            {social.links.map((link) => (
              <li key={link.id}>
                <a
                  aria-label={link.label}
                  className="site-footer__social-link"
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <SocialIcon id={link.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell site-footer__legal">
        <p>{footer.copyright}</p>
      </div>
    </footer>
  )
}
