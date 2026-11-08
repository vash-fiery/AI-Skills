---
name: pr-description
description: Write a pull request title and description from the branch's commits and diff. Use when the user asks to open a PR or asks for a PR description.
---

# PR Description

1. Find the base branch (usually `main`) and read `git log --oneline <base>..HEAD` and `git diff <base>...HEAD`.
2. Look for a PR template (`.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `PULL_REQUEST_TEMPLATE.md`, or `docs/PULL_REQUEST_TEMPLATE.md`). If one exists, use its headings. Fill checklists honestly; do not tick a box you have not verified.
3. **Title:** imperative mood, under 70 characters, describing the outcome ("Add rate limiting to login endpoint"), not the activity ("Updates").
4. **Body**, if there is no template:
   - **Summary:** what changed and why, in two to four sentences.
   - **Changes:** a short bullet list of the notable changes, grouped by area.
   - **Testing:** the commands you actually ran and their results. Say which checks you did not run.
   - **Notes:** breaking changes, follow-ups, or anything reviewers should look at closely.
5. Link related issues with `Fixes #123` only when the PR fully resolves them; otherwise use `Refs #123`.
6. Never include secrets, internal hostnames, or environment values.
