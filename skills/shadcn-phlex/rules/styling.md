# Styling & Tailwind

## Semantic colors

### Incorrect

```ruby
div(class: "bg-blue-500 text-white") do
  p(class: "text-gray-600") { "Secondary text" }
end
```

### Correct

```ruby
div(class: "bg-primary text-primary-foreground") do
  p(class: "text-muted-foreground") { "Secondary text" }
end
```

---

## No raw color values for status indicators

Use Badge variants or semantic tokens — don't reach for raw Tailwind colors.

### Incorrect

```ruby
span(class: "text-emerald-600") { "+20.1%" }
span(class: "text-red-600") { "-3.2%" }
```

### Correct

```ruby
ui_badge(variant: :secondary) { "+20.1%" }
span(class: "text-destructive") { "-3.2%" }
```

---

## Built-in variants first

### Incorrect

```ruby
ui_button(class: "border border-input bg-transparent hover:bg-accent") { "Click" }
```

### Correct

```ruby
ui_button(variant: :outline) { "Click" }
```

---

## `class:` for layout, not styling

Use `class:` for layout (`max-w-md`, `mx-auto`, `mt-4`), **not** for overriding component colors or typography.

### Incorrect

```ruby
ui_card(class: "bg-blue-100 text-blue-900 font-bold") do
  ui_card_content { "Dashboard" }
end
```

### Correct

```ruby
ui_card(class: "max-w-md mx-auto") do
  ui_card_content { "Dashboard" }
end
```

---

## No `space-x-*` / `space-y-*`

Use `gap-*` instead. `space-y-4` → `flex flex-col gap-4`. `space-x-2` → `flex gap-2`.

### Incorrect

```ruby
div(class: "space-y-4") do
  ui_input(name: "email")
  ui_input(name: "password")
  ui_button { "Submit" }
end
```

### Correct

```ruby
div(class: "flex flex-col gap-4") do
  ui_input(name: "email")
  ui_input(name: "password")
  ui_button { "Submit" }
end
```

---

## Prefer `size-*` over `w-* h-*` when equal

`size-10` not `w-10 h-10`. Applies to icons, avatars, skeletons, etc.

---

## Prefer `truncate` shorthand

`truncate` not `overflow-hidden text-ellipsis whitespace-nowrap`.

---

## No manual `dark:` color overrides

Use semantic tokens — they handle light/dark via CSS variables.

### Incorrect

```ruby
div(class: "bg-white dark:bg-gray-950 text-black dark:text-white") { "Content" }
```

### Correct

```ruby
div(class: "bg-background text-foreground") { "Content" }
```

---

## Use `cn()` in custom components

When building custom Phlex components that extend shadcn-phlex, inherit from `Shadcn::Base` to get the `cn()` helper for intelligent Tailwind class merging.

### Incorrect

```ruby
class MyComponent < Phlex::HTML
  def view_template
    div(class: "#{@base_classes} #{@extra_classes}") { "content" }
  end
end
```

### Correct

```ruby
class MyComponent < Shadcn::Base
  def view_template
    div(class: cn("rounded-md border p-4", @attrs.delete(:class))) { "content" }
  end
end
```

---

## No manual `z-index` on overlay components

Dialog, Sheet, Drawer, AlertDialog, DropdownMenu, Popover, Tooltip, HoverCard handle their own stacking. Never add `z-50` or `z-[999]`.

---

## Class merging

All components support a `class:` attribute that merges with defaults using `tailwind_merge`. Conflicting classes are resolved — user classes win:

```ruby
ui_button(class: "w-full")         # adds w-full to button classes
ui_button(class: "rounded-none")   # overrides default rounded-md
ui_card(class: "max-w-sm")         # adds width constraint
```
