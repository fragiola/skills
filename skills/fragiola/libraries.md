# Fragiola libraries

The complex components (docking panels, data grid, dashboard grid) are **headless npm
libraries**, not registry source code. Every library follows the same rules, so learning one
teaches the others.

| library | React package | namespace | page |
| --- | --- | --- | --- |
| Dockable | `@fragiola/dockable-react` | `Dockable` | [dockable.md](libraries/dockable.md) |
| Data Grid | `@fragiola/data-grid-react` | `DataGrid` | [data-grid.md](libraries/data-grid.md) |
| Grid Layout | `@fragiola/grid-layout-react` | `GridLayout` | [grid-layout.md](libraries/grid-layout.md) |

## Packages

- A framework-free **core**, `@fragiola/<x>`: the model, its commands, the engine. No runtime
  dependencies.
- **Adapters** per framework: `@fragiola/<x>-react`, and `-vue` / `-angular` where the library
  ships them.
- A React app installs **only the adapter**. It depends on the core and re-exports it, so
  `createModel`, types and helpers are imported from `@fragiola/<x>-react`.

```bash
npm install @fragiola/dockable-react
```

Check that a package is published before installing it: `npm view @fragiola/<x>-react version`
(or MCP `get_install_command`). If it is not, say so. Do not install from GitHub or invent a
version.

## Headless

- No CSS, no icons, no menus, no text. Every visible label and accessible name comes from you.
- State is exposed as `data-*` and ARIA attributes. Style with them:
  `data-selected:bg-palette-soft`, `data-dragging:opacity-50`.
- With Fragiola UI, paint parts with palette roles, like any other element. Dockable also has a
  styled registry component, `@fragiola/dockable`.

## Composition

- Parts live under one namespace: `Dockable.Tab`, `DataGrid.Cell`, `GridLayout.Item`.
- Lists are rendered through **children functions**, so you own the markup of each item:
  `<GridLayout.Items>{(item) => <GridLayout.Item itemId={item.id} />}</GridLayout.Items>`.
- Swap the element with `render`, never `asChild`. `render` may be a function of the part's
  state.
- `className` and `style` accept a string or a function of the state.

## The model API

State is plain, immutable data behind a **model**. Every change is a **command**; every
question goes through a verb.

| verb | does |
| --- | --- |
| `model.run(command, payload)` | runs and commits a command; returns `{ ok: true, … }` or `{ ok: false, error }`, never throws |
| `model.can(command, payload)` | whether it would apply now (nothing is committed) |
| `model.check(command, payload)` | what it would return now |
| `model.get(key, payload?)` | reads a value |
| `model.is(key, payload?)` | answers a yes/no question |
| `model.use(middleware)` | lets a command pass, rewrites its payload, or vetoes it |
| `model.subscribe(listener)` | listens to committed commands |

Command names are `<state>.<change>`: `tab.close`, `item.move`, `sort-columns.toggle`. The
library's `CommandMap` type lists every command with its payload. Read it (MCP `get_api`, or the
docs) before calling one. Never guess a command name.

```ts
if (model.can("tab.close", { tabId })) model.run("tab.close", { tabId });
```

## App policy stays in the app

Undo/redo, persistence, translations and permissions are not in the packages. Build them with
`subscribe`, `get` (for example a layout's JSON) and middleware, as the library's examples show.

## Typed data

Each library takes a `Types` registry that types the app's data (a tab's data, a row, an item).
Pass it as a generic (`createModel<Types>(json)`, `Dockable.TabList<Types>`), and never use
`any`.

## Docs

Each library documents itself on fragiola.com (`/dockable`, `/data-grid`, `/grid-layout`): getting
started, concepts, guides and the API of every primitive. Through the MCP server:
`get_docs project="dockable"`, `get_api project="dockable" name="tab"`.
