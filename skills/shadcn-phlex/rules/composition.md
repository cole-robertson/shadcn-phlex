# Component Composition Rules

Compound components must be nested in the correct order. Each parent expects specific children identified by `data-slot` attributes.

## Dialog — always include Header and Title

### Incorrect

```ruby
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content do
    h2 { "Are you sure?" }
    p { "This cannot be undone." }
    ui_button { "Confirm" }
  end
end
```

### Correct

```ruby
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content do
    ui_dialog_header do
      ui_dialog_title { "Are you sure?" }
      ui_dialog_description { "This cannot be undone." }
    end
    ui_dialog_footer do
      ui_button(variant: :outline) { "Cancel" }
      ui_button { "Confirm" }
    end
  end
end
```

## Card — use sub-components, not raw divs

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

## Tabs — each trigger needs a matching content with same value

### Incorrect

```ruby
ui_tabs do
  ui_tabs_list do
    ui_tabs_trigger(value: "one") { "Tab 1" }
    ui_tabs_trigger(value: "two") { "Tab 2" }
  end
  div { "Content for tab 1" }
  div { "Content for tab 2" }
end
```

### Correct

```ruby
ui_tabs(value: "one") do
  ui_tabs_list do
    ui_tabs_trigger(value: "one") { "Tab 1" }
    ui_tabs_trigger(value: "two") { "Tab 2" }
  end
  ui_tabs_content(value: "one") { "Content for tab 1" }
  ui_tabs_content(value: "two") { "Content for tab 2" }
end
```

## Select — always wrap with trigger and content

### Incorrect

```ruby
ui_select(name: "role") do
  ui_select_item(value: "admin") { "Admin" }
  ui_select_item(value: "user") { "User" }
end
```

### Correct

```ruby
ui_select(name: "role") do
  ui_select_trigger do
    ui_select_value(placeholder: "Choose role")
  end
  ui_select_content do
    ui_select_item(value: "admin") { "Admin" }
    ui_select_item(value: "user") { "User" }
  end
end
```

## Accordion — items need trigger + content pairs

### Correct

```ruby
ui_accordion(type: "single", collapsible: true) do
  ui_accordion_item do
    ui_accordion_trigger { "Section 1" }
    ui_accordion_content { "Content 1" }
  end
  ui_accordion_item do
    ui_accordion_trigger { "Section 2" }
    ui_accordion_content { "Content 2" }
  end
end
```
