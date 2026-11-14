#!/usr/bin/env python3
"""Check every skill under skills/, and that the README and site list them.

For each folder under skills/:
  - SKILL.md exists and starts with a --- frontmatter block
  - `name` matches the folder and is lowercase words joined by hyphens
  - `description` is present, on one line, and within the length limit
  - relative links in SKILL.md point at files that exist

Across the repo:
  - the README Skills table has exactly one row per skill
  - site/src/skills.ts has an entry per skill whose `description` and
    `tools` match the SKILL.md frontmatter
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO / "skills"
README = REPO / "README.md"
SITE_SKILLS = REPO / "site" / "src" / "skills.ts"

NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
MAX_NAME = 64
MAX_DESCRIPTION = 1024
LINK_RE = re.compile(r"\]\(([^)\s]+)\)")
README_ROW_RE = re.compile(r"^\|\s*\[([^\]]+)\]\(skills/([^/)]+)/SKILL\.md\)", re.M)
SITE_ENTRY_RE = re.compile(
    r'^ {4}name: "([^"]+)",.*?'
    r"^ {4}description:\s*([\"'])((?:\\.|(?!\2).)*)\2,\s*"
    r"^ {4}tools: \[(.*?)\]",
    re.S | re.M,
)


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


def allowed_tools(fields):
    """Bash(git diff *) Bash(git log *) -> ["git diff *", "git log *"]"""
    return re.findall(r"Bash\(([^)]*)\)", fields.get("allowed-tools", ""))


def js_string(quote, body):
    if quote == '"':
        return json.loads(f'"{body}"')
    return body.replace("\\'", "'").replace("\\\\", "\\")


def check(skill_dir):
    errors = []
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        return ["missing SKILL.md"], None
    text = skill_md.read_text(encoding="utf-8")
    fields = frontmatter(text)
    if fields is None:
        return ["SKILL.md must start with a --- frontmatter block"], None

    name = fields.get("name", "")
    if not name:
        errors.append("frontmatter is missing 'name'")
    elif name != skill_dir.name:
        errors.append(f"name '{name}' does not match folder '{skill_dir.name}'")
    elif not NAME_RE.match(name):
        errors.append(f"name '{name}' must be lowercase words joined by hyphens")
    elif len(name) > MAX_NAME:
        errors.append(f"name is longer than {MAX_NAME} characters")

    description = fields.get("description", "")
    if not description:
        errors.append("frontmatter is missing 'description'")
    elif description in (">", "|", ">-", "|-"):
        errors.append("description must be on one line, not a YAML block scalar")
    elif len(description) > MAX_DESCRIPTION:
        errors.append(f"description is longer than {MAX_DESCRIPTION} characters")

    for target in LINK_RE.findall(text):
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        path = target.split("#", 1)[0]
        if path and not (skill_dir / path).exists():
            errors.append(f"broken link to '{target}'")

    return errors, fields


def check_readme(skills):
    errors = []
    rows = README_ROW_RE.findall(README.read_text(encoding="utf-8"))
    linked = [folder for _, folder in rows]
    for label, folder in rows:
        if label != folder:
            errors.append(f"README: row label '{label}' does not match its link 'skills/{folder}'")
        if folder not in skills:
            errors.append(f"README: row for '{folder}', which is not a skill")
        elif linked.count(folder) > 1:
            errors.append(f"README: more than one row for '{folder}'")
    for name in skills:
        if name not in linked:
            errors.append(f"README: Skills table has no row for '{name}'")
    return sorted(set(errors))


def check_site(skills):
    errors = []
    entries = {}
    for m in SITE_ENTRY_RE.finditer(SITE_SKILLS.read_text(encoding="utf-8")):
        name, quote, body, tools = m.groups()
        entries[name] = (
            js_string(quote, body),
            [js_string(q, b) for q, b in re.findall(r"([\"'])((?:\\.|(?!\1).)*)\1", tools)],
        )
    for name in entries:
        if name not in skills:
            errors.append(f"site/src/skills.ts: entry for '{name}', which is not a skill")
    for name, fields in skills.items():
        if name not in entries:
            errors.append(f"site/src/skills.ts: no entry for '{name}'")
            continue
        description, tools = entries[name]
        if description != fields.get("description", ""):
            errors.append(f"site/src/skills.ts: '{name}' description differs from SKILL.md")
        if tools != allowed_tools(fields):
            errors.append(f"site/src/skills.ts: '{name}' tools differ from SKILL.md allowed-tools")
    return errors


def main():
    failed = False
    skills = {}
    dirs = sorted(p for p in ROOT.iterdir() if p.is_dir())
    for skill_dir in dirs:
        errors, fields = check(skill_dir)
        for err in errors:
            failed = True
            print(f"skills/{skill_dir.name}: {err}")
        if fields is not None:
            skills[skill_dir.name] = fields
    for err in check_readme(skills) + check_site(skills):
        failed = True
        print(err)
    if failed:
        return 1
    print(f"{len(dirs)} skill(s) OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
