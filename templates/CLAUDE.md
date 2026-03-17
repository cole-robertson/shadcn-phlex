# Project: Rails + shadcn-phlex

This project uses **shadcn-phlex** — a complete port of shadcn/ui to Phlex for Rails with Stimulus controllers.

## Key Rules

- **All views use Phlex.** Views are Ruby classes inheriting from `ApplicationView` with `include Shadcn::Kit`.
- **Use `ui_*` helpers** for all UI components: `ui_button`, `ui_card`, `ui_dialog`, `ui_text_field`, etc.
- **Never use raw HTML** for UI elements that have a shadcn component (buttons, badges, cards, alerts, separators, skeletons, etc.).
- **Semantic colors only.** Use `bg-primary`, `text-muted-foreground` — never `bg-blue-500` or `text-gray-600`.
- **No `space-y-*` / `space-x-*`.** Use `flex flex-col gap-*` or `flex gap-*`.
- **Form controls need `name:`** for submission: `ui_checkbox(name: "user[terms]")`, `ui_select(name: "user[role]")`.
- **Use `ui_text_field` / `ui_textarea_field`** for labeled form fields (not manual Field + Label + Input).
- **Stimulus controllers are auto-wired.** Never manually add `data-controller` or `data-action` attributes.
- **Dark mode** uses CSS variables. Never add manual `dark:` color classes.

## Quick Reference

```ruby
# Buttons
ui_button(variant: :default) { "Save" }       # :default, :destructive, :outline, :secondary, :ghost, :link
ui_button(variant: :destructive, size: :sm) { "Delete" }  # :default, :xs, :sm, :lg, :icon

# Form fields
ui_text_field(label: "Email", name: "user[email]", type: "email", error: @user.errors[:email]&.first)
ui_textarea_field(label: "Bio", name: "user[bio]")

# Form controls
ui_checkbox(name: "user[terms]", checked: true)
ui_switch(name: "user[notifications]", checked: false)
ui_select(name: "user[role]") do
  ui_select_trigger { ui_select_value(placeholder: "Pick a role") }
  ui_select_content do
    ui_select_item(value: "admin") { "Admin" }
    ui_select_item(value: "user") { "User" }
  end
end

# Cards
ui_card do
  ui_card_header do
    ui_card_title { "Title" }
    ui_card_description { "Description" }
  end
  ui_card_content { "Body" }
  ui_card_footer { ui_button { "Save" } }
end

# Dialogs
ui_dialog do
  ui_dialog_trigger { ui_button { "Open" } }
  ui_dialog_content do
    ui_dialog_header do
      ui_dialog_title { "Title" }
      ui_dialog_description { "Description" }
    end
    ui_dialog_footer do
      ui_button(variant: :outline) { "Cancel" }
      ui_button { "Confirm" }
    end
  end
end

# Tables
ui_table do
  ui_table_header { ui_table_row { ui_table_head { "Name" } } }
  ui_table_body do
    @items.each do |item|
      ui_table_row { ui_table_cell { item.name } }
    end
  end
end

# Tabs
ui_tabs(value: "tab1") do
  ui_tabs_list do
    ui_tabs_trigger(value: "tab1") { "Tab 1" }
    ui_tabs_trigger(value: "tab2") { "Tab 2" }
  end
  ui_tabs_content(value: "tab1") { "Content 1" }
  ui_tabs_content(value: "tab2") { "Content 2" }
end
```

## All Available Components

**Layout:** Card, Separator, AspectRatio, ResizablePanel, ScrollArea
**Forms:** TextField, TextareaField, Input, Textarea, Label, Checkbox, Switch, RadioGroup, Select, Combobox, Slider, NativeSelect, InputOTP, Field, Fieldset
**Buttons:** Button, ButtonGroup, Toggle, ToggleGroup
**Navigation:** Tabs, Breadcrumb, Pagination, NavigationMenu, Menubar, Sidebar
**Overlays:** Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, Command
**Feedback:** Alert, Badge, Progress, Skeleton, Spinner, Toaster/Toast
**Data:** Table, Avatar, Kbd, Empty, Item
**Theme:** ThemeToggle (dark mode)
**Typography:** TypographyH1-H4, TypographyP, TypographyLead, TypographyMuted
