# From shadcn to Fragiola

For agents used to shadcn/ui, or porting a shadcn component. Fragiola uses the shadcn **CLI and
registry format**, not shadcn's tokens, variants or component APIs. After porting, none of the
shadcn tokens below may remain.

## Tokens

| shadcn | Fragiola |
| --- | --- |
| `bg-background text-foreground` | `palette-surface bg-palette-base text-palette-contrast` |
| `bg-card text-card-foreground`, `bg-popover text-popover-foreground` | `palette-raised bg-palette-base text-palette-contrast` |
| `text-muted-foreground` | `text-palette-accent/85` |
| `bg-muted`, `bg-accent`, hover backgrounds | `bg-palette-soft` |
| `text-accent-foreground` | `text-palette-accent` |
| `border`, `border-input`, `border-border` | `border border-palette-line` |
| `bg-border` (dividers) | `bg-palette-line`, or `Separator` |
| `bg-primary text-primary-foreground` | `bg-palette-base text-palette-contrast` inside a chromatic palette (`palette-blue`) |
| `data-[state=checked]:bg-primary` | `data-checked:bg-palette-base` |
| `destructive` variant or classes | the `palette-danger` class |
| `focus-visible:ring-*`, `ring-offset-*` | the field frame's focus (`field-focus:outline-palette-ring`); components already have it |
| `dark:*` | removed; every palette declares both themes |
| `rounded-xl`, `rounded-2xl` | `rounded-lg` (the radius set is `sm`, `md`, `lg`, `full`) |

## APIs

| shadcn | Fragiola |
| --- | --- |
| `asChild` | `render={<Element />}` |
| `DialogContent`, `DialogTitle`, … | `Dialog.Content`, `Dialog.Title`, … |
| `Button` | `Clickable.Button`; `variant="destructive"` → `className="palette-danger"`; `variant="secondary"` → `variant="outline"` or `"ghost"` |
| `size="icon"` | `variant="icon" shape="square"` |
| `Input` with its own border | `Field.Root` > `Field.Row` > `Field.Body` > `Input` |
| `InputGroup` / `InputGroupAddon` | `Field.Row` + `Field.Addon side="inline-start"` / `Field.Inset` |
| `Label` | `Field.Label` (in a field), `Text.Label` |
| `FormMessage`, `FieldError` | `Field.Error` |
| `TabsTrigger` / `TabsContent` | `Tabs.Tab` / `Tabs.Panel` |
| `Sheet` | `Drawer` |
| `Badge variant="secondary"` | `Badge` + a palette class (`variant` soft / solid / outline) |
| `Card`, `Alert`, `Toast`, `Empty` | no equivalent: a palette surface, or keep the app's own |
| `pl`/`pr`, `ml`/`mr`, `left`/`right`, `border-l`/`border-r` | `ps`/`pe`, `ms`/`me`, `start`/`end`, `border-s`/`border-e` |
| `!important` | removed; report the conflict |

## Porting a component Fragiola does not have

1. Install it from shadcn's registry, preferring its Base UI flavor. Never let the shadcn CLI
   overwrite a file installed from `@fragiola`: answer no.
2. Apply the tables above. Reuse Fragiola atoms and families (`Clickable`, `Text`, `Field`,
   `popup`, `menu`, `layer`) instead of keeping shadcn's duplicated styles.
3. When nothing fits, choose the role by meaning ([palettes](palettes.md)). Never add a token or a
   role.
4. Search the file for `primary`, `secondary`, `muted`, `foreground`, `background`, `popover`,
   `card`, `destructive`, `input`, `ring-offset`, `dark:` and `asChild`. None may remain.
5. Say in the result that the component was converted from shadcn.
