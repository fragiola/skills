# Fragiola skills

[Agent skills](https://agentskills.io) for [Fragiola](https://fragiola.com): they teach AI agents
(Claude Code, Codex, Cursor, OpenCode, …) to build with Fragiola UI, the headless Fragiola
libraries and the Fragiola MCP server.

| skill                         | use it for                                                            |
| ----------------------------- | --------------------------------------------------------------------- |
| [`fragiola`](skills/fragiola) | building with Fragiola UI components, the libraries and the MCP server |

## Install

With the [`skills` CLI](https://github.com/vercel-labs/skills), from your project:

```bash
npx skills add fragiola/skills
```

Add `-g` to install for every project, or `-a <agent>` to pick the agent.

Or copy `skills/<name>/` into your agent's skills folder (`.claude/skills/`, `.agents/skills/`, …).

## Develop

```bash
pnpm check   # validate every skill
pnpm test    # test the checker
```

The rules for changing a skill are in [`AGENTS.md`](AGENTS.md).

## License

[MIT](LICENSE)
