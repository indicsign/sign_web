// Every CTA on the page opens this. VITE_SUBPAGE overrides it per environment; Vite
// inlines VITE_ variables at BUILD time, so it has to be set before `npm run build`
// and not on the host at run time.
//
// The guard is `||`, not `??`: an unset Docker ARG arrives as an empty string rather
// than undefined, and `??` would let that through as href="".
//
// TODO(team): confirm whether the app needs a login before it can be used.
export const APP_URL =
  import.meta.env.VITE_SUBPAGE?.trim()
  
export const BRAND = 'Indic Sign'
export const PRODUCT = 'Indic AI Sign'
export const LOGO_ALT = 'Indic AI — Foundation for social good'

export const CTA_LABEL = 'Start learning today'

export const nav = {
  skipToContent: 'Skip to content',
  journey: 'The journey',
  words: 'The words',
  shapes: 'The shapes',
  schools: 'For schools',
  practice: 'How practice works',
} as const

export const hero = {
  title: 'Mastering English for deaf students through the language of visuals',
  body:
    'For deaf and hard-of-hearing students, English is usually taught through phonetic rules that do not translate visually. Indic Sign turns English syntax into a visual, logical puzzle instead — Indian Sign Language alongside a proven visual grammar framework, so sentence structure becomes concrete and intuitive for visual learners.',
  ctaNote: 'Made for classrooms and for home.',
} as const

// Shape Coding, matched to the sentence artwork in "A Boy": an oval holds who or what,
// with its pictogram standing on it; a diamond holds the verb. Word colour marks the
// part of speech the way the artwork underlines them. The full framework is nine
// containers; the sentences on this page use four of them, and the key below shows
// all nine.
export type Shape =
  | 'oval'
  | 'rectangle'
  | 'hexagon'
  | 'cloud'
  | 'semicircle'
  | 'triangle'
  | 'triangle-right'
  | 'diamond'
  | 'semicircle-down'
export type Slot = 'who' | 'what' | 'where'
export type Role = 'article' | 'noun' | 'verb' | 'adjective' | 'preposition' | 'time' | 'adverb'

export type Word = {
  text: string
  role?: Role
}

export type CodedToken = {
  /** Plain reading of the token, and the fallback when `words` is absent. */
  text: string
  words?: readonly Word[]
  shape?: Shape
  /** Which question the container answers. Drives the shape's fill. */
  slot?: Slot
  picture?: 'boy' | 'apple'
}

export type KeyRow = {
  /** The grammatical part, as the framework names it. */
  part: string
  /** The question a student asks to find it. */
  question: string
  shape: Shape
  slot?: Slot
  /** An example shown inside the container, coloured the way the framework colours it. */
  words: readonly Word[]
  colour: {
    name: string
    role: Role
    /** Set where the colour marks one word rather than the whole phrase. */
    only?: string
  }
}

// The nine containers, in the order the framework's own table lists them. Kept as a
// plain typed array rather than a const assertion so a row without a slot stays the
// same shape as one with it.
const KEY_ROWS: readonly KeyRow[] = [
  {
    part: 'Subject',
    question: 'Who or what?',
    shape: 'oval',
    slot: 'who',
    words: [{ text: 'A', role: 'article' }, { text: 'boy', role: 'noun' }],
    colour: { name: 'Red', role: 'noun' },
  },
  {
    part: 'Object',
    question: 'Who or what?',
    shape: 'rectangle',
    words: [{ text: 'an', role: 'article' }, { text: 'apple', role: 'noun' }],
    colour: { name: 'Red', role: 'noun' },
  },
  {
    part: 'Verb',
    question: 'What doing?',
    shape: 'hexagon',
    words: [{ text: 'eating', role: 'verb' }],
    colour: { name: 'Blue', role: 'verb' },
  },
  {
    part: 'Adjective phrase',
    question: 'What like, or how feeling?',
    shape: 'cloud',
    words: [{ text: 'happy', role: 'adjective' }],
    colour: { name: 'Green', role: 'adjective' },
  },
  {
    part: 'Prepositional phrase',
    question: 'Where?',
    shape: 'semicircle',
    slot: 'where',
    words: [{ text: 'at', role: 'preposition' }, { text: 'school' }],
    colour: { name: 'Yellow', role: 'preposition', only: 'the preposition only' },
  },
  {
    part: 'Time',
    question: 'When?',
    shape: 'triangle',
    words: [{ text: 'today', role: 'time' }],
    colour: { name: 'Black', role: 'time' },
  },
  {
    part: 'Adverbs and means',
    question: 'How?',
    shape: 'triangle-right',
    words: [{ text: 'quickly', role: 'adverb' }],
    colour: { name: 'Brown', role: 'adverb', only: 'the adverb only' },
  },
  {
    part: 'Auxiliary verb',
    question: 'Is or are?',
    shape: 'diamond',
    words: [{ text: 'is', role: 'verb' }],
    colour: { name: 'Blue', role: 'verb' },
  },
  {
    part: 'Second person',
    question: 'Who is being spoken to?',
    shape: 'semicircle-down',
    slot: 'who',
    words: [{ text: 'you', role: 'noun' }],
    colour: { name: 'Red', role: 'noun' },
  },
]

