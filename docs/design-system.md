# Sparse Editorial / Archival Minimalism

Accepted direction: 2026-09-23. Scope: this portfolio, including Home, Blog,
articles, Contacts and Personal index (`/hub/`).

## Intent and rationale

The portfolio should feel like a personal catalogue: a nearly monochrome canvas,
small information clusters, generous empty space and restrained, intense media.
Hierarchy comes primarily from position, distance and weight. This preserves the
composition of the user's reference, rather than merely copying its white and
orange palette.

The subsequent user clarification extends the warm media colour to UI accents:
reading progress, TL;DR accents and article links must share that colour. It is
not limited to those three examples. The Personal index also needs its generated
thumbnail, presented as an independent image rather than a background hero.

## Visual contract

- **Composition:** use intentional asymmetry and strict local alignment. Keep
  content in small clusters with much larger gaps between independent clusters.
  On desktop, prefer content toward the sides and substantial open regions.
  On mobile, collapse naturally without preserving empty desktop columns.
- **Whitespace:** the reference's 20–35% content coverage is a compositional cue,
  not a pixel-count assertion. Typical internal gaps are 4–12 px and inter-cluster
  gaps 64–240 px; use judgment for text flow, touch targets and narrow screens.
  Article bodies need comfortable continuous reading, not artificial emptiness.
- **Typography:** neutral grotesk, compact titles, medium/semibold weight and
  slightly tight title tracking. Use regular body text and quiet metadata;
  uppercase sparingly. The current system stack is Helvetica Neue / Helvetica /
  Arial / sans-serif. Do not add a font dependency merely to match a named example.
- **Colour:** warm off-white canvas, near-black text and one warm accent family.
  Media carries most of the colour. UI emphasis uses the shared accent token;
  ordinary paragraphs and headings remain neutral. Do not add competing cool
  accents or independent near-matching hex values in components.
- **Media:** small standalone rectangles, consistent aspect ratios within each
  group, close crops and strong texture/contrast. Generated topographic covers
  are this project's implementation of that principle. Keep the Personal index
  thumbnail visible at desktop and mobile sizes. Avoid decorative frames and
  large background images behind text.
- **Surfaces:** flat, without decorative cards, shadows, pill-shaped controls or
  large radii. Use 0–4 px radii and thin low-contrast borders only where useful.
- **Metadata:** sparse numbering, dates and occasional marginal labels; do not
  introduce meaningless counters or copy ornamental metadata into every block.
- **Interaction:** keep focus visible, links identifiable and motion restrained.
  Respect reduced motion. Preserve working navigation and persisted page
  transitions while changing their appearance.
- **Language switcher:** show only the current language code as quiet text in
  the navigation, using neutral text at rest and the shared warm accent on hover
  and keyboard focus.
  When a translation exists, the code switches to it; otherwise it is static.
  Allow translated labels to wrap naturally at narrow widths.
- **Mobile navigation:** keep one row. Place the initials and language near the
  outer page edges, with the three page links spaced between them.

Article layout refinement (2026-09-23): the summary, body and article footer
share the full width of the article header, including its image column. Separate
the header from the reading content with whitespace, without a divider line.

## Implementation anchors

### Runtime tokens

Runtime values are defined in `src/styles/global.css`:

| Role | Token / current value |
| --- | --- |
| Canvas | `--color-bg`: `#f2f1ef` |
| Body ink | `--color-text-primary`: `#20201e` |
| Heading ink | `--color-text-bright`: `#111111` |
| Metadata | `--color-text-secondary`: `#666660` |
| Warm accent | `--color-accent`: `#9c411d` |

The legacy `--color-accent-light` and `--color-accent-light-dimmed` names alias the
same accent; they are not separate palette choices. Use `var(--color-accent)` for
new UI accents. Low-emphasis surfaces may use `color-mix` with this token, such as
the TL;DR background. Solid accents such as progress and the TL;DR border, and
article link text, share the same base colour. Keep link text sufficiently dark
on the canvas rather than borrowing a brighter orange from an image.

- `src/lib/generate-cover.ts`: deterministic artwork and warm tonal palette.
- `src/components/PostCard.astro`: compact image/text modules, no card surface.
- `src/components/HubBlock.astro` and `src/pages/hub.astro`: Personal index artwork.
- `src/layouts/BlogPost.astro`: article links, summary, code and quote accents.
- `src/layouts/Layout.astro`: reading progress.
- `src/components/PageSelector.tsx`: persisted navigation and active indicator.

## Why instructions, a skill and visual checks

`AGENTS.md` makes the workflow a project expectation. A repository skill loads
the relevant procedure for UI tasks. This document is the single design contract
and records the decision's rationale; a parallel ADR repeating it would drift.
Neither instructions nor an ADR mechanically enforce appearance.

For now, use the skill's browser checklist plus the existing build. There is no
automated visual regression suite in this repository. If recurrent regressions
justify one, add focused browser assertions for computed accent colours, visible
media, overflow and navigation, then screenshot comparisons for composition.
Use reviewed baselines and a fixed browser/OS/font environment. Do not update
baselines just to make a failing comparison pass, or replace visual checks with
regex tests of CSS source. Screenshot comparisons detect changes; they do not
decide whether a design is good.

## Sources consulted

- [OpenAI: repository skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI: project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Michael Nygard: decision records and rationale](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [Playwright: visual comparisons and environment constraints](https://playwright.dev/docs/test-snapshots)

Logo refinement (2026-09-24): retain the existing cube silhouette. Its three
faces use warm terracotta tones: the shared accent (#9c411d), a darker face
(#632b18), and a lighter top (#d88b52). Generate PNG and ICO variants from
the SVG so browser and installed-site icons retain the same identity.

Header logo refinement (2026-09-24): retain the warm cube at 24 px alongside
the existing role label, linking to the localized home. Keep it as a small
identity marker; the name remains the primary identity in the page content.
On the English and Italian home pages, use the text initials SF instead of
the cube in the header (2026-09-24).

## Link behaviour (2026-09-25)

Links inherit the surrounding text colour without an underline at rest. Hover
and keyboard focus use the shared warm accent and a 1 px underline, offset
3 px. Keyboard focus also retains the visible 2 px accent outline. Visited
links keep the same appearance. Colour transitions last 150 ms and respect
reduced motion; text and arrow icons do not move on hover.

In article prose, links are always warm and underlined; hover and focus increase
the underline to 2 px. For linked content blocks, only the title changes colour
and gains an underline, keeping descriptions, dates and artwork stable.
Navigation preserves its active-page accent and existing animated indicator.
Navbar links do not underline their text on hover, tap or keyboard focus;
use the warm colour and focus outline, keeping the active-page indicator separate.
Shared rules live in src/styles/global.css; avoid component-specific hover effects.

Accent restraint (2026-09-25): reserve persistent UI accents for active navigation,
article links, reading progress and the TL;DR border/tint. Language controls and
article tags are neutral at rest. List markers, quote borders, code borders and
section dividers use neutral tokens; omit decorative quote glyphs and gradient
accent bars. Media remains the primary source of colour. Shared link hover and
keyboard-focus feedback retain the warm accent.

## Dark mode (2026-09-25)

Follow the system appearance by default; the localized footer selector offers
System, Light and Dark and remembers explicit choices. Apply the theme before
paint and preserve it through client navigation. Dark mode uses neutral charcoal
(#111111) with neutral surfaces and borders, off-white ink (#e8e2db), muted warm grey (#b4aaa0), and a lighter
terracotta accent (#df9568) for readable links. Keep composition, accent restraint
and original artwork unchanged. All interface colours use the shared tokens.
