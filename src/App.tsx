import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Explainer } from './sections/Explainer'
import { Journey } from './sections/Journey'
import { Vocabulary } from './sections/Vocabulary'
import { Practice } from './sections/Practice'
import { Features } from './sections/Features'
import { ClosingCta } from './sections/ClosingCta'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Explainer />
        <Journey />
        <Vocabulary />
        <Practice />
        <Features />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
