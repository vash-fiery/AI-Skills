---
name: commit-message
description: Write a clear git commit message for staged changes. Use when the user asks to commit, or asks for a commit message.
---

# Commit Message

Write one commit message for what is staged.

1. Run `git diff --staged` and read every change. If nothing is staged, say so and stop.
2. Subject line: imperative mood ("Add", "Fix", "Remove"), at most 50 characters, no trailing period.
3. Leave one blank line, then a body wrapped at 72 characters that explains **why** the change was made and anything a reviewer could miss. Skip the body for trivial changes.
4. One logical change per commit. If the staged diff mixes unrelated changes, suggest splitting it rather than writing one message for both.
5. Follow the repository's existing style (look at `git log --oneline -20`), such as Conventional Commits prefixes, if it has one.