export const shapeKey = {
  heading: 'Every sentence, in nine containers',
  body:
    'This is the whole framework. A part of a sentence always takes the same shape and the same colour, so a student who has seen it once can read the structure of a sentence they have never met before.',
  columns: {
    part: 'Sentence structure',
    shape: 'Shape',
    colour: 'Text colour',
    example: 'Example',
  },
  // Names the scrollable region. Below the breakpoint the table is wider than the
  // screen, and a region a mouse can scroll has to be reachable from the keyboard too.
  tableLabel: 'The nine containers',
  // Two of the nine colours mark one word rather than the whole container, and a
  // reader who misses that will colour the noun after a preposition yellow.
  note: 'Yellow marks the preposition itself and brown the adverb itself — the rest of those phrases stays in the plain ink.',
  items: KEY_ROWS,
} as const

export const shapeNames = {
  oval: 'oval',
  rectangle: 'rectangle',
  hexagon: 'hexagon',
  cloud: 'cloud',
  semicircle: 'semi-circle',
  triangle: 'triangle',
  'triangle-right': 'right-facing triangle',
  diamond: 'diamond',
  'semicircle-down': 'upside-down semi-circle',
} satisfies Record<Shape, string>

export type Slide = {
  id: 'past' | 'present' | 'future'
  stage: string
  sentence: string
}

// TODO(team): these three clips are the old tense set, kept because they are the only
// signed sentences we have. Replace with Aashna's Unit 3 reference videos — the ids
// map to the files in src/assets/video and src/assets/sentences.
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
    { id: 'past', stage: 'Sentences', sentence: 'A boy ate an apple' },
    { id: 'present', stage: 'Sentences', sentence: 'A boy is eating an apple' },
    { id: 'future', stage: 'Sentences', sentence: 'A boy will eat an apple' },
  ] satisfies readonly Slide[],
} as const

export type Stage = {
  n: number
  title: string
  line: string
  detail: string
}

export const journey = {
  heading: 'A complete English journey',
  body:
    'Four stages, each building on the one before it. A student moves from single words to whole stories without ever being asked to hear a sound. The journey completes when they stop only understanding a sentence and start producing one — typing it out, word by word, on a QWERTY keyboard.',
  items: [
    {
      n: 1,
      title: 'Words',
      line: 'Mastering daily vocabulary.',
      detail: 'Everyday words, each one signed and shown before it is ever read in a sentence.',
    },
    {
      n: 2,
      title: 'Sentences',
      line: 'Connecting ideas logically.',
      detail: 'Shape-coded sentence building, so word order becomes a pattern the eye can recognise.',
    },
    {
      n: 3,
      title: 'Paragraphs',
      line: 'Structuring larger thoughts.',
      detail: 'Sentences joined into a paragraph that holds one idea from beginning to end.',
    },
    {
      n: 4,
      title: 'Stories',
      line: 'Immersive reading & expression.',
      detail: 'Reading for meaning, and writing back — the point everything else has been building towards.',
    },
  ] satisfies readonly Stage[],
} as const

export type Flow = {
  id: string
  title: string
  /** One line on what the sequence is for, above the steps themselves. */
  line: string
  steps: readonly string[]
}

export type Principle = {
  id: string
  title: string
  body: string
  /** Which mechanic to demonstrate above the words. */
  demo: 'shapes' | 'tokens'
}

// Two of these are sequences and two are properties. Shown as four identical cards
// they would all read as the same kind of thing, which is what made the section flat.
export const features = {
  heading: 'How the visual grammar framework works',
  body:
    'Seeing is understanding. Indic Sign steps away from abstract grammar drills and uses a structured system of shapes and colours to map out how English sentences are built. A student learns to associate a part of a sentence — the subject, a prepositional phrase — with its own visual container, which is the bridge across to written English.',
  featuresHeading: 'Key features for literacy acquisition',
  flows: [
    {
      id: 'lesson',
      title: 'ISL and lip-reading in every lesson',
      line: 'So a student connects English text straight to the ways they already communicate.',
      steps: [
        'Five seconds of real-world video, so the sentence has a situation before it has words.',
        'An animated ISL translation of that same sentence.',
        'A lip-reading clip, held close on the mouth.',
      ],
    },
    {
      id: 'quiz',
      title: 'Progressive interactive quizzes',
      line: 'Tiered modules, each asking for more than the one before it.',
      steps: [
        'Pick out the correct structure.',
        'Assemble a sentence from scrambled words.',
        'Supply the missing word with nothing to choose from.',
      ],
    },
  ] satisfies readonly Flow[],
  principles: [
    {
      id: 'shapes',
      demo: 'shapes',
      title: 'Shape-coded sentence building',
      body: 'Words sit inside grammatical containers — an oval for who, its words in red; an upright semi-circle for where, its preposition in yellow. Syntax is recognised by sight rather than recalled as a rule.',
    },
    {
      id: 'anti-guessing',
      demo: 'tokens',
      title: 'Anti-guessing interface',
      body: 'Every token and drop zone is one width, so no answer can be read off the length of a word. A student has to apply the vocabulary and the grammar.',
    },
  ] satisfies readonly Principle[],
} as const

