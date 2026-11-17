# Fragiola skills

Agent skills for the Fragiola ecosystem (<https://fragiola.com>), in the
[Agent Skills](https://agentskills.io/specification) format. Each skill teaches an AI agent how to
build with Fragiola: Fragiola UI, the headless libraries and the MCP server.

The ecosystem guidelines live in `../guidelines` (or the `fragiola-ecosystem` skill). This file
wins for this repository.

## Non-negotiable rules

1. **One skill per folder in `skills/`.** The folder name is the skill's `name`. `SKILL.md` is
   the entry; every other page is linked from it, one level deep.
2. **Written for agents.** Direct, concise, precise. A rule is one line plus an Incorrect/Correct
   pair when code helps. No marketing, no history, no long explanations.
3. **No fact without a Fragiola source.** Every component, part, prop, class, palette, command,
   primitive and MCP tool comes from `fragiola/ui`, a library repository, `fragiola/cli` or
   fragiola.com, and is checked there before it is written.
4. **No dated status.** No "coming soon", no versions, no "not published yet". Point to the
   command that answers it (`npm view`, the MCP server, the docs).
5. **`SKILL.md` stays short** (the check enforces 500 lines; aim well under). Detail goes to a
   page the agent loads on demand.
6. **Frontmatter values are single-line.** `name` and `description` on one line each, so the
   check can read them.
7. **Verify by running `pnpm check`.** It fails on anything the format or these rules forbid.

## Commands

| command      | does                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| `pnpm check` | validate every skill: frontmatter, name, description, length, links, orphans, names  |
| `pnpm test`  | test the checker (`node --test`)                                                      |

No dependencies: the scripts run on Node ≥ 24 type stripping.

## Layout

```
skills/<name>/SKILL.md       the entry an agent loads
skills/<name>/*.md           pages linked from SKILL.md
skills/<name>/rules/         rule pages with Incorrect/Correct pairs
skills/<name>/evals/         evals.json (prompts and expectations)
skills/<name>/agents/        per-agent metadata (openai.yml)
scripts/check-skills.ts      the check run by `pnpm check` and CI
```

## Conventions

- File and folder names in kebab-case, except names a tool requires (`SKILL.md`, `README.md`,
  `AGENTS.md`, `LICENSE`, `package.json`).
- Commits are gitmoji-conventional (`✨ feat: …`, `📝 docs: …`, `🐛 fix: …`, `🔧 chore: …`,
  `👷 ci: …`, `✅ test: …`). Skills, docs and commits in English.
- Branches `<type>/epic-<n>-…`, worktrees under `.worktrees/`.
