# Component Catalog

Complete API reference for all shadcn-phlex components.

## Button

```ruby
ui_button(
  variant: :default,  # :default, :destructive, :outline, :secondary, :ghost, :link
  size: :default,     # :default, :xs, :sm, :lg, :icon, :icon_xs, :icon_sm, :icon_lg
  tag: :button,       # :button, :a, or any HTML tag
  class: nil,         # additional Tailwind classes
  **attrs             # any HTML attributes (href:, disabled:, etc.)
) { content }
```

## Badge

```ruby
ui_badge(
  variant: :default,  # :default, :secondary, :destructive, :outline, :ghost, :link
  **attrs
) { content }
```

## Input

```ruby
ui_input(
  type: "text",  # any HTML input type
  **attrs        # name:, placeholder:, value:, disabled:, etc.
)
```

## Textarea

```ruby
ui_textarea(**attrs) { optional_default_content }
```

## Label

```ruby
ui_label(for: "input-id", **attrs) { "Label text" }
```

## TextField (compound)

```ruby
ui_text_field(
  label: "Email",           # label text (nil to omit)
  name: "user[email]",      # form field name
  type: "text",             # input type
  description: nil,         # help text below input
  error: nil,               # error message (replaces description)
  required: false,          # adds asterisk, required attr
  disabled: false,
  id: nil,                  # auto-generated from name if nil
  **input_attrs             # placeholder:, value:, etc.
)
```

## TextareaField (compound)

```ruby
ui_textarea_field(
  label: "Message",
  name: "contact[message]",
  description: nil,
  error: nil,
  required: false,
  **textarea_attrs          # rows:, cols:, placeholder:, etc.
)
```

## Checkbox

```ruby
ui_checkbox(
  checked: false,
  name: nil,       # renders hidden input when set
  **attrs
)
```

## Switch

```ruby
ui_switch(
  checked: false,
  size: :default,  # :default, :sm
  name: nil,       # renders hidden input when set
  **attrs
)
```

## Select

```ruby
ui_select(name: nil) do   # renders hidden input when name set
  ui_select_trigger do
    ui_select_value(placeholder: "Choose...")
  end
  ui_select_content do
    ui_select_group do
      ui_select_label { "Group" }
      ui_select_item(value: "val") { "Display" }
    end
    ui_select_separator
  end
end
```

## RadioGroup

```ruby
ui_radio_group(name: nil) do
  ui_radio_group_item(value: "opt1", checked: true)
  ui_radio_group_item(value: "opt2")
end
```

## Slider

```ruby
ui_slider(value: 50, min: 0, max: 100, step: 1, name: nil)
```

## Combobox

```ruby
ui_combobox(name: nil) do
  ui_combobox_trigger { ui_combobox_value(placeholder: "Search...") }
  ui_combobox_content do
    ui_combobox_input(placeholder: "Filter...")
    ui_combobox_empty { "No results." }
    ui_combobox_item(value: "val") { "Display" }
  end
end
```

## Card

```ruby
ui_card do
  ui_card_header do
    ui_card_title { "Title" }
    ui_card_description { "Description" }
    ui_card_action { ui_button(size: :sm) { "Action" } }
  end
  ui_card_content { "Body" }
  ui_card_footer { "Footer" }
end
```

## Dialog

```ruby
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content(show_close_button: true) do
    ui_dialog_header do
      ui_dialog_title { "Title" }
      ui_dialog_description { "Description" }
    end
    # ... body ...
    ui_dialog_footer do
      ui_dialog_close { ui_button(variant: :outline) { "Cancel" } }
      ui_button { "Save" }
    end
  end
end
```

## AlertDialog

Same structure as Dialog but overlay click does not close:

```ruby
ui_alert_dialog do
  ui_alert_dialog_trigger { "Delete" }
  ui_alert_dialog_content do
    ui_alert_dialog_header do
      ui_alert_dialog_title { "Are you sure?" }
      ui_alert_dialog_description { "This action cannot be undone." }
    end
    ui_alert_dialog_footer do
      ui_alert_dialog_cancel { "Cancel" }
      ui_alert_dialog_action { "Delete" }
    end
  end
end
```

