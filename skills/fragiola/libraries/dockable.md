# Dockable

Headless dockable panels: tabs, tabsets, splitters, borders, drag and drop, maximize and popout
windows. Use it for IDE-like or workbench layouts.

- Headless: `npm install @fragiola/dockable-react`, namespace `Dockable`.
- Styled: `npx shadcn@latest add @fragiola/dockable` (Fragiola UI). It installs the package too.

Read [libraries](../libraries.md) first.

## Model

A layout is a typed JSON tree: a `row` splits its space between children, a `tabset` holds tabs.
A row nested in a row takes the opposite orientation. `weight` is a relative size.

```tsx
import { createModel, type LayoutJson } from "@fragiola/dockable-react";

type Types = { tabs: { welcome: undefined; notes: { text: string } } };

const json: LayoutJson<Types> = {
    version: 1,
    root: {
        type: "row",
        children: [
            { type: "tabset", weight: 60, children: [{ component: "welcome", label: "Welcome" }] },
            {
                type: "tabset",
                weight: 40,
                children: [{ component: "notes", label: "Notes", data: { text: "" } }],
            },
        ],
    },
};

const [model] = useState(() => createModel<Types>(json));
```

Common commands and queries: `tab.add`, `tab.close`, `tab.select`, `tab.set-data`,
`tabset.maximize`, `border.configure`, `batch`; `model.get("layout-json")` (save),
`model.get("all-tabs")`, `model.is("tabset-maximized", …)`. Inside `Dockable.Root`,
`useDockable()` gives the model.

## Styled: Template.Simple

With the registry component, one template renders the whole layout: tabsets, tabs with close
buttons, overflow menu, splitters, drop indicator, borders, popouts.

```tsx
import { createModel } from "@fragiola/dockable-react";
import { Dockable } from "@/components/ui/dockable";

<Dockable.Template.Simple model={model} className="h-full palette-surface-blue">
    {(tab) => <TabContent tab={tab} />}
</Dockable.Template.Simple>
```

- `Dockable` here is the **styled** namespace from `@/components/ui/dockable`. Import `createModel`
  and types from the package.
- The root needs a size (`h-full`, or its container's).
- One palette paints the whole layout, the root's. Use a surface-tier palette (`palette-surface`,
  `palette-raised`, `palette-surface-*`).
- Popouts load `public/popout.html` (installed by the item). Under a base path, pass `popoutURL`.
- A different layout: copy the template and edit its parts (`Dockable.TabSet`,
  `Dockable.TabSetHeader`, `Dockable.TabClose`, `Dockable.TabOverflowMenu`, …).

## Headless: the primitives

`Root`, `Row`, `Splitter`, `TabSet`, `TabList`, `Tab`, `TabSetContent`, `TabOverflowTrigger`,
`PopoutTrigger`, `Panels`, `Panel`, `DropIndicator`, `EdgeIndicator`, `Borders`, `Border`,
`BorderContent`, `Popout`, `DragGroup`, `DragSource`, `DropZone`.

```tsx
import { Dockable, type RowNode, type TabsetNode } from "@fragiola/dockable-react";

function renderNode(child: TabsetNode<Types> | RowNode<Types>) {
    if (child.type === "tabset") {
        return (
            <Dockable.TabSet node={child}>
                <Dockable.TabList<Types> aria-label="Tabs">
                    {(tab) => <Dockable.Tab node={tab}>{tab.label}</Dockable.Tab>}
                </Dockable.TabList>
                <Dockable.TabSetContent />
            </Dockable.TabSet>
        );
    }
    return <Dockable.Row node={child}>{renderNode}</Dockable.Row>;
}

<Dockable.Root model={model} style={{ height: "100vh" }}>
    <Dockable.Row<Types>>{renderNode}</Dockable.Row>
    <Dockable.Panels<Types>>
        {(tab) => (
            <Dockable.Panel node={tab}>
                <TabContent tab={tab} />
            </Dockable.Panel>
        )}
    </Dockable.Panels>
    <Dockable.DropIndicator />
</Dockable.Root>
```

- Panels render in the root, not in their tabset: the engine positions each one over its tabset,
  so content keeps its state when a tab moves.
- Dockable renders no text. Name the tab list, the splitters (`renderSplitter` on `Row`) and
  every button you add.

## State attributes

`data-selected` (`Tab`, `Panel`), `data-active` (`TabSet`), `data-dragging` (`Root`, `Tab`,
`Splitter`, `DropIndicator`), `data-maximized` (`Root`, `TabSet`), `data-empty` (`TabSet`,
`TabSetContent`), `data-pinned` (`Tab`), `data-visible` (`Panel`, `DropIndicator`), `data-orientation` (`Row`, `TabList`, `Splitter`),
`data-drop-location` and `data-drop-kind` (`DropIndicator`).

## Docs

<https://fragiola.com/dockable>, or MCP `get_docs project="dockable"`, `get_api project="dockable"`.
