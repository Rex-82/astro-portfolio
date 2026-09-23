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

## Implementation anchors

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
