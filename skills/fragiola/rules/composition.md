# Composition

Behavior and accessibility come from Base UI; appearance comes from Fragiola's atoms and families.
Components are namespaces of parts, assembled like the docs examples.

## One namespace per component

```tsx
// Incorrect: shadcn-style flat names do not exist
import { DialogContent, DialogTitle } from "@/components/ui/dialog";

// Correct
import { Dialog } from "@/components/ui/dialog";
<Dialog.Title>Edit profile</Dialog.Title>
```

`RadioGroup` is the one named export beside its namespace: `import { Radio, RadioGroup }`.

## `render`, never `asChild`

Swap the rendered element with `render`.

```tsx
// Incorrect
<Dialog.Trigger asChild><button>Open</button></Dialog.Trigger>

// Correct
<Dialog.Trigger render={<Clickable.Button variant="outline" />}>Open</Dialog.Trigger>
<Dialog.Close render={<Clickable.Button variant="outline" />}>Cancel</Dialog.Close>
```

## There is no `Button`

The button is the `clickable` atom.

```tsx
// Incorrect
import { Button } from "@/components/ui/button";

// Correct
import { Clickable } from "@/components/atoms/clickable";
<Clickable.Button>Save</Clickable.Button>
<Clickable.Button variant="icon" shape="square" aria-label="Add"><PlusIcon /></Clickable.Button>
<Clickable.Link href="/docs">Docs</Clickable.Link>
```

`variant`: `solid` (default), `outline`, `ghost`, `icon`. `size`: `sm`, `md` (default). `shape`:
`auto` (default), `square`. Color comes from a palette class, not a prop.

## Dialog and AlertDialog

Every part is explicit: portal, backdrop, content, header with a title.

```tsx
<Dialog.Root>
    <Dialog.Trigger render={<Clickable.Button variant="outline" />}>Edit profile</Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Edit profile</Dialog.Title>
                <Dialog.Description>Save when you are done.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>{/* fields */}</Dialog.Body>
            <Dialog.Footer>
                <Dialog.Close render={<Clickable.Button variant="outline" />}>Cancel</Dialog.Close>
                <Clickable.Button>Save</Clickable.Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
```

`AlertDialog` has the same parts. Always include a `Title`.

## Drawer

The same layer parts, inside a positioned viewport and popup.

```tsx
<Drawer.Root swipeDirection="right">
    <Drawer.Trigger render={<Clickable.Button variant="outline" />}>Open</Drawer.Trigger>
    <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="right">
            <Drawer.Popup side="right">
                <Drawer.Handle />
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>Filters</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>{/* … */}</Drawer.Body>
                </Drawer.Content>
            </Drawer.Popup>
        </Drawer.Viewport>
    </Drawer.Portal>
</Drawer.Root>
```

## Menus

`DropdownMenu` and `ContextMenu` share their parts: `Item`, `SelectableItem`, `CheckboxItem`,
`RadioGroup`, `RadioItem`, `Group`, `Label`, `Separator`, `Shortcut`, `Sub`, `SubTrigger`,
`SubContent`.

```tsx
// Incorrect: a Label outside a Group fails (Base UI needs the group context)
<DropdownMenu.Content>
    <DropdownMenu.Label>Account</DropdownMenu.Label>
</DropdownMenu.Content>

// Correct
<DropdownMenu.Content>
    <DropdownMenu.Group>
        <DropdownMenu.Label>Account</DropdownMenu.Label>
        <DropdownMenu.Item>Profile</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item className="palette-danger">Delete</DropdownMenu.Item>
</DropdownMenu.Content>
```

## Popover and Tooltip

```tsx
<Popover.Root>
    <Popover.Trigger render={<Clickable.Button variant="outline" />}>Open</Popover.Trigger>
    <Popover.Content align="start" sideOffset={4}>
        <Popover.Title>Dimensions</Popover.Title>
        <Popover.Description>Set the canvas size.</Popover.Description>
    </Popover.Content>
</Popover.Root>

<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger render={<Clickable.Button variant="outline" />}>Hover</Tooltip.Trigger>
        <Tooltip.Content>A short label.</Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>
```

`Tooltip.Provider` groups tooltips so the delay is shared.

## Tabs, Accordion, Collapsible

```tsx
<Tabs.Root defaultValue="account">
    <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="account">…</Tabs.Panel>
    <Tabs.Panel value="password">…</Tabs.Panel>
</Tabs.Root>

<Accordion.Root>
    <Accordion.Item>
        <Accordion.Header>
            <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
            <Accordion.Content>Yes.</Accordion.Content>
        </Accordion.Panel>
    </Accordion.Item>
</Accordion.Root>
```

`Tabs.Tab`, not `TabsTrigger`. `Collapsible` uses `Root`, `Trigger`, `Panel`, `Content`.

## Sidebar

`Sidebar.Provider` > `Sidebar.Root` (`collapsible="icon"`) > `Header` / `Content` / `Footer`.
Navigation is `Group` > `GroupLabel` + `GroupContent` > `Menu` > `MenuItem` > `MenuButton`, with
`MenuBadge`, `MenuAction`, `MenuSub` > `MenuSubItem` > `MenuSubButton`. Put the page beside it in
`Sidebar.Inset`. The sidebar switches to a drawer based on its provider's width, not the viewport.

## Avatar

```tsx
<Avatar.Root className="size-12">
    <Avatar.Image src={user.avatar} alt={user.name} />
    <Avatar.Fallback>MS</Avatar.Fallback>
</Avatar.Root>
```

## Text

Typography comes from `Text`, worn through `render` by other parts.

```tsx
<Text.Heading as="h2">Settings</Text.Heading>
<Text.Paragraph>Body copy.</Text.Paragraph>
<Text.Small>Small italic.</Text.Small>
<Text.Label>Label</Text.Label>
<Text.Error>Error message.</Text.Error>
<Text.Link href="/docs">Docs</Text.Link>
<Text.Clickable type="button">inline action</Text.Clickable>
```

## Use what exists, compose the rest

There is no `Card`, `Alert`, toast, `Sheet`, `Command`, `Calendar` or `Empty`. Do not import them.

- Drawer instead of `Sheet`.
- A surface is a palette plus roles:
  `palette-raised rounded-lg border border-palette-line bg-palette-base p-6 text-palette-contrast`.
- A callout is a palette's `soft` background with `accent` text:
  `palette-blue rounded-md bg-palette-soft p-4 text-palette-accent`.

Before building custom markup, check the registry (`search_fragiola` or
`npx shadcn@latest view @fragiola/<name>`).
