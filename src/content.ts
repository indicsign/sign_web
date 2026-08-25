// TODO(team): confirm the URL the web app actually opens at, and whether it needs a
// login first. Every CTA on the page points here.
export const APP_URL = 'https://gamepeg.com/full/indicai/app/'

export const BRAND = 'Indic AI'
export const LOGO_ALT = 'Indic AI — Foundation for social good'

export const CTA_LABEL = 'Open the web'

export const nav = {
  skipToContent: 'Skip to content',
  units: 'What you learn',
  words: 'The words',
  practice: 'How practice works',
} as const

export const hero = {
  eyebrow: 'English grammar in Indian Sign Language',
  title: 'Learn one tense at a time, until it stops being guesswork.',
  body:
    'Eight units on the English past, present and future tense, signed in Indian Sign Language and shape-coded on screen, so the grammar is something you can see rather than something you have to be told. Each unit is a short lesson, then practice on the same sentence you just read.',
  ctaNote: 'Works in your browser. Nothing to install.',
} as const

// Shape Coding, matched to the sentence artwork in "A Boy": an oval holds who or what,
// with its pictogram standing on it; a diamond holds the verb. Word colour marks the
// part of speech — article, noun, verb — the way the artwork underlines them.
export type Tense = 'past' | 'present' | 'future'
export type Shape = 'oval' | 'diamond' | 'hexagon'
export type Role = 'article' | 'noun' | 'verb'

export type Word = {
  text: string
  role?: Role
}

export type CodedToken = {
  /** Plain reading of the token, and the fallback when `words` is absent. */
  text: string
  words?: readonly Word[]
  shape?: Shape
  picture?: 'boy' | 'apple'
}

export const shapeKey = {
  heading: 'How to read the shapes',
  items: [
    {
      shape: 'oval' as Shape,
      label: 'A boy',
      meaning: 'an oval is who or what — the picture with its words underneath',
    },
    {
      shape: 'diamond' as Shape,
      label: 'ate',
      meaning: 'a diamond is the word carrying the tense — ate, is, will',
    },
    {
      shape: 'hexagon' as Shape,
      label: 'eating',
      meaning: 'a hexagon is the verb that follows it — eating, eat',
    },
  ],
} as const

export type Slide = {
  id: 'past' | 'present' | 'future'
  tense: Tense
  tenseLabel: string
  sentence: string
}

export const slides = {
  nav: {
    pick: 'Show',
    prev: 'Previous sentence',
    next: 'Next sentence',
    stop: 'Pause the slides',
    play: 'Play the slides',
    of: 'of',
  },
  sound: { on: 'Turn the sound off', off: 'Turn the sound on' },
  // No longer shown on the page — it is the video's accessible name only.
  videoLabel: 'The same sentence in Indian Sign Language',
  items: [
    {
      id: 'past',
      tense: 'past',
      tenseLabel: 'Past',
      sentence: 'A boy ate an apple',
    },
    {
      id: 'present',
      tense: 'present',
      tenseLabel: 'Present continuous',
      sentence: 'A boy is eating an apple',
    },
    {
      id: 'future',
      tense: 'future',
      tenseLabel: 'Future',
      sentence: 'A boy will eat an apple',
    },
  ] satisfies readonly Slide[],
} as const

export type Unit = {
  n: number
  title: string
  tense: Tense
  lessons: number
  covers: string
}

export const tenseLabels: Record<Tense, string> = {
  past: 'Past',
  present: 'Present',
  future: 'Future',
}

