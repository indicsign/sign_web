# shapecoder

Draws a sentence in the visual grammar framework and writes it out as SVG.

This is a **build-time tool**, not part of the page. Run it when the sentence content
changes and commit the SVG it produces. Nothing in `npm run build` invokes it, and the
page must keep building on a machine with no C++ compiler — that is deliberate. A
landing page lives or dies on load time, and this way the artwork costs the reader
nothing beyond the SVG itself.

## Build

```bash
cd tools/shapecoder && make
```

C++17 and a standard library. No dependencies, no package manager.

## Use

Run it from the repository root, so it can find `src/styles/tokens.css`:

```bash
./tools/shapecoder/shapecoder --out src/assets/sentences \
  "subject:A boy" "aux:is" "verb:eating" "object:an apple"
```

Without `--out` it writes the SVG to stdout, which is the quick way to look at one.

| Option | Meaning |
| --- | --- |
| `--out <dir>` | Write `<Sentence>.svg` into `<dir>`. Default is stdout. |
| `--tokens <path>` | Stylesheet to read colours from. Default `src/styles/tokens.css`. |
| `--height <px>` | Container height. Everything else is proportional to it. Default 208. |

## Writing a sentence

Each argument is one container: `part:words`.

| Key | Container | Colour |
| --- | --- | --- |
| `subject` | oval | red, articles in purple |
| `object` | rectangle | red, articles in purple |
| `verb` | hexagon | blue |
| `adj` | cloud | green |
| `prep` | semicircle | yellow, **preposition only** |
| `time` | triangle | black |
| `adverb` | right-facing triangle | brown, **adverb only** |
| `aux` | diamond | blue |
| `you` | downward semicircle | red |

Two of the nine colours mark one word rather than the whole phrase. Without a marker
the tool finds that word by position — a preposition opens its phrase, an adverb
closes one:

```bash
"prep:at school"        # at yellow, school in plain ink
"adverb:very quickly"   # very in plain ink, quickly brown
```

Where position is not enough, mark the word with `*`:

```bash
"adverb:*fast enough"   # fast brown, enough in plain ink
```

## Colours

Read from `src/styles/tokens.css` at run time rather than copied into this tool, so the
generated artwork and the page cannot drift. `tokens.css` stays the only place in the
project where a raw hex value lives. If the stylesheet is missing a `--color-role-*`
the tool draws that word black and says so on stderr.

## What it does not do

- **No pictograms.** The vendor artwork in `src/assets/sentences/` has a boy and an
  apple standing on their containers. Those are image assets; this tool draws
  containers and words only, so do not overwrite that artwork with output from here.
- **No parsing.** It will not work out that "quickly" is an adverb. You label the
  constituents; the tool draws what you labelled. Parsing English into constituents is
  a much larger problem than drawing them.
- **Text widths are estimated.** Measuring properly means reading the font. The
  estimate only decides whether a container is widened to hold a long phrase, and the
  interior fractions carry slack for it. Underlines are drawn by the renderer, so they
  match the real glyphs regardless.
