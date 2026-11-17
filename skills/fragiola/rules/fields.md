# Fields

**A control never carries its own body.** Border, background, height and focus ring belong to the
field frame (`Field.Row` / `Field.Body`). The control (`Input`, `Textarea`, `Numeric`) is only
its middle. That is why there is one input, in a group or alone.

## Anatomy

```tsx
import { Input } from "@/components/atoms/fields";
import { Field } from "@/components/ui/field";

<Field.Root className="palette-surface-blue">
    <Field.Label>Email</Field.Label>
    <Field.Row>
        <Field.Body>
            <Input type="email" placeholder="you@example.com" />
        </Field.Body>
    </Field.Row>
    <Field.Description>We never share it.</Field.Description>
    <Field.Error>Enter a valid email address.</Field.Error>
</Field.Root>
```

```tsx
// Incorrect: a bare input has no frame, and a styled one duplicates the frame
<Input className="rounded-md border px-3 h-9" />

// Correct: the frame comes from Field.Row + Field.Body
<Field.Root>
    <Field.Row>
        <Field.Body>
            <Input />
        </Field.Body>
    </Field.Row>
</Field.Root>
```

## Addons and icons

```tsx
<Field.Row>
    <Field.Addon side="inline-start">$</Field.Addon>
    <Field.Body>
        <Input placeholder="0.00" />
    </Field.Body>
</Field.Row>

<Field.Row>
    <Field.Body>
        <Field.Inset>
            <SearchIcon className="size-4" />
        </Field.Inset>
        <Input placeholder="Search…" />
    </Field.Body>
</Field.Row>
```

`side` is logical: `inline-start` / `inline-end`.

## Template

`Input.Template.Simple` assembles the common case: label, description, addons, at most seven flat
props, no appearance props.

```tsx
<Input.Template.Simple
    className="palette-surface-blue"
    label="Website"
    description="Enter your full URL."
    placeholder="example"
    addon={{ inline: { start: "https://" } }}
    required
/>
```

For anything else, assemble the parts.

## Checkbox, radio, switch

Choice controls sit in `Field.ChoiceRoot`, with the label linked by `htmlFor`.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";

<Field.ChoiceRoot className="palette-surface-blue">
    <Checkbox.Root id="terms">
        <Checkbox.Indicator />
    </Checkbox.Root>
    <Field.Label htmlFor="terms">Accept terms</Field.Label>
</Field.ChoiceRoot>

<RadioGroup defaultValue="card">
    <Field.ChoiceRoot>
        <Radio.Root value="card" id="pay-card">
            <Radio.Indicator />
        </Radio.Root>
        <Field.Label htmlFor="pay-card">Card</Field.Label>
    </Field.ChoiceRoot>
</RadioGroup>

<Field.ChoiceRoot>
    <Switch.Root id="alerts">
        <Switch.Thumb />
    </Switch.Root>
    <Field.Label htmlFor="alerts">Email alerts</Field.Label>
</Field.ChoiceRoot>
```

## Select and Combobox

The trigger **is** the frame: put it directly in `Field.Root`, without `Field.Row`.

```tsx
<Field.Root className="palette-surface-blue">
    <Field.Label>Timezone</Field.Label>
    <Select.Root>
        <Select.Trigger>
            <Select.Value placeholder="Select a timezone" />
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                <Select.Label>Americas</Select.Label>
                <Select.Item value="est">Eastern (EST)</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Item value="utc">UTC</Select.Item>
        </Select.Content>
    </Select.Root>
</Field.Root>

<Field.Root className="palette-surface-blue">
    <Field.Label>Framework</Field.Label>
    <Combobox.Root items={frameworks}>
        <Combobox.InputGroup>
            <Combobox.Input placeholder="Search…" />
            <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Content>
            <Combobox.List>
                {(item) => (
                    <Combobox.Item key={item.value} value={item}>
                        {item.label}
                    </Combobox.Item>
                )}
            </Combobox.List>
            <Combobox.Empty>No results.</Combobox.Empty>
        </Combobox.Content>
    </Combobox.Root>
</Field.Root>
```

Multiple selection: `Combobox.Root multiple`, and `Combobox.Chips` **replaces**
`Combobox.InputGroup`. The chips and the input render inside `Combobox.Value`:

```tsx
<Combobox.Root multiple items={frameworks} defaultValue={["react"]}>
    <Combobox.Chips className={`${field.row()} flex-row items-center gap-1.5 px-3 py-2`}>
        <Combobox.Value>
            {(values: string[]) => (
                <>
                    {values.map((value) => (
                        <Combobox.Chip key={value}>
                            {labelOf(value)}
                            <Combobox.ChipRemove aria-label={`Remove ${labelOf(value)}`} />
                        </Combobox.Chip>
                    ))}
                    <Combobox.Input placeholder="Search…" />
                </>
            )}
        </Combobox.Value>
        <Combobox.Trigger />
        <Combobox.Clear />
    </Combobox.Chips>
    <Combobox.Content>{/* List, Item, Empty as above */}</Combobox.Content>
</Combobox.Root>
```

`field` is the style family (`@/components/families/field`); `field.row()` gives the chips the
frame.

## States

`invalid` and `disabled` go on `Field.Root`, never as classes on the control. `required` is
the control's own attribute.

```tsx
<Field.Root invalid>…<Field.Error>This username is taken.</Field.Error></Field.Root>
<Field.Root disabled>…</Field.Root>
<Input required />
```

```tsx
// Incorrect
<Input aria-invalid className="border-red-500" />

// Correct: invalid turns the field into palette-danger
<Field.Root invalid>
    <Field.Row><Field.Body><Input /></Field.Body></Field.Row>
    <Field.Error>Required.</Field.Error>
</Field.Root>
```

## Palette

Give fields a surface-ring palette (`palette-surface-blue`, …) so the frame stays neutral and the
focus ring carries the color. See [palettes](palettes.md).
