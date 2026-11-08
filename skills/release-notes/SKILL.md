---
name: release-notes
description: Write release notes or a changelog entry from commits and merged pull requests. Use when preparing a release, tagging a version, or updating CHANGELOG.md.
---

# Release Notes

1. Find the range: from the previous tag (`git describe --tags --abbrev=0`) to `HEAD`, or the range the user gives. Read `git log --oneline <range>` and the merged PR titles.
2. If the repository has a `CHANGELOG.md`, follow its existing format (for example, [Keep a Changelog](https://keepachangelog.com/)).
3. Group entries under these headings, and omit empty ones:
   - **Breaking changes** (always first, with what users must do to upgrade)
   - **Added**
   - **Changed**
   - **Fixed**
   - **Security**
4. Write each entry for the people using the software, not the people who wrote it: what they can now do or what no longer goes wrong. "Fixed login failing when the email has uppercase letters," not "Refactor auth normalizer."
5. Leave out internal-only changes (CI tweaks, refactors, dependency bumps without user impact) unless the user asks for them.
6. Reference PR or issue numbers at the end of each entry, such as `(#42)`.
7. Do not guess the version number. Use the one the user gives, or suggest one based on semantic versioning and say why.
