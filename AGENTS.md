# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Codex, Antigravity, etc.) working in this repository.

## What this repo is

**SkinSync** — a localized skincare quiz for the Malaysian market (Next.js 16, Supabase, next-intl). Users answer skin type / concerns / environment / sensitivity, get a climate-aware routine, and click out to Shopee / Lazada / TikTok Shop via affiliate links. See `CLAUDE.md` for the full tech stack and project structure, and `CONTEXT.md` for product/session history and open gaps before launch.

The repo currently runs in **Demo Mode**: no real Supabase project is wired up, so data-layer code falls back to mock data (`src/lib/mockData.ts`). Check `NEXT_PUBLIC_SUPABASE_URL` handling in `src/lib/supabase/*.ts` before assuming a live database.

## Dev workflow plugin (`agent-skills`)

This repo also carries a project-scoped `agent-skills` plugin (`skills/`, `agents/`, `.claude/commands/`, `.claude-plugin/`) — a general-purpose spec-to-ship workflow, not specific to SkinSync. It provides:

- **Skills** (`skills/<name>/SKILL.md`) — the *how*: step-by-step workflows (spec-driven-development, incremental-implementation, test-driven-development, debugging-and-error-recovery, code-review-and-quality, code-simplification, api-and-interface-design, frontend-ui-engineering, planning-and-task-breakdown, and others).
- **Personas** (`agents/<role>.md`) — the *who*: `code-reviewer`, `security-auditor`, `test-engineer`, `web-performance-auditor`.
- **Slash commands** (`.claude/commands/*.md`) — the *when*: `/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, `/webperf`.

If your tool doesn't support slash commands, map intent to skills directly:

- New feature → `spec-driven-development`, then `incremental-implementation` + `test-driven-development`
- Planning/breakdown → `planning-and-task-breakdown`
- Bug/unexpected behavior → `debugging-and-error-recovery`
- Code review → `code-review-and-quality`
- Refactor/simplify → `code-simplification`
- API/interface design → `api-and-interface-design`
- UI work → `frontend-ui-engineering`

Composition rule: the user (or a slash command) is the orchestrator. Personas don't invoke other personas; a persona may invoke skills. The one endorsed multi-persona pattern is parallel fan-out with a merge step (`/ship` runs `code-reviewer`, `security-auditor`, and `test-engineer` concurrently, then synthesizes one go/no-go report).

For authoring new skills or personas, see `skills/spec-driven-development/SKILL.md` and `docs/agents.md` for conventions — don't duplicate that detail here.

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # eslint
```

No test suite exists yet.
