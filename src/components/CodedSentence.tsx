import { Fragment } from 'react'
import type { ReactNode } from 'react'
import type { CodedToken } from '../content'
import boyPic from '../assets/pictograms/boy.webp'
import applePic from '../assets/pictograms/apple.webp'
import './CodedSentence.css'

const PICTURES = { boy: boyPic, apple: applePic }

type Props = {
  tokens: readonly CodedToken[]
  className?: string
  /** Marker inside a word to swap for `slot`. */
  blank?: string
  slot?: ReactNode
}

export function CodedSentence({ tokens, className, blank, slot }: Props) {
  return (
    <p className={className ? `coded ${className}` : 'coded'}>
      {tokens.map((token, i) => {
        const words = token.words ?? [{ text: token.text }]

        const inner = words.map((word, w) => {
          const isSlot = Boolean(blank && slot && word.text === blank)
          return (
            <Fragment key={`${word.text}-${w}`}>
              {isSlot ? (
                slot
              ) : (
                <span className={word.role ? `coded__word coded__word--${word.role}` : 'coded__word'}>
                  {word.text}
                </span>
              )}
            </Fragment>
          )
        })

        if (!token.shape) {
          return (
            <Fragment key={`${token.text}-${i}`}>
              <span className="coded__plain">{inner}</span>
            </Fragment>
          )
        }

        return (
          <span className="coded__unit" key={`${token.text}-${i}`}>
            {/* The word sits right beneath the picture, so the picture is decorative. */}
            {token.picture ? (
              <img alt="" className="coded__pic" src={PICTURES[token.picture]} />
            ) : null}
            <span className={`coded__shape coded__shape--${token.shape}`}>
              <span className="coded__words">{inner}</span>
            </span>
          </span>
        )
      })}
    </p>
  )
}
