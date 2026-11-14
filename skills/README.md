# Skills

Each skill lives in its own folder here:

```text
skills/
  <skill-name>/
    SKILL.md        # required
    references/     # optional supporting docs
    scripts/        # optional helper scripts
```

## SKILL.md template

```markdown
---
name: skill-name
description: One line on what this skill does and when the assistant should use it.
allowed-tools: Bash(git diff *) Bash(git log *)
---

# Skill Name

1. Short, imperative steps the assistant follows when this skill is used.
```

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | Must match the folder name: lowercase words joined by hyphens, at most 64 characters. |
| `description` | Yes | One line, at most 1024 characters. Say what the skill does **and when to use it**; the assistant picks skills from this line. |
| `allowed-tools` | No | Space-separated tool patterns the skill may run without a permission prompt. Keep it to read-only commands. |

Keep every field on one line: the validator does not read YAML block scalars (`>`, `|`).
