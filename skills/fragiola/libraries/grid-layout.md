# Grid Layout

A headless draggable and resizable grid layout for dashboards: items on a column grid, collision
and compaction, constraints, responsive breakpoints, external drop, keyboard moves.

`npm install @fragiola/grid-layout-react`, namespace `GridLayout`. There is no styled registry
component: style the parts with palette roles and their `data-*` state.

Read [libraries](../libraries.md) first.

## Minimal grid

```tsx
import { GridLayout, type Layout } from "@fragiola/grid-layout-react";

const layout: Layout = [
    { id: "revenue", x: 0, y: 0, w: 4, h: 2 },
    { id: "orders", x: 4, y: 0, w: 4, h: 2 },
];

<GridLayout.Root defaultLayout={layout} cols={12} rowHeight={64} gap={[12, 12]}>
    <GridLayout.Items>
        {(item) => (
            <GridLayout.Item
                itemId={item.id}
                aria-label={item.id}
                className="palette-raised rounded-lg border border-palette-line bg-palette-base"
            >
                <Widget id={item.id} />
                <GridLayout.ResizeHandle side="bottom-end" aria-label={`Resize ${item.id}`} />
            </GridLayout.Item>
        )}
    </GridLayout.Items>
    <GridLayout.Placeholder className="rounded-lg bg-palette-soft" />
</GridLayout.Root>
```

- Uncontrolled: `defaultLayout`. Controlled: `layout` + `onLayoutChange`.
- Parts: `Root`, `Items`, `Item`, `ResizeHandle`, `DragHandle`, `Placeholder`, `DragPreview`,
  `DragSource`, `Cells`.

## Model

- Inside the root: `const { model } = useGridLayout()`. Outside: `useGridLayoutRef()`.
- Commands: `item.add`, `item.move`, `item.resize`, `item.remove`, `layout.set`, `layouts.set`
  (breakpoints). Queries: `model.get("layout")`, `model.get("item-by", …)`.

## State attributes

`data-dragging`, `data-resizing`, `data-grabbed`, `data-static`, `data-resizable`, `data-side`
(`ResizeHandle`), `data-over`, `data-outside`, `data-drop-refused`, `data-breakpoint`, `data-x`,
`data-y`.

## Docs

<https://fragiola.com/grid-layout>, or MCP `get_docs project="grid-layout"`.
