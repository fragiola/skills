# Styling

## Style families have no variants

A family (`field`, `popup`, `menu`, `layer`, `choice`, `disclosure`, `track`, `dock`) is a set of
named `tailwind-variants` members shared by several components. Variation is a **named member**,
never a variant or a one-off override.

```ts
// families/menu.ts
export const menu = {
    item: tv({ base: "…" }),
    selectableItem: tv({ extend: item, base: "pe-8 ps-1.5" }), // has an indicator
};
```

```tsx
// Incorrect: overriding a family's spacing at the call site
<DropdownMenu.Item className="pe-8">…</DropdownMenu.Item>

// Correct: the member that means it
<DropdownMenu.SelectableItem>…</DropdownMenu.SelectableItem>
```

Atoms and components keep their own props: `Clickable.Button` has `variant`, `size`, `shape`;
`Badge` has `variant`. Color is still a palette, never a prop.

## `className` is for layout and palettes

Pass a palette class or layout (`w-48`, `flex-1`, `size-12`). Do not restyle a component's
colors, borders or typography from outside. Change the installed file, or the family, when the
change is meant to last.

## Logical properties on the inline axis

RTL is supported. Inline-axis spacing and position are logical; the block axis stays physical.

| physical | logical |
| --- | --- |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |

`pt`, `pb`, `mt`, `mb`, `top`, `bottom`, `border-t`, `border-b` stay as they are. Where no
logical utility exists, use `rtl:`, including directional icons: `rtl:rotate-180` on a chevron.

## Tokens and scales

- Spacing, type and breakpoints are Tailwind's own scales. A value that is off the scale uses an
  arbitrary value (`p-[3px]`).
- Radius is a token set: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`. Other radius
  names do not exist.
- Control height is `h-control`.
- Density is per subtree: `data-density="compact"` or `"spacious"` rescales every spacing
  utility. Do not hard-code a "compact" variant.
- Components respond to their container, not the viewport (`@container` / `@2xl`). Breakpoints
  are the app's decision.

## No `!important`

```tsx
// Incorrect
<Dialog.Content className="!p-0">

// Correct: change the layer family or the installed part, or report the conflict
```

## `cn` for conditional classes

```tsx
import { cn } from "@/lib/cn";

<div className={cn("flex gap-2", isActive && "palette-blue")} />
```

## Icons

`Clickable.Button` sizes an icon automatically unless the icon has its own `size-*` class.
Elsewhere (triggers, insets, accordion chevrons), size icons explicitly with `size-4`.
`icon-size` (`iconSize.addon`, `.button`, `.buttonSm`, `.menuItem`, `.indicator`, `.standalone`)
holds the shared sizes.

## Verify by compiling

A class that does not exist (`bg-primary`, `rounded-xl`, `text-gray-500`) fails silently: no
type error, no build error, no visual. After styling, build the app and look at it, in both
themes and with `dir="rtl"`.
