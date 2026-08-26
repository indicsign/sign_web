import type { CSSProperties } from 'react'
import './Confetti.css'

// Fixed rather than random, so a burst looks the same every time and renders
// identically on every visit. Colours come from the page palette.
const BITS = [
  { angle: 8, dist: '5.4rem', spin: '380deg', delay: '0ms', color: 'var(--color-accent)' },
  { angle: 34, dist: '6.6rem', spin: '-300deg', delay: '30ms', color: 'var(--color-role-article)' },
  { angle: 62, dist: '4.8rem', spin: '440deg', delay: '10ms', color: 'var(--color-role-verb)' },
  { angle: 90, dist: '7rem', spin: '-260deg', delay: '50ms', color: 'var(--color-past)' },
  { angle: 118, dist: '5.2rem', spin: '320deg', delay: '20ms', color: 'var(--color-accent)' },
  { angle: 146, dist: '6.2rem', spin: '-400deg', delay: '70ms', color: 'var(--color-wrong)' },
  { angle: 174, dist: '4.6rem', spin: '360deg', delay: '0ms', color: 'var(--color-role-article)' },
  { angle: 202, dist: '6.8rem', spin: '-340deg', delay: '40ms', color: 'var(--color-role-verb)' },
  { angle: 230, dist: '5rem', spin: '420deg', delay: '60ms', color: 'var(--color-past)' },
  { angle: 258, dist: '6.4rem', spin: '-280deg', delay: '15ms', color: 'var(--color-accent)' },
  { angle: 286, dist: '4.9rem', spin: '400deg', delay: '80ms', color: 'var(--color-wrong)' },
  { angle: 314, dist: '6rem', spin: '-360deg', delay: '25ms', color: 'var(--color-role-verb)' },
  { angle: 342, dist: '5.6rem', spin: '340deg', delay: '55ms', color: 'var(--color-role-article)' },
  { angle: 20, dist: '7.2rem', spin: '-440deg', delay: '90ms', color: 'var(--color-past)' },
]

export function Confetti() {
  return (
    <span aria-hidden="true" className="confetti">
      {BITS.map((bit) => (
        <span
          className="confetti__bit"
          key={bit.angle}
          style={{
            background: bit.color,
            '--angle': `${bit.angle}deg`,
            '--dist': bit.dist,
            '--spin': bit.spin,
            '--delay': bit.delay,
          } as CSSProperties}
        />
      ))}
    </span>
  )
}
