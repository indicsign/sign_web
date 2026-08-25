import type { ReactNode } from 'react'
import './Button.css'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'quiet'
  href?: string
  onClick?: () => void
}

export function Button({ children, variant = 'primary', href, onClick }: Props) {
  const className = `button button--${variant}`

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {children}
    </button>
  )
}