export type Level = {
  id: 'beginner' | 'difficult'
  label: string
  /** Native pixel size. The frame never renders larger than this — upscaling a screen
      recording smears the app's own text, and shrinking it makes that text unreadable,
      so 1:1 is the target. */
  width: number
  height: number
  /** Seconds to stop at, when the file runs past the part worth showing. */
  cutoff?: number
}

export const explainer = {
  heading: 'Watch a lesson',
  body: 'A full walkthrough of the app, from the first word to a finished sentence. Take the level that matches the class.',
  play: 'Play the walkthrough',
  levelLabel: 'Choose a level',
  levels: [
    { id: 'beginner', label: 'Beginner', width: 1280, height: 576 },
    // The file runs to 2:37, but the last nine seconds are not part of the walkthrough.
    { id: 'difficult', label: 'Difficult', width: 816, height: 368, cutoff: 148 },
  ] satisfies readonly Level[],
} as const

export type VocabWord = {
  word: string
  kind: 'noun' | 'verb' | 'adjective'
  gloss: string
  /** Set where an ISL clip for the word exists. */
  sign?: 'water'
}

export const vocabulary = {
  heading: 'Everyday words, signed first',
  body:
    'A word is signed on its own before it ever turns up inside a sentence. These come from the first stage of the journey, so a student meets them long before they have to read them in context.',
  label: 'Words in stage one',
  items: [
    { word: 'water', kind: 'noun', gloss: 'the clear drink that comes from a tap or a well', sign: 'water' },
    { word: 'school', kind: 'noun', gloss: 'the place you go to learn' },
    { word: 'mother', kind: 'noun', gloss: 'the woman who is your parent' },
    { word: 'book', kind: 'noun', gloss: 'pages joined together that you read' },
    { word: 'house', kind: 'noun', gloss: 'the building you live in' },
    { word: 'friend', kind: 'noun', gloss: 'someone you like and choose to be with' },
    { word: 'eat', kind: 'verb', gloss: 'to take food into your mouth' },
    { word: 'happy', kind: 'adjective', gloss: 'the way you feel when something is good' },
  ] satisfies readonly VocabWord[],
} as const

export type BuildToken = {
  id: string
  label: string
  words: readonly Word[]
  /** Said when the token is dropped somewhere it does not belong. */
  belongs: string
}

export type BuildSlot = {
  id: string
  shape: Shape
  slot?: Slot
  picture?: 'boy' | 'apple'
}

export type BuildRound = {
  id: 'past' | 'present' | 'future'
  label: string
  sentence: string
  slots: readonly BuildSlot[]
  tokens: readonly BuildToken[]
}

const WHO: BuildToken = {
  id: 'who',
  label: 'A boy',
  words: [{ text: 'A', role: 'article' }, { text: 'boy', role: 'noun' }],
  belongs: 'A boy is who the sentence is about. That is the red oval at the front.',
}

const WHAT: BuildToken = {
  id: 'what',
  label: 'an apple',
  words: [{ text: 'an', role: 'article' }, { text: 'apple', role: 'noun' }],
  belongs: 'an apple is what gets eaten. It goes in the white oval at the end.',
}

