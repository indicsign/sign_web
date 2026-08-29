import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { ShapeKey } from './sections/ShapeKey'
import { Explainer } from './sections/Explainer'
import { Practice } from './sections/Practice'
import { Journey } from './sections/Journey'
import { Schools } from './sections/Schools'
import { ClosingCta } from './sections/ClosingCta'
import { Footer } from './sections/Footer'

/**
 * The order the brief sets out: the framework is explained, then the grammar table
 * shows it, then the walkthrough video, then the reader tries it. The journey follows
 * as the wider arc, and the school-facing block sits last, before the closing call to
 * action.
 */
export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <ShapeKey />
        <Explainer />
        <Practice />
        <Journey />
        <Schools />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
