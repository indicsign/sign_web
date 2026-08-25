import type { SocialLink } from '../content'

type Props = {
  id: SocialLink['id']
}

const PATHS: Record<SocialLink['id'], string> = {
  facebook:
    'M12 2C6.48 2 2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12c0-5.52-4.48-10-10-10z',
  x:
    'M17.53 3h3.2l-6.99 7.99L21.94 21h-6.4l-4.4-5.77L5.98 21H2.77l7.28-8.32L2.06 3h6.56l4.08 5.4L17.53 3zm-1.12 16.13h1.77L7.68 4.78H5.78l10.63 14.35z',
  youtube:
    'M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19C2 8.77 2 12 2 12s0 3.23.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z',
  instagram: '',
}

export function SocialIcon({ id }: Props) {
  if (id === 'instagram') {
    return (
      <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24">
        <rect
          fill="none"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="2"
          width="18"
          x="3"
          y="3"
        />
        <circle cx="12" cy="12" fill="none" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" fill="currentColor" r="1.2" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24">
      <path d={PATHS[id]} fill="currentColor" />
    </svg>
  )
}
