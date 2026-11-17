---
name: fragiola
description: Builds UIs with Fragiola (fragiola.com) - Fragiola UI source components from the shadcn registry (Base UI + Tailwind v4, palettes, atoms, style families) and the headless @fragiola/* libraries (Dockable, Data Grid, Grid Layout), with the Fragiola MCP server. Use when a project has the @fragiola registry in components.json, imports @fragiola/* packages, or the user mentions Fragiola, palettes such as palette-surface, Dockable, Data Grid or Grid Layout.
license: MIT
---

# Fragiola

An ecosystem of components and libraries for the web. Two kinds of things, consumed in different
ways. **Always tell them apart.**

## Organization

| layer | what it is | items | how it is used |
| --- | --- | --- | --- |
| **Fragiola UI: primitives** | source code; the pieces every component is built from | atoms: `text`, `clickable`, `icon-size`, `badge`, `input` (Input, Textarea, Numeric). Style families: `field`, `popup`, `menu`, `layer`, `choice`, `disclosure`, `track`, `dock` | `npx shadcn@latest add @fragiola/<name>`. Families come in as dependencies; you rarely add one by hand |
| **Fragiola UI: components** | source code, built on Base UI | `dialog`, `alert-dialog`, `drawer`, `popover`, `tooltip`, `dropdown-menu`, `context-menu`, `navigation-menu`, `select`, `combobox`, `field`, `checkbox`, `radio`, `switch`, `slider`, `progress`, `tabs`, `accordion`, `collapsible`, `breadcrumb`, `pagination`, `sidebar`, `table`, `avatar`, `skeleton`, `separator`, `chart` | `npx shadcn@latest add @fragiola/<name>` |
| **Fragiola UI: theme** | CSS | `theme` (`global.css`), `palette-*`; helpers `cn`, `get-token` | added with the components; import the CSS once ([installation](installation.md)) |
| **Libraries** (complex components) | headless **npm packages**: a core `@fragiola/<x>` and adapters `@fragiola/<x>-react` | Dockable, Data Grid, Grid Layout | `npm install` the core and the adapter, then import |
| **Special component** | Fragiola UI source that styles a library | `dockable` (installs `@fragiola/dockable-react`) | `npx shadcn@latest add @fragiola/dockable` |

- Fragiola UI has **no npm package**: never `npm install @fragiola/ui` or import Fragiola UI from
  `@fragiola/*`. Import the copied files through the project's aliases
  (`@/components/ui/dialog`, `@/components/atoms/clickable`).
- Libraries ship **no CSS**: style them through their `data-*` / ARIA state, with Fragiola UI
  palettes, or through the special component.
- The MCP server uses the same names: kinds `registry` / `library`; groups `component`, `atom`,
  `family`, `lib`, `theme`, `palette`.

## MCP server

When the `fragiola` MCP server is available, use it to find what exists and to read docs before
writing code: `search_fragiola`, `get_component`, `get_docs`, `get_api`,
`get_install_command`.

## Critical Rules

Always enforced. Each links to a page with Incorrect/Correct pairs.

### Color → [palettes.md](rules/palettes.md)

- **Color comes from palettes.** A `palette-*` class declares 6 roles (`base`, `soft`, `line`,
  `contrast`, `accent`, `ring`); utilities paint with them: `bg-palette-base`,
  `text-palette-contrast`, `border-palette-line`.
- **No other colors exist.** `global.css` resets Tailwind's colors: `bg-blue-500`, `text-white`,
  `bg-background` compile to nothing.
- **Put the palette on the element it tints**: `<Clickable.Button className="palette-danger">`.
  No `variant="destructive"`.
- **Secondary text is `text-palette-accent/85`**, placeholders too.
- **Fields use a `palette-surface-*` palette** (neutral frame, colored focus ring).
- **Invalid is automatic**: `Field.Root invalid` turns the subtree into `palette-danger`.
- **No `dark:`.** Themes switch with `data-theme="light" | "dark"` on `<html>`.

### Composition → [composition.md](rules/composition.md)

- **One namespace per component**: `Dialog.Title`, never `DialogTitle`.
- **`render`, never `asChild`**: `<Dialog.Trigger render={<Clickable.Button variant="outline" />}>`.
- **Dialogs are complete**: `Root` > `Portal` > `Backdrop` + `Content` > `Header` (`Title`,
  `Description`), `Body`, `Footer`. Same shape for `AlertDialog` and `Drawer`.
- **Menu labels live in a group**: `DropdownMenu.Group` > `DropdownMenu.Label`.
- **Use what exists before custom markup.** There is no `Button` (use `Clickable.Button`), no
  `Card`, no `Alert`, no toast.

### Fields → [fields.md](rules/fields.md)

- **A control never carries its own body.** `Field.Root` > `Field.Row` > `Field.Body` > `Input`.
  Border, background, height and focus ring live on the frame.
- **Addons and icons are parts**: `Field.Addon side="inline-start"`, `Field.Inset`.
- **Checkbox, radio and switch sit in `Field.ChoiceRoot`.**
- **`Select.Trigger` is the frame**: `Field.Root` > `Select.Root`, no `Field.Row`.

### Styling → [styling.md](rules/styling.md)

- **Logical inline properties**: `ps`/`pe`, `ms`/`me`, `start`/`end`, `border-s`/`border-e`,
  `text-start`. Block axis stays physical. RTL is supported.
- **No `!important`.** Report the conflict instead.
- **Tailwind scales**, plus the tokens: `rounded-sm|md|lg|full`, `h-control`.
- **Families have no variants**; atoms and components keep their own props (`variant`, `size`,
  `shape`).
- **A class that does not exist fails silently.** Compile and look.

Coming from shadcn: [shadcn-mapping.md](rules/shadcn-mapping.md).

## Component Selection

| need | use |
| --- | --- |
| button, link, icon button | `Clickable.Button` (`variant` solid / outline / ghost / icon, `size` sm / md, `shape="square"`), `Clickable.Link`, `Clickable.ExternalLink` |
| text, headings, labels | `Text.Heading as="h2"`, `Text.Paragraph`, `Text.Small`, `Text.Label`, `Text.Error`, `Text.Link` |
| text input | `Field` + `Input`, `Textarea` or `Numeric`; quick form row: `Input.Template.Simple` |
| options | `Select` (pick one), `Combobox` (search, multiple, chips), `Radio` + `RadioGroup`, `Checkbox`, `Switch`, `Slider` |
| status label | `Badge` (`variant` soft / solid / outline) + a palette |
| modal / confirmation / side or bottom panel | `Dialog` / `AlertDialog` / `Drawer` |
| floating content | `Popover`, `Tooltip` (`Tooltip.Provider` shares the delay) |
| menus | `DropdownMenu`, `ContextMenu` |
| navigation | `Sidebar`, `NavigationMenu`, `Tabs`, `Breadcrumb`, `Pagination` |
| show / hide | `Accordion`, `Collapsible` |
| data display | `Table`, `Avatar`, `Progress`, `Skeleton`, `Separator`, `Chart` (ECharts) |
| surface (card, panel) | a `div` with `palette-raised bg-palette-base text-palette-contrast border border-palette-line rounded-lg` |
| docking panels | `@fragiola/dockable` (styled) or `@fragiola/dockable-react` (headless) |
| data grid / dashboard grid | `@fragiola/data-grid-react` / `@fragiola/grid-layout-react` (headless) |

## Workflow

1. **Find it.** MCP `search_fragiola` / `list_components`, or the table above. Check the project's
   installed files first (`components.json` aliases) and do not re-add them.
2. **Read it.** MCP `get_component` (`include_code` for source) or `get_docs`; for a library,
   `get_api`. Never invent parts, props or commands.
3. **Install it.** Fragiola UI: [installation](installation.md). Library: the
   library page.
4. **Compose it** as the docs examples do, following the rules above.
5. **Verify by compiling**: typecheck, build, and look at the page in both themes.

## Quick Reference

```bash
# Fragiola UI (source code)
npx shadcn@latest add @fragiola/dialog @fragiola/select
npx shadcn@latest add @fragiola/palette-blue
npx shadcn@latest add @fragiola/dialog --dry-run
npx shadcn@latest view @fragiola/sidebar

# Libraries (npm packages)
npm install @fragiola/dockable @fragiola/dockable-react
npm view @fragiola/<x>-react version

# MCP server
npx fragiola@latest mcp init --client claude
```

## Pages

- [installation.md](installation.md): registry entry, install, CSS entry, theme attribute, updates
- [rules/palettes.md](rules/palettes.md): roles, palettes, scoping, secondary text, danger, themes
- [rules/composition.md](rules/composition.md): namespaces, `render`, overlays, menus, sidebar
- [rules/fields.md](rules/fields.md): the field frame, controls, addons, choices, select, states
- [rules/styling.md](rules/styling.md): families, logical properties, tokens, density, `cn`
- [rules/shadcn-mapping.md](rules/shadcn-mapping.md): shadcn tokens and APIs → Fragiola
