# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A collection of reusable AI agent skills. Each skill is plain Markdown instructions, not application code. There is no build step for the skills themselves. The only code is the validator in `scripts/` and the GitHub Pages site in `site/` (pnpm), which the `Deploy Pages` workflow builds and publishes.

## Commands

```sh
python scripts/validate_skills.py              # validate every skill (CI, Python 3.12)
cd site && pnpm install && pnpm exec tsc -b     # type-check the site (CI)
cd site && pnpm run lint                        # oxlint (CI)
cd site && pnpm run build:pages                 # build the Pages site into site/_site/index.html (CI)
```

The validator has no flags and always checks every skill: frontmatter, broken relative links in `SKILL.md`, a row in the root `README.md` Skills table, and an entry in `site/src/skills.ts` whose `description` and `tools` match the frontmatter (`tools` mirrors the `Bash(...)` patterns in `allowed-tools`). It prints `N skill(s) OK` or one `skills/<name>: <error>` line per problem, and exits 1 on failure.

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
3. Add or update the skill's row in the **Skills** table in the root `README.md` and in `site/src/skills.ts`. The validator fails if the README row or `skills.ts` entry is missing or its description has drifted. The `summary`, `title`, `group`, and `blocks` in `skills.ts` are not checked, so keep the steps in `blocks` in sync with `SKILL.md` by hand.
4. Optionally run `cd site && pnpm install && pnpm run build:pages` and open `site/_site/index.html` to preview the site. The site deploys itself after merge (see below).
5. In the PR, use `.github/pull_request_template.md` ("What this adds" plus its checklist).

## The Pages site and CI

The site in `site/` is React + shadcn/ui with the VashFX Ember theme, bundled into a single `index.html`. `pnpm run build:pages` runs Parcel into `site/dist/`, then `html-inline` writes `site/_site/index.html`. Both folders are git-ignored.

| Workflow | Runs on | Does |
| --- | --- | --- |
| `validate.yml` | every PR, push to `main` | validator; site install, `tsc -b`, lint, `build:pages` |
| `pages.yml` (`Deploy Pages`) | push to `main` touching `site/`, or manual | `build:pages`, then deploys `site/_site` to GitHub Pages |
| `codeql.yml` | PR and push to `main`, weekly | CodeQL for Actions, JS/TS, Python |

- Never commit build output. There is no `docs/index.html` any more; the live site always comes from the latest `main` build.
- The repo's **Settings → Pages → Source** must stay **GitHub Actions**. Switching back to "Deploy from a branch" breaks the site.
- Tailwind is v4: the theme lives in an `@theme inline` block in `site/src/index.css` (there is no `tailwind.config.js`), and PostCSS is configured in `site/.postcssrc.json`. Site-specific classes (`ember-*`, `mono`, `icode`, `tabnum`) stay in `@layer components` so shadcn utilities can override them.
- Dependabot updates npm packages in `/site` and the GitHub Actions in the workflows, weekly. Because nothing built is committed, these PRs pass CI without manual rebuilds.

Markdown in this repo follows the `vashfx-style` skill's "Repository Markdown" rules: compact native tables, inline code for commands and paths, language tags on code fences, and blank lines around block elements.
