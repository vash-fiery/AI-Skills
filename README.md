# AI Skills

A curated collection of reusable AI agent skills, prompts, and workflows for Claude and other AI assistants.

Browse them on the site: <https://vash-fiery.github.io/AI-Skills/> (a React + shadcn/ui app in [`site/`](site/), built into [`docs/index.html`](docs/index.html)).

## What's a skill?

A skill is a packaged set of instructions (and optional scripts or reference files) that teaches an AI assistant how to handle a specific kind of task the same way every time — a review checklist, a writing style, a deploy routine, a research method.

## Structure

```text
skills/
  <skill-name>/
    SKILL.md        # name, description, and the instructions
    references/     # optional supporting docs
    scripts/        # optional helper scripts
```

## Using a skill

Copy a skill folder into your assistant's skills directory (for Claude Code: `~/.claude/skills/` or a project's `.claude/skills/`), then invoke it by name or let the assistant pick it up from its description.

## Skills

| Skill | What it does |
| --- | --- |
| [code-review](skills/code-review/SKILL.md) | Reviews a diff for correctness, security, and maintainability |
| [commit-message](skills/commit-message/SKILL.md) | Writes a clear git commit message for staged changes, and commits when asked |
| [debug](skills/debug/SKILL.md) | Finds a bug's root cause, fixes it, and verifies the fix |
| [pr-description](skills/pr-description/SKILL.md) | Writes a pull request title and description from the branch, and opens the PR when asked |
| [release-notes](skills/release-notes/SKILL.md) | Writes release notes or a changelog entry from commits and PRs |
| [vashfx-style](skills/vashfx-style/SKILL.md) | Applies Vash Fiery's house style to docs, reports, and previews |

## Contributing

1. Add a new folder under `skills/` (lowercase, hyphenated, e.g. `code-review`).
2. Write a `SKILL.md` using the [template](skills/README.md#skillmd-template). Its `name` must match the folder name.
3. Add it to the table above and to [`site/src/skills.ts`](site/src/skills.ts), with the same `description` and tools as the `SKILL.md`.
4. Check it: `python scripts/validate_skills.py`. This also fails if the table or `skills.ts` is missing the skill or has drifted from it.
5. Rebuild the site:

   ```sh
   cd site && pnpm install && pnpm run build:pages
   ```

6. Open a pull request. CI runs the validator, type-checks and lints the site, and fails if `docs/index.html` was not rebuilt.

## License

[MIT](LICENSE)
