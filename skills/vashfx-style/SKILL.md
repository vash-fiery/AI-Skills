---
name: vashfx-style
description: Apply Vash Fiery's house style to Markdown docs, status reports, code examples, and styled HTML previews in VashFX projects. Use when writing any of these in a VashFX repo, or when the user asks for VashFX styling.
---

# VashFX Style

In VashFX projects, these rules take precedence over generic design or styling guidance.

## Rich output (HTML, previews, dashboards)

| Element | Preference |
| --- | --- |
| Container | Compact Tailwind/shadcn-style cards with rounded corners and visible borders. |
| Card padding | `0px`. |
| Headers | Muted header and panel backgrounds, compact spacing. |
| Tables | Colorized cells or accents where supported; keep meaning readable from text labels alone. |
| Typography | Monospace for values and code; a small, readable code font. |
| Code | Language-aware syntax highlighting; source stays selectable and copyable. |
| Overflow | Horizontal scrolling for wide tables and long code lines. |

Use these theme tokens consistently: `--viz-card`, `--viz-panel`, `--viz-border`, `--viz-text`, `--viz-muted`, and `--viz-series-*`. Keep tables and code as real text, never SVG or image-only replacements.

For the token values (colors, fonts, and the raised and recessed 3D effect), use the VashFX Ember theme in [`references/theme.md`](references/theme.md).

## Repository Markdown

GitHub controls colors, fonts, and padding, so keep Markdown plain:

- Compact native tables.
- Inline code for commands, paths, and values: `npm run build`, `src/App.tsx`.
- Fenced code blocks with a language tag (`sh`, `ts`, `json`, `css`).
- Blank lines around tables, lists, headings, and code fences.
- Link to config files and manifests rather than copying version numbers into prose.

## Checks before finishing

1. Every table and code block is text, not an image.
2. Colors are never the only way meaning is shown.
3. Code fences all have a language tag.
4. Wide content scrolls horizontally instead of wrapping or overflowing.
