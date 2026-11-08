---
name: code-review
description: Review a diff or pull request for correctness, security, and maintainability. Use when the user asks for a review, asks "is this safe to merge?", or before committing non-trivial changes.
---

# Code Review

Review what changed, not the whole codebase.

1. Get the diff: `git diff` (unstaged), `git diff --staged`, or `git diff <base>...HEAD` for a branch. If there is no diff, say so and stop.
2. Read the surrounding code for every changed function before judging it. A line that looks wrong in isolation may be correct in context.
3. Check, in this order:
   - **Correctness:** wrong logic, off-by-one errors, unhandled `null`/empty/error cases, broken edge cases, race conditions.
   - **Security:** injection (SQL, shell, HTML), unvalidated input reaching URLs, headers, redirects, or file paths, leaked secrets, overly broad permissions.
   - **Behavior changes:** anything a caller or user will notice that the change does not mention.
   - **Tests:** is new or changed behavior covered? Does a bug fix have a regression test?
   - **Maintainability:** duplication, dead code, unclear names. Keep these brief.
4. For each finding give the file and line, what goes wrong, and a concrete input or scenario that triggers it. Drop anything you cannot back with a scenario.
5. Rank findings most severe first. Label each **must fix**, **should fix**, or **nit**.
6. Do not report style issues a linter or formatter already enforces.
7. If you find nothing worth fixing, say so plainly. Do not invent findings.
