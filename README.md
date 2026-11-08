# AI Skills

A curated collection of reusable AI agent skills, prompts, and workflows for Claude and other AI assistants.

## What's a skill?

A skill is a packaged set of instructions (and optional scripts or reference files) that teaches an AI assistant how to handle a specific kind of task the same way every time — a review checklist, a writing style, a deploy routine, a research method.

## Structure

```
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
| [commit-message](skills/commit-message/SKILL.md) | Writes a clear git commit message for staged changes |

## Contributing

1. Add a new folder under `skills/` (lowercase, hyphenated, e.g. `code-review`).
2. Write a `SKILL.md` using the [template](skills/README.md#skillmd-template). Its `name` must match the folder name.
3. Check it: `python scripts/validate_skills.py`
4. Add it to the table above and open a pull request. CI runs the same check.

## License

[MIT](LICENSE)
