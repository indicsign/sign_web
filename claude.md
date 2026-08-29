Guidance for Claude Code when working in this repository.

## What this is

A marketing **landing page for the desktop version of the Indic AI app**, built as a
standalone React app and deployed as a section of the Indic AI website.

There is **no installer**. "Desktop version" means the app runs in a browser on a
desktop screen — the landing page's job is to get a visitor to *open* the app, not to
download anything. Never write download copy, OS badges, or "available for Windows"
anywhere on this page.

This is **not** the product itself. It is a single-purpose page whose one job is:
a visitor lands here, understands what the app teaches, and clicks through into it.
Everything on the page is judged against that job.

The product it markets is a language-learning app (grammar taught as units —
tenses, etc.). The desktop/web version is the newer surface; the mobile app already
exists.

**Not in this repo:** the app source (coming separately from the vendor,
Capermint), the syllabus comparison report, or the tense-unit content work.
Don't scaffold those here.

**Deploy target:** `https://sign.indic-ai.org` — served at the domain root from
the nginx image in `Dockerfile`, deployed on Railway. The page should still read as
part of the Indic AI site rather than a separate product, so match that palette,
type, and header/footer before inventing anything new. `base: './'` in
`vite.config.ts` keeps asset URLs relative, which is what makes the same build work
at the root and under a subpath; don't hardcode a path prefix.

> TODO for the team — confirm and replace: exact product name, logo/brand assets,
> the URL the primary CTA points to (where the web app actually opens), whether the
> app needs a login before use, and whether the existing site's header and footer are
> reused as-is or rebuilt. Until confirmed, treat the design tokens below
> as the source of truth.

## Stack

- React 18 + TypeScript (strict)
- Vite
- Plain CSS with CSS custom properties (see Design tokens). No Tailwind, no CSS-in-JS
  unless the team decides otherwise — this is one page and a stylesheet is enough.
- No router. Single page, anchor-scroll sections.
- No state library. `useState` is sufficient.

Keep dependencies near zero. Every package added to a landing page costs load time,
which is the one metric this page actually lives or dies by. Ask before adding one.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Before saying a task is done, run `npm run build` and `npm run lint` and confirm both
pass. A build that only works in dev is not done.

## Structure

```
src/
  main.tsx           # entry
  App.tsx            # section composition, nothing else
  sections/          # one file per page section (Hero.tsx, Features.tsx, ...)
  components/        # small reusable pieces (Button.tsx, SectionHeading.tsx)
  styles/
    tokens.css       # custom properties — the only place raw hex/px scale values live
    global.css       # reset, base type, layout primitives
  assets/            # images, icons, screenshots
  content.ts         # all page copy as typed constants
public/              # favicon, og image, downloads manifest
```

Copy lives in `src/content.ts`, not inline in JSX. Marketing text changes often and
non-developers will want to read it in one place.

## Conventions

- Function components with named exports. No default exports except `App`.
- Props typed with an explicit `type Props = { ... }` above the component. No `React.FC`.
- No `any`. If a type is genuinely unknown use `unknown` and narrow it.
- Files: `PascalCase.tsx` for components, `camelCase.ts` for everything else.
- Co-locate a component's CSS as `ComponentName.css` imported at the top of the file.
- Class names: `.hero`, `.hero__title`, `.hero--compact`. Blocks own their spacing;
  don't let a parent section and a child element both set margin on the same edge —
  that's where CSS in landing pages usually rots.
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, real `<button>` and
  `<a>` elements. A div with an onClick is a bug.

## Design direction

The page should look like it belongs to a serious learning product used by students
in India, not like a generic SaaS template. Concretely, avoid the current defaults:
cream background with a serif headline and a terracotta accent; near-black with one
acid-green accent; and hero layouts that are just a big number, three stats, and a
gradient. If a choice would be the same on a crypto site and a dentist's site, it's
the wrong choice here.

The hero should show the actual product doing its actual job — a real unit, real
grammar content on screen — rather than an abstract illustration. The most convincing
thing about a learning app is what a lesson looks like.

### Design tokens

All colors, type sizes, and spacing come from `src/styles/tokens.css`. Never write a
raw hex value or a magic pixel number in a component stylesheet.

```css
:root {
  /* Palette — replace with confirmed brand values, keep the role names */
  --color-ink: #1a1a1f;        /* primary text */
  --color-ink-soft: #5a5a66;   /* secondary text */
  --color-surface: #ffffff;    /* page background */
  --color-raised: #f4f4f7;     /* cards, alternating sections */
  --color-accent: #2f5bd0;     /* primary action, links */
  --color-accent-ink: #ffffff; /* text on accent */

  /* Type scale */
  --font-display: /* characterful display face — pick deliberately */;
  --font-body: /* readable body face, must support the scripts the site uses */;
  --step--1: 0.875rem;
  --step-0: 1rem;
  --step-1: 1.333rem;
  --step-2: 1.777rem;
  --step-3: 2.369rem;
  --step-4: 3.157rem;

  /* Spacing — 4px base */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --space-6: 4rem;
  --space-7: 6rem;

  --radius: 10px;
  --measure: 62ch; /* max line length for body copy */
}
```

If the site uses Devanagari or other Indic scripts alongside Latin, the body face must
cover them properly — check rendering in both scripts before committing a font choice.
Don't let a fallback font silently handle one script.

### Motion

One orchestrated moment beats five scattered ones. Prefer a single deliberate
page-load or scroll reveal over hover effects everywhere. Always wrap animation in
`@media (prefers-reduced-motion: reduce)` and provide a static fallback.

## Copy rules

- Write from the reader's side of the screen. Name things the user recognizes
  ("practice a unit"), not internals ("run a module instance").
- Active voice. A button says what happens: "Open the app", not "Get started".
- The same action keeps the same name everywhere. If the button says "Open the app",
  don't call it "Launch" in the footer and "Try it" in the hero. Pick one and hold it.
- Be specific over clever. "Five units on past and future tense" beats "Master
  grammar effortlessly."
- Sentence case for headings and buttons.
- Empty and error states get direction, not apology: say what happened and what to do.

## Quality floor

Non-negotiable, and don't announce these in the UI — just meet them:

- Responsive from 320px up. Test at 320, 768, 1280.
- Visible keyboard focus on every interactive element. Tab through the whole page.
- Real alt text on meaningful images, `alt=""` on decorative ones.
- Text contrast at least 4.5:1 against its background.
- Images sized and compressed; use `width`/`height` attributes to prevent layout shift.
- `<title>`, meta description, and Open Graph tags set — this page will be shared.
- The primary CTA is reachable without scrolling on a laptop viewport, and repeated
  once near the bottom of the page.
- Because the app is desktop-web, design for 1280–1440 first and scale down. Mobile
  visitors still need a usable page, but they are not the target reader here.

## Working style in this repo

- Prefer editing existing files to creating new ones. This is a small page; it does not
  need more architecture.
- Don't add a section, a dependency, or an abstraction that wasn't asked for.
- When the brief is ambiguous (which it currently is on branding), make one clear
  choice, state it in your response, and move on — don't build three variants.
- No comments in code explaining what obvious code does. Comment only genuinely
  non-obvious decisions.