export const units = {
  heading: 'Eight units on past, present and future tense',
  body:
    'Each unit takes one tense and stays there until it is finished. The shapes do not change between units, so a sentence you meet in unit eight is marked up the way unit one taught you to read it.',
  items: [
    {
      n: 1,
      title: 'Past simple',
      tense: 'past',
      lessons: 6,
      covers: 'The past diamond, regular and irregular forms, and where the tense belongs',
    },
    {
      n: 2,
      title: 'Past continuous',
      tense: 'past',
      lessons: 5,
      covers: 'was and were with -ing, for the action that was already under way',
    },
    {
      n: 3,
      title: 'Past perfect',
      tense: 'past',
      lessons: 4,
      covers: 'had with the past participle, when one past thing happened before another',
    },
    {
      n: 4,
      title: 'Present simple',
      tense: 'present',
      lessons: 6,
      covers: 'The present diamond, and why he goes takes an s when they go does not',
    },
    {
      n: 5,
      title: 'Present continuous',
      tense: 'present',
      lessons: 5,
      covers: 'am, is and are with -ing, for what is happening as you sign it',
    },
    {
      n: 6,
      title: 'Present perfect',
      tense: 'present',
      lessons: 4,
      covers: 'have and has with the past participle, for what started before now and still holds',
    },
    {
      n: 7,
      title: 'Future with will',
      tense: 'future',
      lessons: 5,
      covers: 'The future diamond, and the contractions people actually sign and write',
    },
    {
      n: 8,
      title: 'Future with going to',
      tense: 'future',
      lessons: 4,
      covers: 'The difference between a plan you have made and a prediction you are making',
    },
  ] satisfies readonly Unit[],
} as const

export type VocabWord = {
  word: string
  kind: 'verb' | 'noun' | 'adverb'
  past?: string
  gloss: string
}

export const vocabulary = {
  heading: 'Every unit brings its own words',
  body:
    'A unit only builds sentences from words it has already taught, and each word is signed on its own before it turns up inside one. For the past simple that means the irregular forms, because those are the part you cannot work out from a rule.',
  unitLabel: 'Words in unit 1',
  pastLabel: 'past',
  items: [
    {
      word: 'go',
      kind: 'verb',
      past: 'went',
      gloss: 'to move from where you are to somewhere else',
    },
    {
      word: 'eat',
      kind: 'verb',
      past: 'ate',
      gloss: 'to take food into your mouth',
    },
    {
      word: 'write',
      kind: 'verb',
      past: 'wrote',
      gloss: 'to put words on paper or on a screen',
    },
    {
      word: 'buy',
      kind: 'verb',
      past: 'bought',
      gloss: 'to get something by paying for it',
    },
    {
      word: 'read',
      kind: 'verb',
      past: 'read',
      gloss: 'to look at words and understand them — spelt the same in the past',
    },
    {
      word: 'teach',
      kind: 'verb',
      past: 'taught',
      gloss: 'to help someone learn something',
    },
    {
      word: 'school',
      kind: 'noun',
      gloss: 'the place you go to learn',
    },
    {
      word: 'yesterday',
      kind: 'adverb',
      gloss: 'the day before today',
    },
  ] satisfies readonly VocabWord[],
} as const

export type PracticeOption = {
  id: string
  label: string
  correct: boolean
  feedback: string
}

export type Question = {
  id: Slide['id']
  tense: Tense
  tenseLabel: string
  prompt: readonly CodedToken[]
  options: readonly PracticeOption[]
}

