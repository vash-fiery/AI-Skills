import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, ExternalLink, Search, Terminal } from "lucide-react"
import { REPO, REPO_URL, SITE_URL, skills, type Block, type Group, type Skill } from "./skills"

const GROUP_COLOR: Record<Group, string> = {
  Writing: "var(--viz-series-2)",
  "Review & fix": "var(--viz-series-3)",
  Style: "var(--viz-series-1)",
}
const FILTERS = ["All", "Writing", "Review & fix", "Style"] as const
type Filter = (typeof FILTERS)[number]

/* Renders `code` and **bold** inside a line of skill text. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? (
          <code key={i} className="icode">{p.slice(1, -1)}</code>
        ) : p.startsWith("**") ? (
          <strong key={i} className="font-semibold text-[color:var(--viz-text)]">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (id: string, text: string, el?: HTMLElement | null) => {
    const done = () => {
      setCopied(id)
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600)
    }
    const select = () => {
      if (!el) return
      const r = document.createRange()
      r.selectNodeContents(el)
      const s = window.getSelection()
      s?.removeAllRanges()
      s?.addRange(r)
    }
    try {
      navigator.clipboard.writeText(text).then(done, select)
    } catch {
      select()
    }
  }
  return { copied, copy }
}

function CopyCommand({ id, cmd, copied, onCopy }: { id: string; cmd: string; copied: boolean; onCopy: (el: HTMLElement | null) => void }) {
  let codeEl: HTMLElement | null = null
  return (
    <div className="ember-well flex items-center gap-2.5 py-2.5 pl-3.5 pr-2.5">
      <Terminal className="h-3.5 w-3.5 shrink-0 text-[color:var(--viz-muted)]" aria-hidden />
      <code
        id={id}
        ref={(el) => (codeEl = el)}
        className="mono min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[0.86rem]"
      >
        {cmd}
      </code>
      <Button
        size="sm"
        variant="outline"
        className="ember-btn h-7 shrink-0 gap-1.5 px-3 text-xs hover:border-[color:var(--viz-accent)] hover:text-[color:var(--viz-accent)]"
        onClick={() => onCopy(codeEl)}
        aria-label={`Copy command: ${cmd}`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

function Panel({ title, meta, children, labelId }: { title: ReactNode; meta?: ReactNode; children: ReactNode; labelId?: string }) {
  return (
    <section className="ember-card" aria-labelledby={labelId}>
      <div className="ember-head">
        <h2 id={labelId} className="text-[0.95rem] font-semibold leading-tight">{title}</h2>
        {meta && <span className="mono text-[0.8rem] text-[color:var(--viz-muted)]">{meta}</span>}
      </div>
      {children}
    </section>
  )
}

function StepList({ items, start = 1 }: { items: ReactNode[]; start?: number }) {
  return (
    <ol className="m-0 list-none p-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.8rem_minmax(0,1fr)] gap-1.5 px-3.5 py-3 [&+li]:border-t [&+li]:border-[color:var(--viz-border)]"
        >
          <span className="mono tabnum font-semibold text-[color:var(--viz-accent)]">{start + i}</span>
          <div className="min-w-0">{item}</div>
        </li>
      ))}
    </ol>
  )
}

function BlockView({ block }: { block: Block }) {
  const heading = block.title && (
    <div className="border-y border-[color:var(--viz-border)] bg-[color:var(--viz-panel)] px-3.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[color:var(--viz-muted)]">
      {block.title}
    </div>
  )
  if (block.kind === "steps")
    return (
      <div>
        {heading}
        <StepList items={block.items.map((t, i) => <p key={i} className="text-[color:var(--viz-muted)]"><Rich text={t} /></p>)} />
      </div>
    )
  if (block.kind === "list")
    return (
      <div>
        {heading}
        <ul className="m-0 list-none p-0">
          {block.items.map((t, i) => (
            <li key={i} className="flex gap-2.5 px-3.5 py-2.5 text-[color:var(--viz-muted)] [&+li]:border-t [&+li]:border-[color:var(--viz-border)]">
              <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--viz-accent)]" />
              <span className="min-w-0"><Rich text={t} /></span>
            </li>
          ))}
        </ul>
      </div>
    )
  if (block.kind === "table")
    return (
      <div>
        {heading}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.93rem]">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="border-b border-[color:var(--viz-border)] px-3.5 py-2 text-left text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[color:var(--viz-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([k, v]) => (
                <tr key={k} className="[&:not(:last-child)>td]:border-b [&>td]:border-[color:var(--viz-border)]">
                  <td className="mono whitespace-nowrap px-3.5 py-2 align-top font-medium text-[color:var(--viz-series-2)]">{k}</td>
                  <td className="min-w-[240px] px-3.5 py-2 align-top text-[color:var(--viz-muted)]"><Rich text={v} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  return (
    <div>
      {heading}
      <p className="px-3.5 py-3 text-[color:var(--viz-muted)]"><Rich text={block.body} /></p>
    </div>
  )
}

function GroupChip({ group }: { group: Group }) {
  return (
    <span className="mono inline-flex items-center gap-1.5 whitespace-nowrap text-[0.75rem] text-[color:var(--viz-muted)]">
      <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: GROUP_COLOR[group] }} />
      {group}
    </span>
  )
}

function SkillDetail({ skill, copied, copy }: { skill: Skill; copied: string | null; copy: ReturnType<typeof useCopy>["copy"] }) {
  const path = `skills/${skill.name}/SKILL.md`
  const install = `cp -r AI-Skills/skills/${skill.name} ~/.claude/skills/`
  return (
    <section className="ember-card" aria-labelledby="detail-title">
      <div className="ember-head">
        <span className="mono text-[0.95rem] font-semibold" id="detail-title">/{skill.name}</span>
        <a
          href={`${REPO_URL}/blob/main/${path}`}
          target="_blank"
          rel="noreferrer"
          className="mono inline-flex items-center gap-1 text-[0.8rem] text-[color:var(--viz-muted)] underline-offset-[3px] hover:text-[color:var(--viz-accent)] hover:underline"
        >
          {path}
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>

      <div className="flex flex-col gap-3 px-3.5 py-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-[1.35rem] font-semibold tracking-[-0.01em]">{skill.title}</h2>
          <GroupChip group={skill.group} />
        </div>
        <div>
          <div className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[color:var(--viz-muted)]">description</div>
          <p className="max-w-[68ch] text-[color:var(--viz-text)]">{skill.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[color:var(--viz-muted)]">allowed-tools</span>
          {skill.tools.length ? (
            skill.tools.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="mono rounded-[4px] border-[color:var(--viz-border)] bg-[color:var(--viz-panel)] px-1.5 py-0 text-[0.75rem] font-normal text-[color:var(--viz-series-3)]"
                style={{ boxShadow: "var(--bevel)" }}
              >
                Bash({t})
              </Badge>
            ))
          ) : (
            <span className="text-[0.85rem] text-[color:var(--viz-muted)]">none pre-approved; the assistant asks as usual</span>
          )}
        </div>
      </div>

      {skill.lead && (
        <p className="border-t border-[color:var(--viz-border)] px-3.5 py-2.5 italic text-[color:var(--viz-text)]">{skill.lead}</p>
      )}
      <div className="border-t border-[color:var(--viz-border)]">
        {skill.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>
      <div className="border-t border-[color:var(--viz-border)]">
        <CopyCommand
          id={`install-${skill.name}`}
          cmd={install}
          copied={copied === `install-${skill.name}`}
          onCopy={(el) => copy(`install-${skill.name}`, install, el)}
        />
      </div>
    </section>
  )
}

function readHash() {
  const h = decodeURIComponent(location.hash.replace(/^#/, ""))
  return skills.some((s) => s.name === h) ? h : skills[0].name
}

export default function App() {
  const [selected, setSelected] = useState<string>(() => readHash())
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")
  const { copied, copy } = useCopy()

  useEffect(() => {
    const onHash = () => setSelected(readHash())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skills.filter(
      (s) =>
        (filter === "All" || s.group === filter) &&
        (!q || [s.name, s.title, s.description, s.summary].some((f) => f.toLowerCase().includes(q))),
    )
  }, [query, filter])

  const current = skills.find((s) => s.name === selected) ?? skills[0]
  const scoped = skills.filter((s) => s.tools.length).length

  const pick = (name: string) => {
    setSelected(name)
    try {
      history.replaceState(null, "", `#${name}`)
    } catch {
      location.hash = name
    }
    if (window.matchMedia("(max-width: 900px)").matches) {
      document.getElementById("detail")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const clone = `git clone ${REPO_URL}`

  return (
    <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-4 pb-14 pt-10 max-[680px]:pb-10 max-[680px]:pt-6 min-[901px]:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
      {/* Sidebar */}
      <aside className="flex min-w-0 flex-col gap-5">
        <section className="ember-card" aria-labelledby="title">
          <div className="ember-head">
            <span className="mono text-[0.85rem]">{REPO.replace("/", " / ")}</span>
            <span className="mono text-[0.8rem] text-[color:var(--viz-muted)]">main</span>
          </div>
          <div className="flex flex-col gap-2.5 px-3.5 py-3.5">
            <span className="mono text-[0.8rem] text-[color:var(--viz-accent)]">reusable agent skills</span>
            <h1 id="title" className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em]">AI Skills</h1>
            <p className="text-[color:var(--viz-muted)]">
              Instructions that teach an AI assistant to handle one kind of task the same way every time. Each skill is a folder with a{" "}
              <code className="icode">SKILL.md</code>: a name, a one-line description of when to use it, and the steps to follow.
            </p>
          </div>
          <dl className="m-0 grid grid-cols-3 border-t border-[color:var(--viz-border)]">
            {[
              { v: String(skills.length), k: "skills", c: "var(--viz-series-1)" },
              { v: String(scoped), k: "tool-scoped", c: "var(--viz-series-3)" },
              { v: "MIT", k: "license", c: "var(--viz-text)" },
            ].map((s, i) => (
              <div key={s.k} className={`flex min-w-0 flex-col px-3.5 py-2.5 ${i ? "border-l border-[color:var(--viz-border)]" : ""}`}>
                <dd className="mono tabnum m-0 text-[1.35rem] font-semibold" style={{ color: s.c }}>{s.v}</dd>
                <dt className="text-[0.78rem] text-[color:var(--viz-muted)]">{s.k}</dt>
              </div>
            ))}
          </dl>
        </section>

        <Panel title="Use a skill" meta="3 steps" labelId="use">
          <StepList
            items={[
              <div key="a"><h3 className="text-[0.95rem] font-semibold">Copy the folder</h3><p className="mt-0.5 text-[color:var(--viz-muted)]">Into <code className="icode">~/.claude/skills/</code> for every project, or a project's <code className="icode">.claude/skills/</code> for one.</p></div>,
              <div key="b"><h3 className="text-[0.95rem] font-semibold">Start a new session</h3><p className="mt-0.5 text-[color:var(--viz-muted)]">Claude Code reads skills when a session starts.</p></div>,
              <div key="c"><h3 className="text-[0.95rem] font-semibold">Invoke it</h3><p className="mt-0.5 text-[color:var(--viz-muted)]">Type <code className="icode">/skill-name</code>, or let the assistant pick it from its description.</p></div>,
            ]}
          />
          <div className="border-t border-[color:var(--viz-border)]">
            <CopyCommand id="clone" cmd={clone} copied={copied === "clone"} onCopy={(el) => copy("clone", clone, el)} />
          </div>
        </Panel>

        <Panel title="Add a skill" meta="CONTRIBUTING" labelId="contrib">
          <StepList
            items={[
              <div key="a"><h3 className="text-[0.95rem] font-semibold">Create a folder under <code className="icode">skills/</code></h3><p className="mt-0.5 text-[color:var(--viz-muted)]">Lowercase and hyphenated, for example <code className="icode">code-review</code>.</p></div>,
              <div key="b"><h3 className="text-[0.95rem] font-semibold">Write the <code className="icode">SKILL.md</code></h3><p className="mt-0.5 text-[color:var(--viz-muted)]">Frontmatter <code className="icode">name</code> must match the folder; <code className="icode">description</code> says when to use it. Keep each value on one line.</p></div>,
              <div key="c"><h3 className="text-[0.95rem] font-semibold">Run the check</h3><p className="mt-0.5 text-[color:var(--viz-muted)]"><code className="icode">python scripts/validate_skills.py</code> prints <code className="icode">N skill(s) OK</code> or one error per problem. CI runs the same check.</p></div>,
              <div key="d"><h3 className="text-[0.95rem] font-semibold">Open a pull request</h3><p className="mt-0.5 text-[color:var(--viz-muted)]">Add a row to the README table and to <code className="icode">docs/index.html</code>, then fill in the PR template.</p></div>,
            ]}
          />
        </Panel>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-col gap-5">
        <Panel title="The collection" meta={`${visible.length} of ${skills.length} · skills/`} labelId="collection">
          <div className="flex flex-col gap-2.5 border-b border-[color:var(--viz-border)] px-3.5 py-3 min-[620px]:flex-row min-[620px]:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--viz-muted)]" aria-hidden />
              <Input
                id="skill-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills"
                aria-label="Search skills"
                className="ember-well h-8 border-[color:var(--viz-border)] pl-8 text-[0.9rem]"
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList className="h-8 max-w-full justify-start overflow-x-auto bg-[color:var(--viz-panel)] p-0.5" style={{ boxShadow: "inset 0 2px 3px var(--viz-bevel-lo)" }}>
                {FILTERS.map((f) => (
                  <TabsTrigger
                    key={f}
                    value={f}
                    className="h-7 px-2.5 text-[0.8rem] data-[state=active]:bg-[color:var(--viz-panel-top)] data-[state=active]:text-[color:var(--viz-accent)] data-[state=active]:shadow-[var(--bevel)]"
                  >
                    {f}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {visible.length ? (
            <ul className="m-0 list-none p-0" role="list">
              {visible.map((s) => {
                const active = s.name === current.name
                return (
                  <li key={s.name} className="[&+li]:border-t [&+li]:border-[color:var(--viz-border)]">
                    <button
                      type="button"
                      onClick={() => pick(s.name)}
                      aria-current={active ? "true" : undefined}
                      className={`grid w-full grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-1 px-3.5 py-2.5 text-left transition-colors min-[620px]:grid-cols-[11rem_minmax(0,1fr)_auto] min-[620px]:items-baseline ${
                        active ? "bg-[color:var(--viz-panel)]" : "hover:bg-[color:var(--viz-card-top)]"
                      }`}
                      style={active ? { boxShadow: "inset 2px 0 0 var(--viz-accent)" } : undefined}
                    >
                      <span className={`mono truncate font-medium ${active ? "text-[color:var(--viz-accent)]" : ""}`}>{s.name}</span>
                      <span className="text-[0.92rem] text-[color:var(--viz-muted)]">{s.summary}</span>
                      <GroupChip group={s.group} />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-2 px-3.5 py-5">
              <p className="text-[color:var(--viz-muted)]">No skill matches "{query}"{filter !== "All" ? ` in ${filter}` : ""}.</p>
              <Button size="sm" variant="outline" className="ember-btn h-7 text-xs" onClick={() => { setQuery(""); setFilter("All") }}>
                Clear search
              </Button>
            </div>
          )}
        </Panel>

        <div id="detail" className="scroll-mt-4">
          <SkillDetail skill={current} copied={copied} copy={copy} />
        </div>

        <Panel title="Skill layout" meta="SKILL.md" labelId="layout">
          <pre className="ember-well m-0 overflow-x-auto px-3.5 py-3 text-[0.86rem] leading-[1.7]" style={{ fontFamily: "var(--mono)" }} aria-label="Skill folder layout and SKILL.md frontmatter">
{`skills/
  <skill-name>/
    SKILL.md      `}<span className="italic text-[color:var(--viz-muted)]"># required</span>{`
    references/   `}<span className="italic text-[color:var(--viz-muted)]"># optional docs</span>{`
    scripts/      `}<span className="italic text-[color:var(--viz-muted)]"># optional helpers</span>{`

---
`}<span style={{ color: "var(--viz-series-4)" }}>name</span>: <span style={{ color: "var(--viz-series-3)" }}>skill-name</span>{`
`}<span style={{ color: "var(--viz-series-4)" }}>description</span>: <span style={{ color: "var(--viz-series-3)" }}>What it does and when to use it.</span>{`
`}<span style={{ color: "var(--viz-series-4)" }}>allowed-tools</span>: <span style={{ color: "var(--viz-series-3)" }}>Bash(git diff *)</span>  <span className="italic text-[color:var(--viz-muted)]"># optional</span>{`
---`}
          </pre>
        </Panel>
      </main>

      <footer className="col-span-full flex flex-wrap justify-between gap-2 pt-2 text-[0.85rem] text-[color:var(--viz-muted)]">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-[color:var(--viz-accent)] underline-offset-[3px] hover:underline">github.com/{REPO}</a>
          <a href={SITE_URL} target="_blank" rel="noreferrer" className="text-[color:var(--viz-accent)] underline-offset-[3px] hover:underline">GitHub Pages site</a>
        </div>
        <span>VashFX · MIT License</span>
      </footer>
    </div>
  )
}
