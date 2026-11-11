# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A collection of reusable AI agent skills. Each skill is plain Markdown instructions, not application code. There is no build step for the skills themselves. The only code is the validator in `scripts/` and the GitHub Pages site in `site/` (pnpm).

## Commands

```sh
python scripts/validate_skills.py   # validate every skill; CI runs exactly this (Python 3.12)
```

The validator has no flags and always checks every skill. It prints `N skill(s) OK` or one `skills/<name>: <error>` line per problem, and exits 1 on failure.

## Layout and conventions

- `skills/<skill-name>/SKILL.md` is required. A skill folder may also hold `references/` (supporting docs) and `scripts/` (helper scripts). Every subdirectory of `skills/` is treated as a skill, but loose files there (like `skills/README.md`) are skipped.
- `SKILL.md` must start with a `---` frontmatter block containing:
  - `name`: must exactly match the folder name, as lowercase words joined by hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`).
  - `description`: what the skill does **and when the assistant should use it**. The assistant chooses a skill from this line.
- The validator's frontmatter parser is a minimal `key: value` line reader, not a YAML parser. Keep each field's value on one line: block scalars (`>`, `|`) and indented continuation lines will not parse as you expect.
- The template is in `skills/README.md`. Existing skills are short numbered checklists of imperative steps (roughly 15 to 40 lines). Match that tone.

## Adding or changing a skill

1. Create or edit `skills/<name>/SKILL.md`.
2. Run `python scripts/validate_skills.py`.
3. Add or update the skill's row in the **Skills** table in the root `README.md` and in `site/src/skills.ts`, then run `cd site && pnpm install && pnpm run build:pages` to regenerate `docs/index.html` (the GitHub Pages site: React + shadcn/ui, VashFX Ember theme, bundled into one file). Never edit `docs/index.html` by hand. Nothing checks either step, so they are easy to forget.
4. In the PR, use `.github/pull_request_template.md` ("What this adds" plus its checklist).

Markdown in this repo follows the `vashfx-style` skill's "Repository Markdown" rules: compact native tables, inline code for commands and paths, language tags on code fences, and blank lines around block elements.
