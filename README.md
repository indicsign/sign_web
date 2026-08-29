# Indic Sign — landing page

A single-page marketing site for **Indic Sign**, an app that teaches English grammar to
deaf and hard-of-hearing students through Indian Sign Language and a visual grammar
framework.

This repository is **the landing page only**. It is not the app. Its one job is to let
a visitor understand what the app teaches and then open it.

There is no installer. The app runs in a browser on a desktop screen, so nothing here
should ever say "download", name an operating system, or show a store badge.

## The idea it exists to explain

English is usually taught through phonetic rules. Those rules do not translate
visually, which leaves a deaf student decoding a system built on sounds they cannot
hear.

Indic Sign replaces the rule with a shape. Every part of a sentence has its own
container and its own text colour, so syntax becomes something you recognise by sight
rather than recall from memory. A student who has seen the pattern once can read the
structure of a sentence they have never met before.

### The nine containers

| Sentence structure | Question it answers | Shape | Text colour |
| --- | --- | --- | --- |
| Subject | Who or what? | oval | red |
| Object | Who or what? | rectangle | red |
| Verb | What doing? | hexagon | blue |
| Adjective phrase | What like, or how feeling? | cloud | green |
| Prepositional phrase | Where? | semicircle | yellow, **preposition only** |
| Time | When? | triangle | black |
| Adverbs and means | How? | right-facing triangle | brown, **adverb only** |
| Auxiliary verb | Is or are? | diamond | blue |
| Second person | Who is being spoken to? | downward semicircle | red |

Two of the nine colours mark a single word rather than the whole phrase. In *at
school* only **at** is yellow; in *very quickly* only **quickly** is brown. Getting
this wrong is the most common way to misread the system, so the page states it
explicitly.

The containers are drawn in CSS, not as images — see `src/styles/shapes.css`. The
oval, rectangle and both semicircles are borders and radii; the diamond, hexagon and
triangles are `clip-path` on two stacked layers, because `clip-path` takes no border,
so the outline is a second shape behind the fill. The cloud's arcs are past what
`clip-path: polygon()` can express, so it is masked from a silhouette instead. A mask
reads alpha only, which keeps every colour in the token file where it belongs.

## Stack

- React 18 + TypeScript, strict
- Vite 6
- Plain CSS with custom properties. No Tailwind, no CSS-in-JS
- No router — one page, anchor-scrolled sections
- No state library — `useState` is enough

Dependencies are kept near zero on purpose. A landing page lives or dies on load time,
and every package added is paid for by the reader. There are three runtime
dependencies: React, React DOM, and a Lottie player.

## Getting started

```bash
npm install
cp .env.example .env    # then fill in VITE_SUBPAGE
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Typechecks, then bundles to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

`npm run build` and `npm run lint` should both pass before any change is called done.
A build that only works in dev is not done.

## Configuration

One variable, and the build refuses to run without it.

**`VITE_SUBPAGE`** — the URL every call to action opens. It is deliberately not stored
in this repository; it lives in `.env`, which is gitignored, and is supplied to CI and
to image builds as a build-time value.

There is no fallback in the source, and that is intentional. The button component
takes an optional `href`, so an undefined URL renders a `<button>` instead of an `<a>`
— a control that looks correct, passes typechecking, raises no error, and does nothing
when clicked. `vite.config.ts` turns that silent failure into a failed build with
instructions.

The word *build-time* is load-bearing. Vite inlines `VITE_` variables into the bundle
when it compiles. Setting the variable on the host at run time is too late: the value
is already baked in, and the page will quietly ship whatever was present when it was
built.

```bash
# local
VITE_SUBPAGE=... npm run build

# docker
docker build --build-arg VITE_SUBPAGE=... .
```

## Structure

```
src/
  main.tsx           entry
  App.tsx            section composition, nothing else
  content.ts         all page copy, as typed constants
  reveal.ts          the one scroll reveal every section shares
  sections/          one file per page section, with its stylesheet
  components/        Button, SectionHeading, SentencePanel, LottieScene, Confetti
  styles/
    tokens.css       custom properties — the only place raw values live
    global.css       reset, base type, layout primitives
    shapes.css       the nine containers
  assets/            video, Lottie scenes, sentence artwork, pictograms
tools/
  shapecoder/        C++ generator for shape-coded sentence artwork
```

Page order is Hero → Features → ShapeKey → Explainer → Practice → Journey → Schools →
closing call to action. The framework is explained, the table shows it, the video
walks through it, then the reader is asked to use it.

Copy lives in `content.ts` rather than inline in JSX. Marketing text changes often, and
the people who change it are not always the people who write components.

## Conventions

- Function components, named exports. No default export except `App`
- Props typed with an explicit `type Props = { … }`. No `React.FC`
- No `any`. Where a type is genuinely unknown, `unknown`, narrowed
- `PascalCase.tsx` for components, `camelCase.ts` for everything else
- A component's CSS is co-located and imported at the top of the file
- Class names are `.hero`, `.hero__title`, `.hero--compact`. A block owns its own
  spacing; a parent and a child never both set margin on the same edge
- Semantic HTML. A `div` with an `onClick` is a bug

Every colour, type size and spacing value comes from `src/styles/tokens.css`. A raw hex
value or a magic pixel number in a component stylesheet is a defect, not a shortcut.

## Motion

One orchestrated moment per section, never five scattered ones. Sections reveal once as
they scroll into view and never re-animate on the way back up. The grammar table
cascades its rows; the school cards do the same.

Every animation is inside `@media (prefers-reduced-motion: no-preference)`, so under
reduced motion the rules do not exist at all and the content is simply there. That is a
static fallback, not a faster animation.

## Accessibility

Not announced in the UI, just met: usable from 320px up, visible keyboard focus on
every interactive element, real alt text on meaningful images and `alt=""` on
decorative ones, text contrast of at least 4.5:1, and width and height on images so
nothing shifts as the page loads.

Three of the framework's printed colours — green, yellow and brown — measure 2.9:1,
1.7:1 and 3.6:1 against white and cannot be used as text at those values. The tokens
carry darkened versions that clear 4.5:1 while keeping the hue. Yellow in particular is
unusable as printed.

## `tools/shapecoder`

A small C++17 program that renders a shape-coded sentence to SVG. It reads its palette
from `src/styles/tokens.css` at run time, so generated artwork and the live page cannot
drift apart.

It is a build-time tool, run by hand when sentence content changes. Nothing in
`npm run build` invokes it, and the page must keep building on a machine with no C++
compiler. See `tools/shapecoder/README.md`.

## Deployment

A multi-stage Docker build: Node compiles the bundle, then nginx serves the static
output. `vite.config.ts` sets `base: './'` so asset URLs stay relative and the same
image serves correctly from a domain root or a subpath — never hardcode a path prefix.

nginx reads its port from `PORT` at container start, substituted into `nginx.conf` by
the image's own entrypoint, because platforms assign the port they route to.

CI lints, typechecks and builds on every push and pull request. Only a push to `main`
publishes an image. Validation builds fall back to an unresolvable placeholder URL so
that a pull request from a fork — which receives no secrets — can still compile; the
publishing job has no fallback and fails if the real value is absent.

## Licence

Apache 2.0. See `LICENSE`.
