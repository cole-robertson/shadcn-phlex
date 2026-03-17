# Form Integration Rules

Custom form controls (Checkbox, Switch, Select, RadioGroup, Slider, Combobox) **must** receive a `name:` parameter to participate in form submission. Without `name:`, no hidden input is rendered and the control is purely visual.

## Incorrect — controls without name (data won't submit)

```ruby
ui_checkbox(checked: @user.terms_accepted)
ui_switch(checked: @user.notifications)
ui_select do
  ui_select_trigger { ui_select_value(placeholder: "Role") }
  ui_select_content do
    ui_select_item(value: "admin") { "Admin" }
  end
end
```

## Correct — controls with name (data submits)

```ruby
ui_checkbox(name: "user[terms_accepted]", checked: @user.terms_accepted)
ui_switch(name: "user[notifications]", checked: @user.notifications)
ui_select(name: "user[role]") do
  ui_select_trigger { ui_select_value(placeholder: "Role") }
  ui_select_content do
    ui_select_item(value: "admin") { "Admin" }
  end
end
```

## Use compound field helpers for common patterns

### Incorrect — manual composition for a simple labeled input

```ruby
ui_field do
  ui_label(for: "email") { "Email" }
  ui_input(name: "user[email]", id: "email", type: "email")
  if @user.errors[:email].any?
    ui_field_error { @user.errors[:email].first }
  end
end
```

### Correct — use TextField

```ruby
ui_text_field(
  label: "Email",
  name: "user[email]",
  type: "email",
  error: @user.errors[:email]&.first
)
```

## Checkbox/Switch values

- `checked: true` renders hidden input with `value="1"`
- `checked: false` renders hidden input with `value="0"`
- The Stimulus controller updates the hidden input value on toggle

## Slider values

```ruby
ui_slider(name: "settings[volume]", value: 75, min: 0, max: 100, step: 5)
```

The hidden input value is updated by the Stimulus controller as the user drags.
