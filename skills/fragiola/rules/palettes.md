# Palettes

A palette is a class that **declares** six custom properties and paints nothing. Components paint
with the roles.

| role | meaning | utilities |
| --- | --- | --- |
| `base` | the palette's color: background or fill | `bg-palette-base` |
| `soft` | subtle background: hover, badge, field surface | `bg-palette-soft` |
| `line` | stroke | `border-palette-line`, `bg-palette-line` |
| `contrast` | content on `base` | `text-palette-contrast` |
| `accent` | content on `soft` or on a foreign background | `text-palette-accent` |
| `ring` | focus and active highlight | `outline-palette-ring` |

Also: `bg-palette-base-hover` (derived from `base`), `bg-scrim` (backdrops), `chart-*` (charts only).

## The palettes

| tier | palettes | use |
| --- | --- | --- |
| neutral | `palette-surface`, `palette-raised` | the floor; an elevated surface (card, popover, dialog) |
| chromatic | `palette-blue`, `palette-green`, `palette-orange`, `palette-purple`, `palette-rose`, `palette-danger` | the color **is** the element: CTA, badge, marked control, destructive action |
| surface-ring | `palette-surface-blue`, `-purple`, `-green`, `-orange`, `-rose` | a neutral field frame with a colored focus ring |

Each palette is a registry item (`@fragiola/palette-blue`) and a CSS file you import
([installation](../installation.md)).

## Only roles exist

`global.css` resets Tailwind's color scale. Any other color utility compiles to nothing.

```tsx
// Incorrect: these classes do not exist in a Fragiola project
<div className="bg-white text-gray-900 border-gray-200 dark:bg-zinc-900">

// Correct
<div className="palette-surface bg-palette-base text-palette-contrast border border-palette-line">
```

## Put the palette on what it tints

A palette is scoped by class, so any element can carry its own.

```tsx
// Incorrect: there is no color variant
<Clickable.Button variant="destructive">Delete</Clickable.Button>

// Correct
<Clickable.Button className="palette-danger">Delete</Clickable.Button>
<DropdownMenu.Item className="palette-danger"><span>Delete</span></DropdownMenu.Item>
<Badge className="palette-green">Active</Badge>
```

## A surface paints itself

The palette class sets the roles; the same element (or a child) paints with them.

```tsx
// Incorrect: declares raised but paints nothing
<section className="palette-raised rounded-lg p-6">

// Correct
<section className="palette-raised rounded-lg border border-palette-line bg-palette-base p-6 text-palette-contrast">
```

## Secondary text

There is no `muted` role. Secondary text is `accent` at 85%, which passes WCAG AA on the neutral
surfaces.

```tsx
// Incorrect
<p className="text-muted-foreground">Helper</p>
<p className="text-palette-accent/70">Helper</p>

// Correct
<p className="text-sm text-palette-accent/85">Helper</p>
```

Use it only on neutral palettes. On a chromatic `base`, text is `text-palette-contrast`.

## Fields take a surface-ring palette

```tsx
// Incorrect: a chromatic palette colors the whole frame
<Field.Root className="palette-blue">

// Correct: neutral frame, blue focus ring
<Field.Root className="palette-surface-blue">
```

## Invalid is automatic

`Field.Root invalid` (Base UI sets `data-invalid`) turns the whole field into `palette-danger`.

```tsx
// Incorrect: a Tailwind variant cannot apply a palette class
<Field.Root className="aria-invalid:palette-danger">

// Correct
<Field.Root invalid>
```

## Themes, not `dark:`

Every palette declares both themes. Switch with `data-theme` on `<html>`.

```tsx
// Incorrect
<div className="bg-palette-base dark:bg-black">

// Correct
<div className="bg-palette-base">
```

## Need another color?

Create a new palette that declares **all six roles** in both themes (copy one from
`styles/palettes/`). Never add a seventh role, and never declare only some roles: missing ones
inherit from an ancestor.