export const practice = {
  heading: 'Practice on the sentences you just read',
  body:
    'The same boy and the same apple, once per tense. The shapes stay on screen while you answer, and a wrong form is told which rule it broke rather than just marked red.',
  blank: '___',
  next: 'Next question',
  restart: 'Start again',
  verdict: { correct: 'Correct', wrong: 'Wrong' },
  questions: [
    {
      id: 'past',
      tense: 'past',
      tenseLabel: 'Past',
      prompt: [
      { text: 'A boy', shape: 'oval', picture: 'boy',
        words: [{ text: 'A', role: 'article' }, { text: 'boy', role: 'noun' }] },
      { text: '___', shape: 'diamond', words: [{ text: '___', role: 'verb' }] },
      { text: 'an apple', shape: 'oval', picture: 'apple',
        words: [{ text: 'an', role: 'article' }, { text: 'apple', role: 'noun' }] },
      ],
      options: [
        {
          id: 'ate',
          label: 'ate',
          correct: true,
          feedback: 'Right. Nothing else carries the tense, so the diamond has to — ate.',
        },
        {
          id: 'eat',
          label: 'eat',
          correct: false,
          feedback: 'eat is the base form. It needs a word like will in front of it before it can hold a tense.',
        },
        {
          id: 'eaten',
          label: 'eaten',
          correct: false,
          feedback: 'eaten needs has or had in front of it. Standing alone in the diamond, use ate.',
        },
      ],
    },
    {
      id: 'present',
      tense: 'present',
      tenseLabel: 'Present continuous',
      prompt: [
      { text: 'A boy', shape: 'oval', picture: 'boy',
        words: [{ text: 'A', role: 'article' }, { text: 'boy', role: 'noun' }] },
      { text: 'is', shape: 'diamond', words: [{ text: 'is', role: 'verb' }] },
      { text: '___', shape: 'hexagon', words: [{ text: '___', role: 'verb' }] },
      { text: 'an apple', shape: 'oval', picture: 'apple',
        words: [{ text: 'an', role: 'article' }, { text: 'apple', role: 'noun' }] },
      ],
      options: [
        {
          id: 'eating',
          label: 'eating',
          correct: true,
          feedback: 'Right. is holds the tense in the diamond, so the hexagon takes eating.',
        },
        {
          id: 'eat',
          label: 'eat',
          correct: false,
          feedback: 'is eat is not English. After the diamond holding is, the hexagon takes -ing: eating.',
        },
        {
          id: 'ate',
          label: 'ate',
          correct: false,
          feedback: 'ate is past. Following is with it would mark two different tenses in one sentence.',
        },
      ],
    },
    {
      id: 'future',
      tense: 'future',
      tenseLabel: 'Future',
      prompt: [
      { text: 'A boy', shape: 'oval', picture: 'boy',
        words: [{ text: 'A', role: 'article' }, { text: 'boy', role: 'noun' }] },
      { text: 'will', shape: 'diamond', words: [{ text: 'will', role: 'verb' }] },
      { text: '___', shape: 'hexagon', words: [{ text: '___', role: 'verb' }] },
      { text: 'an apple', shape: 'oval', picture: 'apple',
        words: [{ text: 'an', role: 'article' }, { text: 'apple', role: 'noun' }] },
      ],
      options: [
        {
          id: 'eat',
          label: 'eat',
          correct: true,
          feedback: 'Right. will has already made it future in the diamond, so the hexagon takes the base form.',
        },
        {
          id: 'ate',
          label: 'ate',
          correct: false,
          feedback: 'ate is past. will ate puts the future and the past in the same sentence.',
        },
        {
          id: 'eating',
          label: 'eating',
          correct: false,
          feedback: 'will eating is not English. After the diamond holding will, the hexagon takes eat.',
        },
      ],
    },
  ] satisfies readonly Question[],
} as const

export const closing = {
  heading: 'Start with the first unit',
  body: 'The past simple, in six lessons. You can see whether it teaches the way you learn before you commit to anything.',
} as const

// TODO(team): replace with the real account URLs. These point at the platforms
// themselves rather than at a guessed handle, so nothing links to someone else's page.
export type SocialLink = {
  id: 'facebook' | 'instagram' | 'x' | 'youtube'
  label: string
  url: string
}

export const social = {
  heading: 'Follow us',
  links: [
    { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/' },
    { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/' },
    { id: 'x', label: 'X', url: 'https://x.com/' },
    { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/' },
  ] satisfies readonly SocialLink[],
} as const

// TODO(team): both badges are third-party recreations. Google and Apple require their
// own official artwork, so these need swapping before the apps actually ship.
export const stores = {
  heading: 'On your phone',
  pending: 'Coming soon',
  note: 'The mobile apps are not out yet. Use the web version in the meantime.',
} as const

export const footer = {
  tagline: 'English grammar taught in Indian Sign Language, one tense at a time.',
  navHeading: 'On this page',
  copyright: 'Copyright © 2025 Indic AI | All rights reserved',
} as const
