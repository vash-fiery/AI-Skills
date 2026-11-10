# VashFX Ember

Dark, card-based theme built from the vashfx-style skill: zinc neutrals, visible borders, muted panel headers, monospace values, one ember-orange accent, and a slight 3D effect. Cards float above a deeper background and are lit from above.

## Color Palette

Dark only. Tokens follow the `--viz-*` names the vashfx-style skill requires.

| Token | Role | Value |
| --- | --- | --- |
| `--viz-bg` | Page background, recessed wells (code, commands) | `#0c0c0e` |
| `--viz-card` | Card surface | `#18181b` |
| `--viz-card-top` | Card surface, top of gradient | `#1f1f23` |
| `--viz-panel` | Card header and button surface | `#26262b` |
| `--viz-panel-top` | Card header and button, top of gradient | `#2e2e34` |
| `--viz-border` | Card borders and dividers | `#34343a` |
| `--viz-text` | Primary text | `#fafafa` |
| `--viz-muted` | Secondary text, labels | `#a1a1aa` |
| `--viz-accent` | Ember accent: links, focus, key values | `#fb923c` |

### Data series

| Token | Name | Value |
| --- | --- | --- |
| `--viz-series-1` | Ember | `#fb923c` |
| `--viz-series-2` | Sky | `#38bdf8` |
| `--viz-series-3` | Emerald | `#34d399` |
| `--viz-series-4` | Violet | `#a78bfa` |
| `--viz-series-5` | Rose | `#fb7185` |

Always pair a series color with a text label, so meaning never depends on color alone.

## Typography

- **Headers**: Inter, semibold (600), compact line height
- **Body text**: Inter, regular (400)
- **Values and code**: JetBrains Mono, 12–13px

## 3D effect

| Token | Value | Use |
| --- | --- | --- |
| `--viz-bevel-hi` | `rgba(255,255,255,0.09)` | 1px inset highlight on top edges |
| `--viz-bevel-lo` | `rgba(0,0,0,0.55)` | 1px inset shade on bottom edges; recessed wells |
| `--viz-drop` | `rgba(0,0,0,0.5)` | Layered drop shadows |

- **Raised:** cards, card headers, buttons, and tags get a top-lit vertical gradient, the bevel (highlight on top, shade on bottom), and a layered drop shadow, so cards float above `--viz-bg`.
- **Recessed:** code blocks and command lines sit in `--viz-bg` wells with an inner shadow.
- **Pressed:** buttons sink 1px and switch to an inner shadow while clicked.

## Layout rules

- Cards: 8px radius, 1px `--viz-border`, **0px card padding**; content sits in inner rows and panels that carry their own padding.
- Card headers: `--viz-panel` gradient, compact spacing, bottom border.
- Tables and code: real text, horizontal scrolling when wide, syntax highlighting for code.

## Best Used For

Status reports, dashboards, rich previews, and technical docs for VashFX projects.
