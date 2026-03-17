# Component Composition

## Items always inside their parent

### Incorrect

```ruby
ui_select(name: "role") do
  ui_select_item(value: "admin") { "Admin" }  # Items directly in Select
end
```

### Correct

```ruby
ui_select(name: "role") do
  ui_select_trigger { ui_select_value(placeholder: "Choose") }
  ui_select_content do                        # Items inside Content
    ui_select_item(value: "admin") { "Admin" }
  end
end
```

Same rule applies to:
- `DropdownMenuItem` → inside `DropdownMenuContent`
- `CommandItem` → inside `CommandGroup`
- `ContextMenuItem` → inside `ContextMenuContent`
- `TabsTrigger` → inside `TabsList`

---

## Dialog, Sheet, and Drawer always need a Title

Required for accessibility. Use `class: "sr-only"` if visually hidden.

### Incorrect

```ruby
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content do
    h2 { "Settings" }      # Raw h2, not a DialogTitle
    p { "Configure here." }
  end
end
```

### Correct

```ruby
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content do
    ui_dialog_header do
      ui_dialog_title { "Settings" }
      ui_dialog_description { "Configure here." }
    end
    # body...
    ui_dialog_footer do
      ui_button(variant: :outline) { "Cancel" }
      ui_button { "Save" }
    end
  end
end
```

For visually hidden title:

```ruby
ui_dialog_title(class: "sr-only") { "Settings" }
```

---

## Use components instead of custom markup

### Incorrect

```ruby
div(class: "animate-pulse rounded-md bg-gray-200 h-4 w-full") {}
```

### Correct

```ruby
ui_skeleton(class: "h-4 w-full")
```

### Incorrect

```ruby
span(class: "inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700") { "Active" }
```

### Correct

```ruby
ui_badge(variant: :secondary) { "Active" }
```

### Incorrect

```ruby
hr(class: "my-4 border-gray-200")
```

### Correct

```ruby
ui_separator
```

### Incorrect

```ruby
div(class: "flex flex-col items-center justify-center p-8 text-center") do
  h3 { "No results" }
  p(class: "text-muted-foreground") { "Try adjusting your filters." }
end
```

### Correct

```ruby
ui_empty do
  ui_empty_title { "No results" }
  ui_empty_description { "Try adjusting your filters." }
end
```

---

## Button has no loading prop

Compose with Spinner and disabled.

### Incorrect

```ruby
ui_button(loading: true) { "Saving..." }  # loading is not a prop
```

### Correct

```ruby
ui_button(disabled: @saving) do
  if @saving
    ui_spinner(size: :sm)
    plain " Saving..."
  else
    plain "Save"
  end
end
```

---

## Card content uses sub-components

### Incorrect

```ruby
ui_card do
  div(class: "p-6") do
    h3(class: "font-semibold") { "Title" }
    p(class: "text-sm text-gray-500") { "Description" }
  end
  div(class: "p-6") { "Content" }
end
```

### Correct

```ruby
ui_card do
  ui_card_header do
    ui_card_title { "Title" }
    ui_card_description { "Description" }
  end
  ui_card_content { "Content" }
end
```

---

## Tabs — trigger values must match content values

### Incorrect

```ruby
ui_tabs do
  ui_tabs_list do
    ui_tabs_trigger(value: "one") { "Tab 1" }
  end
  div { "Content" }  # raw div, no matching value
end
```

### Correct

```ruby
ui_tabs(value: "one") do
  ui_tabs_list do
    ui_tabs_trigger(value: "one") { "Tab 1" }
    ui_tabs_trigger(value: "two") { "Tab 2" }
  end
  ui_tabs_content(value: "one") { "Content 1" }
  ui_tabs_content(value: "two") { "Content 2" }
end
```

---

## Choosing overlays

| Situation | Component |
|-----------|-----------|
| Needs user decision, blocks interaction | `AlertDialog` |
| Form or content, closeable by clicking overlay | `Dialog` |
| Side panel (settings, details) | `Sheet` |
| Mobile-friendly bottom panel | `Drawer` |
| Small interactive content on click | `Popover` |
| Rich preview on hover | `HoverCard` |
| Short text hint on hover | `Tooltip` |

---

## Avatar always needs a Fallback

```ruby
ui_avatar do
  ui_avatar_image(src: user.avatar_url, alt: user.name)
  ui_avatar_fallback { user.initials }
end
```
