# Installing Fragiola UI

Fragiola UI is distributed in shadcn's registry format and installed with the shadcn CLI. There is
no `@fragiola/ui` package: the CLI copies source files into the project, which owns them.

Run the CLI with the project's package runner (`npx shadcn@latest`, `pnpm dlx shadcn@latest`,
`bunx --bun shadcn@latest`).

## 1. Add the registry

The project needs a `components.json` (`npx shadcn@latest init` creates one). Add the
`@fragiola` namespace:

```json
{
    "registries": {
        "@fragiola": { "url": "https://fragiola.com/r/{name}.json" }
    }
}
```

## 2. Add items

```bash
npx shadcn@latest add @fragiola/dialog @fragiola/select
```

- Always write the namespace: `@fragiola/field`. A bare `field` installs **shadcn's** item.
- `registryDependencies` resolve recursively: `dialog` also brings `layer`, `text`, `clickable`,
  `cn` and `theme`. Do not add them by hand.
- Palettes are items too: `npx shadcn@latest add @fragiola/palette-blue`. Components depend on
  the ones they need (`sidebar` brings `palette-raised` and `palette-surface`).

## 3. Where files land

From the project's `components.json` aliases (defaults shown, with `src/`):

| what | alias | default |
| --- | --- | --- |
| components | `ui` | `src/components/ui/` |
| atoms, families | `components` | `src/components/atoms/`, `src/components/families/` |
| `cn`, `get-token` | `lib` | `src/lib/` |
| hooks | `hooks` | `src/hooks/` |
| `global.css`, palettes | - | `src/styles/`, `src/styles/palettes/` |
| `dockable` popout page | - | `public/popout.html` |

Imports inside the files are rewritten to the aliases. Import them the same way:

```tsx
import { Clickable } from "@/components/atoms/clickable";
import { Input } from "@/components/atoms/fields";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
```

## 4. Wire the CSS

The CLI writes the stylesheets but does not edit the CSS entry. Import `global.css` and **every
installed palette** once, after Tailwind (paths relative to the entry):

```css
@import "tailwindcss";
@import "../styles/global.css";
@import "../styles/palettes/surface.css";
@import "../styles/palettes/raised.css";
@import "../styles/palettes/danger.css";
```

`global.css` imports `tw-animate-css`. Install that package if the project does not have it.

A palette that is installed but not imported paints nothing, with no error.

## 5. Set the theme

Palettes are scoped to `:root[data-theme="light"]` and `:root[data-theme="dark"]`. Without the
attribute, no palette has values.

```html
<html data-theme="light">
```

Switch themes by changing the attribute (for example with `next-themes`,
`attribute="data-theme"`). Put the floor palette on the app root:

```tsx
<body className="palette-surface bg-palette-base text-palette-contrast">
```

Optional: `dir="rtl"` for right-to-left, and `data-density="compact" | "spacious"` on any subtree.

## Updating

The registry has no versions: an installed file is a frozen copy. To take upstream changes:

```bash
npx shadcn@latest add @fragiola/select --dry-run
npx shadcn@latest add @fragiola/select --diff select.tsx
```

Merge the diff into local edits. Never `--overwrite` without the user's approval.

## Before you add

- Check the project's alias folders for what is already installed, and do not re-add it.
- When the registry is unreachable, stop and say so. Do not copy files from GitHub or point
  `components.json` at another URL.
