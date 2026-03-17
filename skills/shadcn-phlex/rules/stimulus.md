# Stimulus Controller Rules

All interactive components are **pre-wired** with Stimulus controllers. Never manually add `data-controller`, `data-action`, or `data-*-target` attributes — the Phlex components handle this automatically.

## Incorrect — manually adding Stimulus attributes

```ruby
div(data_controller: "shadcn--dialog", data_shadcn__dialog_open_value: false) do
  button(data_action: "click->shadcn--dialog#show") { "Open" }
  div(data_shadcn__dialog_target: "content") { "Content" }
end
```

## Correct — use the components, they wire everything

```ruby
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content do
    ui_dialog_title { "Title" }
    # ...
  end
end
```

## Pre-wired components

These components automatically include Stimulus controller wiring:

| Component | Controller | Behavior |
|-----------|-----------|----------|
| `Accordion` | `shadcn--accordion` | Expand/collapse, keyboard nav |
| `Checkbox` | `shadcn--checkbox` | Toggle checked state |
| `Collapsible` | `shadcn--collapsible` | Animated open/close |
| `Combobox` | `shadcn--combobox` | Search, filter, select |
| `Command` | `shadcn--command` | Cmd+K palette, search |
| `ContextMenu` | `shadcn--context-menu` | Right-click menu |
| `Dialog` | `shadcn--dialog` | Focus trap, scroll lock, escape |
| `Drawer` | `shadcn--drawer` | Swipe to dismiss |
| `DropdownMenu` | `shadcn--dropdown-menu` | Click toggle, keyboard nav |
| `HoverCard` | `shadcn--hover-card` | Delayed hover show/hide |
| `Menubar` | `shadcn--menubar` | Horizontal menu, arrow keys |
| `NavigationMenu` | `shadcn--navigation-menu` | Hover submenus |
| `Popover` | `shadcn--popover` | Click toggle, positioning |
| `RadioGroup` | `shadcn--radio-group` | Single selection, arrows |
| `ScrollArea` | `shadcn--scroll-area` | Custom scrollbar |
| `Select` | `shadcn--select` | Custom dropdown, keyboard |
| `Sheet` | `shadcn--sheet` | Slide panel, focus trap |
| `Slider` | `shadcn--slider` | Drag, arrow keys |
| `Switch` | `shadcn--switch` | Toggle on/off |
| `Tabs` | `shadcn--tabs` | Tab switching, arrow keys |
| `Toggle` | `shadcn--toggle` | Pressed state |
| `ToggleGroup` | `shadcn--toggle-group` | Single/multi selection |
| `Tooltip` | `shadcn--tooltip` | Hover with delay |
| `ThemeToggle` | `shadcn--dark-mode` | Light/dark/system toggle |

## Static components (no controller needed)

These render pure HTML/CSS with no JavaScript behavior:

`Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Card`, `Empty`, `Field`, `Input`, `InputGroup`, `Item`, `Kbd`, `Label`, `NativeSelect`, `Pagination`, `Progress`, `Separator`, `Skeleton`, `Spinner`, `Table`, `Textarea`, `Typography*`