## Sheet

```ruby
ui_sheet do
  ui_sheet_trigger { "Open" }
  ui_sheet_content(side: :right) do  # :top, :right, :bottom, :left
    ui_sheet_header do
      ui_sheet_title { "Edit Profile" }
      ui_sheet_description { "Make changes here." }
    end
    # ... body ...
  end
end
```

## Tabs

```ruby
ui_tabs(value: "tab1", orientation: :horizontal) do
  ui_tabs_list(variant: :default) do  # :default, :line
    ui_tabs_trigger(value: "tab1") { "Tab 1" }
    ui_tabs_trigger(value: "tab2") { "Tab 2" }
  end
  ui_tabs_content(value: "tab1") { "Content 1" }
  ui_tabs_content(value: "tab2") { "Content 2" }
end
```

## Accordion

```ruby
ui_accordion(type: "single", collapsible: true) do  # or type: "multiple"
  ui_accordion_item(open: false) do
    ui_accordion_trigger { "Section 1" }
    ui_accordion_content { "Content 1" }
  end
end
```

## Table

```ruby
ui_table do
  ui_table_header do
    ui_table_row do
      ui_table_head { "Name" }
      ui_table_head { "Email" }
    end
  end
  ui_table_body do
    @users.each do |user|
      ui_table_row do
        ui_table_cell { user.name }
        ui_table_cell { user.email }
      end
    end
  end
end
```

## Alert

```ruby
ui_alert(variant: :default) do  # :default, :destructive
  # Optional SVG icon as first child
  ui_alert_title { "Heads up!" }
  ui_alert_description { "You can add components." }
end
```

## Avatar

```ruby
ui_avatar do
  ui_avatar_image(src: user.avatar_url, alt: user.name)
  ui_avatar_fallback { user.initials }
end
```

## Separator

```ruby
ui_separator(orientation: :horizontal)  # :horizontal, :vertical
```

## Progress

```ruby
ui_progress(value: 75)
```

## Skeleton

```ruby
ui_skeleton(class: "h-4 w-[250px]")
```

## Spinner

```ruby
ui_spinner(size: :default)  # :xs, :sm, :default, :lg
```

## ThemeToggle

```ruby
ui_theme_toggle  # sun/moon toggle, persists to localStorage
```

## Tooltip

```ruby
ui_tooltip do
  ui_tooltip_trigger { ui_button(variant: :outline) { "Hover me" } }
  ui_tooltip_content { "Tooltip text" }
end
```

## DropdownMenu

```ruby
ui_dropdown_menu do
  ui_dropdown_menu_trigger { ui_button { "Options" } }
  ui_dropdown_menu_content do
    ui_dropdown_menu_label { "Actions" }
    ui_dropdown_menu_separator
    ui_dropdown_menu_item { "Edit" }
    ui_dropdown_menu_item(variant: :destructive) { "Delete" }
    ui_dropdown_menu_separator
    ui_dropdown_menu_shortcut { "⌘K" }
  end
end
```

## Command (Cmd+K palette)

```ruby
ui_command do
  ui_command_dialog do
    ui_command_input(placeholder: "Type a command...")
    ui_command_list do
      ui_command_empty { "No results." }
      ui_command_group(heading: "Suggestions") do
        ui_command_item(value: "calendar") { "Calendar" }
        ui_command_item(value: "search") { "Search" }
      end
    end
  end
end
```

## Theming

```ruby
# Generate theme CSS
css = Shadcn::Themes.generate_css(
  base_color: :zinc,        # :neutral, :stone, :zinc, :mauve, :olive, :mist, :taupe
  accent_color: :violet,    # :blue, :red, :green, :orange, :violet, :amber, etc.
  radius: "0.5rem"
)
```
