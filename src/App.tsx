import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Units } from './sections/Units'
import { Vocabulary } from './sections/Vocabulary'
import { Practice } from './sections/Practice'
import { ClosingCta } from './sections/ClosingCta'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Units />
        <Vocabulary />
        <Practice />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
