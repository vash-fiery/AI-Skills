#!/usr/bin/env python3
"""Check that every folder under skills/ holds a valid SKILL.md."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "skills"
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def frontmatter(text):
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    if end == -1:
        return None
    fields = {}
    for line in text[4:end].splitlines():
        if ":" in line and not line.startswith((" ", "\t")):
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip()
    return fields


def check(skill_dir):
    errors = []
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        return ["missing SKILL.md"]
    fields = frontmatter(skill_md.read_text(encoding="utf-8"))
    if fields is None:
        return ["SKILL.md must start with a --- frontmatter block"]
    name = fields.get("name", "")
    if not name:
        errors.append("frontmatter is missing 'name'")
    elif name != skill_dir.name:
        errors.append(f"name '{name}' does not match folder '{skill_dir.name}'")
    elif not NAME_RE.match(name):
        errors.append(f"name '{name}' must be lowercase words joined by hyphens")
    if not fields.get("description"):
        errors.append("frontmatter is missing 'description'")
    return errors


def main():
    failed = False
    dirs = sorted(p for p in ROOT.iterdir() if p.is_dir())
    for skill_dir in dirs:
        for err in check(skill_dir):
            failed = True
            print(f"skills/{skill_dir.name}: {err}")
    if failed:
        return 1
    print(f"{len(dirs)} skill(s) OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
