# Data Grid

A headless data grid built for millions of cells: virtualized on both axes, sorting, selection,
cell ranges, editing, column resizing and reordering, pinned columns, grouping, tree data,
summary rows. It imposes no DOM: the same parts render a `<table>` or `<div>`s.

`npm install @fragiola/data-grid-react`, namespace `DataGrid`. There is no styled registry
component: style the parts with palette roles and their `data-*` state.

Read [libraries](../libraries.md) first.

## Minimal grid

```tsx
import { type Column, DataGrid } from "@fragiola/data-grid-react";

type Person = { id: number; name: string; salary: number };

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 180 },
    { key: "salary", name: "Salary", width: 120, renderCell: ({ row }) => `$${row.salary}` },
];

<DataGrid.Root columns={columns} rows={people} rowKey={(row) => row.id} style={{ height: 400 }}>
    <DataGrid.Grid aria-label="People">
        <DataGrid.Header />
        <DataGrid.Body />
    </DataGrid.Grid>
</DataGrid.Root>
```

The root needs a height: it virtualizes inside it.

## Owning the markup

`Header`, `Body` and `Summary` render defaults. Pass children to own each level:

```tsx
<DataGrid.Body>
    <DataGrid.Rows<Person>>
        {(row) => (
            <DataGrid.Row row={row} className="border-b border-palette-line">
                <DataGrid.Cells<Person>>
                    {(cell) => (
                        <DataGrid.Cell
                            cell={cell}
                            className="px-3 data-active:outline-2 data-active:outline-palette-ring"
                        />
                    )}
                </DataGrid.Cells>
            </DataGrid.Row>
        )}
    </DataGrid.Rows>
</DataGrid.Body>
```

Parts: `Root`, `Grid`, `Header`, `HeaderRows`, `HeaderRow`, `HeaderCells`, `HeaderCell`, `Body`,
`Rows`, `Row`, `Cells`, `Cell`, `RowDetail`, `Summary`, `SummaryRows`, `SummaryRow`,
`SummaryCells`, `SummaryCell`, `Empty`.

## Model and engine

`DataGrid.Root` creates a model (data and rules) and an engine (the grid on screen) and maps its
props onto commands (`columns` → `columns.set`, `rows` → `data.set`).

- Inside the root: `const { model, engine } = useDataGrid()`.
- Outside (toolbar, status bar): `const gridRef = useDataGridRef()`, then
  `<DataGrid.Root gridRef={gridRef}>`.
- Commands: `columns.set`, `sort-columns.toggle`, `selected-rows.toggle`,
  `column-widths.resize`, `active-position.set`, `active-position.move`, … (`CommandMap`).
- Queries: `model.get("row-count")`, `model.is("cell-active", { rowIndex, columnIndex })`.
- Engine: `engine.run("scroll-to-cell", { rowIndex: 500 })`.
- Rows by index instead of an array: `rowCount` + `getRow`. Rows in memory with sorting and
  filtering: `useLocalRows` from `@fragiola/data-grid-react/local`.

## State attributes

`data-active`, `data-selected`, `data-selected-cell`, `data-editing`, `data-sort`,
`data-sortable`, `data-pinned`, `data-resizable`, `data-resizing`, `data-dragging`,
`data-expanded`, `data-group-row`, `data-depth`, `data-summary`, `data-loading`, `data-empty`,
`data-row-index`, `data-column-index`.

## Docs

<https://fragiola.com/data-grid>, or MCP `get_docs project="data-grid"`. Each feature (selection,
editing, grouping, virtualization, …) has a concept page.
