export type Block =
  | { kind: "steps"; title?: string; items: string[] }
  | { kind: "list"; title?: string; items: string[] }
  | { kind: "table"; title?: string; head: [string, string]; rows: [string, string][] }
  | { kind: "text"; title?: string; body: string }

export type Group = "Writing" | "Review & fix" | "Style"

export interface Skill {
  name: string
  title: string
  group: Group
  summary: string
  description: string
  tools: string[]
  lead?: string
  blocks: Block[]
}

export const REPO = "vash-fiery/AI-Skills"
export const REPO_URL = "https://github.com/vash-fiery/AI-Skills"
export const SITE_URL = "https://vash-fiery.github.io/AI-Skills/"

export const skills: Skill[] = [
  {
    name: "code-review",
    title: "Code Review",
    group: "Review & fix",
    summary: "Reviews a diff or pull request for correctness, security, and maintainability.",
    description:
      'Review a local git diff or branch diff for correctness, security, and maintainability. Use when the user asks you to review their changes, asks "is this safe to merge?", or before committing non-trivial changes.',
    tools: ["git diff *", "git log *", "git show *"],
    lead: "Review what changed, not the whole codebase.",
    blocks: [
      {
        kind: "steps",
        items: [
          "Get the diff: `git diff` (unstaged), `git diff --staged`, or `git diff <base>...HEAD` for a branch. If the user names a base branch, diff against it. If there is no diff, say so and stop.",
          "Read the surrounding code for every changed function before judging it. A line that looks wrong in isolation may be correct in context.",
          "Check, in order: **correctness**, **security**, **behavior changes**, **tests**, then **maintainability** (keep those brief). If the change touches auth, secrets, or untrusted input, recommend a dedicated security review as well.",
          "For each finding give the file and line, what goes wrong, and a concrete input or scenario that triggers it. Drop anything you cannot back with a scenario.",
          "Rank findings most severe first. Label each **must fix**, **should fix**, or **nit**.",
          "Do not report style issues a linter or formatter already enforces.",
          "If you find nothing worth fixing, say so plainly. Do not invent findings.",
        ],
      },
    ],
  },
  {
    name: "commit-message",
    title: "Commit Message",
    group: "Writing",
    summary:
      "Writes a git commit message for what is staged: a 50-character imperative subject and a body that explains why. Commits when asked.",
    description:
      "Write a clear git commit message for staged changes, and commit them when asked. Use when the user asks to commit, or asks for a commit message.",
    tools: ["git diff *", "git log *", "git status *"],
    lead: "Write one commit message for what is staged.",
    blocks: [
      {
        kind: "steps",
        items: [
          "Run `git diff --staged` and read every change. If nothing is staged, say so and stop.",
          'Subject line: imperative mood ("Add", "Fix", "Remove"), at most 50 characters, no trailing period.',
          "Leave one blank line, then a body wrapped at 72 characters that explains **why** the change was made and anything a reviewer could miss. Skip the body for trivial changes.",
          "One logical change per commit. If the staged diff mixes unrelated changes, suggest splitting it.",
          "Follow the repository's existing style (`git log --oneline -20`), such as Conventional Commits prefixes, if it has one.",
          "If the user asked you to commit, run `git commit` with the message. Otherwise, show the message and stop.",
        ],
      },
    ],
  },
  {
    name: "debug",
    title: "Debug",
    group: "Review & fix",
    summary: "Finds the root cause of a bug, failing test, or error, fixes it, and verifies the fix.",
    description:
      "Find the root cause of a bug, failing test, or error and fix it. Use when something fails, throws, or behaves differently from what is expected.",
    tools: [],
    lead: "Find the cause before changing code.",
    blocks: [
      {
        kind: "steps",
        items: [
          "**Reproduce.** Get the exact command, input, or steps that show the failure, and run them. Copy the full error and stack trace. If you cannot reproduce it, gather more information instead of guessing.",
          "**Narrow it down.** Read the code on the failing path. Shrink the input, comment out parts, or use `git bisect` to find the commit that broke it.",
          "**Form hypotheses.** List two or three possible causes, each with a check that would prove or rule it out. Run the cheapest check first.",
          "**Confirm the cause.** Explain why the bug happens, not just where. Add logging or a breakpoint if needed, and remove it afterwards.",
          "**Write a failing test** that reproduces the bug, when the project has tests.",
          "**Fix the cause,** not the symptom. Do not silence errors, skip tests, or loosen checks.",
          "**Verify.** Run the failing test and the related suite, using the test command from the project's `CLAUDE.md`, README, or package scripts.",
          "**Report** the cause, the fix, and how you verified it, in a few sentences.",
        ],
      },
    ],
  },
  {
    name: "pr-description",
    title: "PR Description",
    group: "Writing",
    summary:
      "Writes a pull request title and description from the branch's commits and diff, and opens the PR when asked.",
    description:
      "Write a pull request title and description from the branch's commits and diff, and open the PR when asked. Use when the user asks to open a PR or asks for a PR description.",
    tools: ["git log *", "git diff *", "git merge-base *"],
    blocks: [
      {
        kind: "steps",
        items: [
          "Use the base branch the user gives, or find it (usually `main`), and read `git log --oneline <base>..HEAD` and `git diff <base>...HEAD`.",
          "Look for a PR template (`.github/pull_request_template.md` and the usual variants). If one exists, use its headings and fill checklists honestly.",
          '**Title:** imperative mood, under 70 characters, describing the outcome ("Add rate limiting to login endpoint"), not the activity.',
          "**Body** without a template: **Summary**, **Changes**, **Testing** (commands actually run), and **Notes** for breaking changes and follow-ups.",
          "Link issues with `Fixes #123` only when the PR fully resolves them; otherwise use `Refs #123`.",
          "Never include secrets, internal hostnames, or environment values.",
          "If the user asked you to open the PR, create it with `gh pr create` or a GitHub integration. Otherwise, show the title and body and stop.",
        ],
      },
    ],
  },
  {
    name: "release-notes",
    title: "Release Notes",
    group: "Writing",
    summary: "Writes release notes or a changelog entry from commits and merged pull requests.",
    description:
      "Write release notes or a changelog entry from commits and merged pull requests. Use when preparing a release, drafting notes for a new version or tag, or updating CHANGELOG.md.",
    tools: ["git log *", "git describe *"],
    blocks: [
      {
        kind: "steps",
        items: [
          "Find the range: the one the user gives, or from the previous tag (`git describe --tags --abbrev=0`) to `HEAD`. Read `git log --oneline <range>` and merged PR titles with `gh pr list --state merged`.",
          "If the repository has a `CHANGELOG.md`, follow its existing format.",
          "Group entries under **Breaking changes** (always first), **Added**, **Changed**, **Fixed**, and **Security**. Omit empty ones.",
          'Write each entry for the people using the software: "Fixed login failing when the email has uppercase letters," not "Refactor auth normalizer."',
          "Leave out internal-only changes unless the user asks for them.",
          "Reference PR or issue numbers at the end of each entry, such as `(#42)`.",
          "Write the notes only. Create a tag or release only if the user asks.",
          "Do not guess the version number. Use the one the user gives, or suggest one based on semantic versioning and say why.",
        ],
      },
    ],
  },
  {
    name: "vashfx-style",
    title: "VashFX Style",
    group: "Style",
    summary:
      "Applies the VashFX house style to Markdown docs, status reports, code examples, and styled HTML output.",
    description:
      "Apply Vash Fiery's house style to Markdown docs, status reports, code examples, and styled HTML previews in VashFX projects. Use when writing any of these in a VashFX repo, or when the user asks for VashFX styling.",
    tools: [],
    lead: "In VashFX projects, these rules take precedence over generic design or styling guidance.",
    blocks: [
      {
        kind: "table",
        title: "Rich output",
        head: ["Element", "Preference"],
        rows: [
          ["Container", "Compact Tailwind/shadcn-style cards with rounded corners and visible borders."],
          ["Card padding", "`0px`."],
          ["Headers", "Muted header and panel backgrounds, compact spacing."],
          ["Tables", "Colorized accents where supported; meaning readable from text labels alone."],
          ["Typography", "Monospace for values and code; a small, readable code font."],
          ["Code", "Language-aware syntax highlighting; source stays selectable and copyable."],
          ["Overflow", "Horizontal scrolling for wide tables and long code lines."],
        ],
      },
      {
        kind: "list",
        title: "Repository Markdown",
        items: [
          "Compact native tables.",
          "Inline code for commands, paths, and values: `npm run build`, `src/App.tsx`.",
          "Fenced code blocks with a language tag (`sh`, `ts`, `json`, `css`).",
          "Blank lines around tables, lists, headings, and code fences.",
          "Link to config files and manifests rather than copying version numbers into prose.",
        ],
      },
      {
        kind: "steps",
        title: "Checks before finishing",
        items: [
          "Every table and code block is text, not an image.",
          "Colors are never the only way meaning is shown.",
          "Code fences all have a language tag.",
          "Wide content scrolls horizontally instead of wrapping or overflowing.",
        ],
      },
    ],
  },
]
