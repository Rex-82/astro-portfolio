---
name: portfolio-editorial-style
description: Apply and review this portfolio's sparse editorial style when changing rendered pages, components, CSS, media or interaction states.
---

# Portfolio editorial style

Read [the design contract](../../../docs/design-system.md) before UI work. Paths
below are relative to the repository root. Apply this workflow only to rendered
UI changes or visual reviews, not unrelated backend or content-only edits.

## Implement

1. Inspect the affected page and shared components, plus `src/styles/global.css`
   and any applicable contract anchors. Reuse existing tokens and generated
   artwork. Preserve unrelated working-tree changes.
2. Apply the contract to the requested scope. Treat composition and whitespace as
   design judgments; preserve readable article text and usable mobile layouts.
   Do not convert reference spacing or coverage suggestions into rigid tests.
3. For new emphasis, use the shared warm accent. Check sibling states/components
   so the progress bar, TL;DR border, article links, focus and active indicators
   do not drift into unrelated colours. Keep normal body text neutral.
4. If the user explicitly changes the direction, update the contract with that
   decision. Do not duplicate its rules into additional documents.

## Verify changed UI

- Run `pnpm build` and `git diff --check` for implementation changes.
- Inspect affected pages in a browser at desktop (about 1280 px), mobile (390 px)
  and narrow mobile (320 px). Shared styles require a representative pass through
  `/`, `/blog/`, an article, `/contacts/` and `/hub/`. For review-only tasks,
  inspect available evidence without changing the implementation.
- Inspect screenshots for cluster spacing, restrained media, flat surfaces,
  typography and a coherent warm accent. Check computed styles when colour
  inheritance is unclear; matching variable names alone is not proof.
- In an article, scroll to check that progress grows, and verify the progress
  colour, TL;DR border and prose link colour resolve to the same accent. Verify
  text contrast and visible link/focus states on the actual background.
- In Personal index, verify the generated thumbnail renders with nonzero bounds,
  remains small, and does not overlap the bio at any checked width. Ensure page
  scroll width does not exceed viewport width; hiding overflow is not a fix.
- Navigate between pages to verify persisted navigation updates correctly,
  including no stale active indicator on `/hub/`. Check keyboard access and
  reduced-motion behaviour when interaction or animation styles change.
- Report pages/viewports checked and actual outcomes. If browser verification is
  unavailable, state that limitation instead of claiming visual validation. A
  documentation-only edit needs link/frontmatter validation, not a site rebuild.

Do not install a visual-test framework for each UI edit. If regression tests are
requested or warranted by recurring failures, follow the contract's testing
strategy and verify observable behaviour rather than CSS source spelling.
