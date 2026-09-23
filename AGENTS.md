# Portfolio guidance

## Visual changes

For work that changes the rendered UI (pages, layouts, components, CSS, media or
interaction states), read and apply
[portfolio-editorial-style](.agents/skills/portfolio-editorial-style/SKILL.md)
before editing. The visual contract and its rationale live in
[docs/design-system.md](docs/design-system.md); keep those rules in that single
source rather than duplicating them here.

Explicit user changes to the visual direction take precedence. Update the
contract in the same change when a new direction is requested; do not silently
reinterpret it to justify an unrelated implementation.

## Code review rules

For UI reviews, use the skill's verification checklist. Report concrete deviations
from the visual contract and missing verification. A successful build alone is
not evidence of visual correctness; say which pages and viewports were checked.