// An empty shape shows nothing but its own outline and fill. The colour and the form
// are the only clues, which is the whole skill being trained — the word and its
// picture appear only once the shape has been filled correctly.
export const practice = {
  heading: 'Build the sentence',
  body:
    'The same boy and the same apple, once for each tense. Every token is the same width, so nothing can be worked out from the length of a word — the shape and its colour are the only clues, and they are the ones worth learning.',
  tray: 'Drag each word into the shape it belongs in, or press a word and then press a shape.',
  tag: 'Quiz practice',
  wrongLabel: 'Not there',
  doneLabel: 'Correct',
  restart: 'Start again',
  next: 'Next tense',
  // Names the container for a screen reader without naming the role it wants — the
  // shape is on screen either way, the answer is not.
  shapeNames,
  emptyLabel: 'Empty',
  rounds: [
    {
      id: 'past',
      label: 'Past',
      sentence: 'A boy ate an apple',
      slots: [
        { id: 'who', shape: 'oval', slot: 'who', picture: 'boy' },
        { id: 'tensed', shape: 'diamond' },
        { id: 'what', shape: 'oval', slot: 'what', picture: 'apple' },
      ],
      tokens: [
        WHAT,
        {
          id: 'tensed',
          label: 'ate',
          words: [{ text: 'ate', role: 'verb' }],
          belongs: 'ate carries the tense on its own, so it belongs in the diamond.',
        },
        WHO,
      ],
    },
    {
      id: 'present',
      label: 'Present',
      sentence: 'A boy is eating an apple',
      slots: [
        { id: 'who', shape: 'oval', slot: 'who', picture: 'boy' },
        { id: 'tensed', shape: 'diamond' },
        { id: 'verb', shape: 'hexagon' },
        { id: 'what', shape: 'oval', slot: 'what', picture: 'apple' },
      ],
      tokens: [
        {
          id: 'verb',
          label: 'eating',
          words: [{ text: 'eating', role: 'verb' }],
          belongs: 'eating does not hold the tense — is does. It goes in the hexagon.',
        },
        WHO,
        WHAT,
        {
          id: 'tensed',
          label: 'is',
          words: [{ text: 'is', role: 'verb' }],
          belongs: 'is is the word carrying the tense, and that always sits in the diamond.',
        },
      ],
    },
    {
      id: 'future',
      label: 'Future',
      sentence: 'A boy will eat an apple',
      slots: [
        { id: 'who', shape: 'oval', slot: 'who', picture: 'boy' },
        { id: 'tensed', shape: 'diamond' },
        { id: 'verb', shape: 'hexagon' },
        { id: 'what', shape: 'oval', slot: 'what', picture: 'apple' },
      ],
      tokens: [
        {
          id: 'tensed',
          label: 'will',
          words: [{ text: 'will', role: 'verb' }],
          belongs: 'will is what makes it future, so it takes the diamond.',
        },
        WHAT,
        {
          id: 'verb',
          label: 'eat',
          words: [{ text: 'eat', role: 'verb' }],
          belongs: 'will already holds the tense, so eat stays plain and goes in the hexagon.',
        },
        WHO,
      ],
    },
  ] satisfies readonly BuildRound[],
} as const

export type SchoolPoint = {
  id: string
  title: string
  body: string
}

// Addressed to a head teacher or a coordinator, not to a student. Everything else on
// the page is written to the learner; this section is the one that is not.
export const schools = {
  tag: 'For schools',
  heading: 'Pioneering a new paradigm in deaf education',
  body:
    'For decades, English grammar has been taught to deaf students with phonetic methods designed for hearing learners. Indic Sign teaches syntax visually instead. Abstract grammatical rules become concrete, so students reach higher-level grammar — and the meaning it carries in context — without relying on sound.',
  curriculumHeading: 'A comprehensive digital curriculum',
  curriculumBody:
    'The platform is built to sit inside a school\'s existing framework, and to support the teacher as well as the student.',
  points: [
    {
      id: 'library',
      title: 'An expansive content library',
      body: 'Over a thousand distinct sentence modules — the repetition and the variety that real language acquisition takes.',
    },
    {
      id: 'alignment',
      title: 'Academic alignment',
      body: 'Milestones calibrated to meet and exceed the foundational benchmarks expected in the early-primary years, so deaf students have equal access to standard outcomes.',
    },
    {
      id: 'syntax',
      title: 'From vocabulary to complex syntax',
      body: 'Past flashcard memorisation: students decode complex sentence structures with the visual grammar framework, learning how and why words fit together to make meaning.',
    },
    {
      id: 'educators',
      title: 'Empowering educators',
      body: 'A standardised, engaging way for staff to explain the mechanics of English syntax visually — the app works as an assistive teaching tool, not only a student one.',
    },
  ] satisfies readonly SchoolPoint[],
  partnerHeading: 'Partner with us for inclusive excellence',
  partnerBody:
    'Bringing this into your classrooms is a step towards genuine educational equity. Adopting the visual approach lets your school help lead the next generation of inclusive education, and turns frustration into fluency for the students in it.',
  // TODO(team): no contact route exists yet. Confirm where a school should write to,
  // and this section gets the button it is currently missing.
} as const

export const closing = {
  heading: 'Empowering inclusive education',
  body:
    'The curriculum is built to scale inclusive education — assistive technology that fits into the classroom and into the home. Indic Sign gives students the tools to decode English confidently and independently. It opens in a browser, so there is nothing to install and nothing to wait for.',
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
