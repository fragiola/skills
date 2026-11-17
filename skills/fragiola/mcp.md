# Fragiola MCP server

`fragiola mcp` (the `fragiola` npm package) is a stdio MCP server that gives agents what
fragiola.com documents: which components exist, their docs, the libraries' APIs and how to install
each. Every answer says whether an item is Fragiola UI source code (`registry`) or an npm
library (`library`).

## Setup

From the project:

```bash
npx fragiola@latest mcp init --client <claude|cursor|vscode|opencode|codex>
```

| client | writes | then |
| --- | --- | --- |
| Claude Code | `.mcp.json` | restart and approve the server (`/mcp`) |
| Cursor | `.cursor/mcp.json` | enable it in Settings → MCP |
| VS Code | `.vscode/mcp.json` | click Start; use Copilot Chat in agent mode |
| OpenCode | `opencode.json` | restart |
| Codex | nothing; prints the block for `~/.codex/config.toml` | add it by hand |

`init` merges into an existing file, keeps other servers, and never touches a file that is not
plain JSON (add the entry by hand there). Manual entry for Claude Code and Cursor:

```json
{
    "mcpServers": {
        "fragiola": { "command": "npx", "args": ["fragiola@latest", "mcp"] }
    }
}
```

It needs Node.js 24 or later. `FRAGIOLA_URL` points it at another site (a local docs build);
unset, it reads fragiola.com.

## Tools

| tool | input | use it to |
| --- | --- | --- |
| `get_fragiola_overview` | none | start: what Fragiola is and every project |
| `list_projects` | `kind?` | the projects, their kind and how to install each |
| `list_components` | `kind?`, `project?`, `group?`, `limit?`, `offset?` | browse components (`kind`: `registry`, `library` or `all`; `group`, Fragiola UI only: `component`, `atom`, `family`, `lib`, `theme`, `palette`) |
| `search_fragiola` | `query`, `kind?`, `limit?`, `offset?` | find a component or a docs page by name or topic |
| `get_component` | `names[]`, `include_code?` | details of components or libraries (`["select", "dockable/tab"]`); `include_code` returns Fragiola UI source |
| `get_docs` | `project`, `path?` | a project's page list, or one page as Markdown (`"fields/select"`) |
| `get_api` | `project`, `name?` | a library's API pages (`"tab"`, `"model"`) |
| `get_install_command` | `items[]` | the exact commands to add components or install libraries |

## Flow

1. Unknown territory: `get_fragiola_overview`.
2. Find the item: `search_fragiola` or `list_components`.
3. Read it before writing code: `get_component` (with `include_code` to see the parts),
   `get_docs`, `get_api` for library primitives and commands.
4. Install it: `get_install_command`, then run what it returns.
5. Write the code from what you read, following the rules in [SKILL.md](SKILL.md).

The server knows what is published. Its answers win over this skill's tables when they differ.

## When the server is not available

If `npx fragiola@latest mcp` fails or no `fragiola` server is configured, do not guess:

- read the docs on <https://fragiola.com> (`/ui`, `/dockable`, `/data-grid`, `/grid-layout`);
- inspect a registry item with `npx shadcn@latest view @fragiola/<name>`, or fetch
  `https://fragiola.com/r/<name>.json`;
- check a library with `npm view @fragiola/<x>-react`.
