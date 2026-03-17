# Forms & Inputs

## Use TextField / TextareaField for common fields

Always use compound field helpers for standard labeled inputs — never manual Field + Label + Input + FieldError.

### Incorrect

```ruby
ui_field do
  ui_label(for: "email") { "Email" }
  ui_input(name: "user[email]", id: "email", type: "email",
           aria_invalid: @user.errors[:email].any? ? "true" : nil)
  if @user.errors[:email].any?
    ui_field_error { @user.errors[:email].first }
  end
end
```

### Correct

```ruby
ui_text_field(
  label: "Email",
  name: "user[email]",
  type: "email",
  error: @user.errors[:email]&.first
)
```

---

## Form controls need `name:` for submission

Custom controls are **purely visual** without `name:`. The hidden `<input>` is only rendered when `name:` is provided.

### Incorrect — data won't submit

```ruby
ui_checkbox(checked: @user.terms_accepted)
ui_switch(checked: @user.notifications)
ui_select do
  ui_select_trigger { ui_select_value(placeholder: "Role") }
  ui_select_content { ui_select_item(value: "admin") { "Admin" } }
end
```

### Correct — data submits

```ruby
ui_checkbox(name: "user[terms_accepted]", checked: @user.terms_accepted)
ui_switch(name: "user[notifications]", checked: @user.notifications)
ui_select(name: "user[role]") do
  ui_select_trigger { ui_select_value(placeholder: "Role") }
  ui_select_content { ui_select_item(value: "admin") { "Admin" } }
end
```

---

## Choosing form controls

| Situation | Component |
|-----------|-----------|
| Simple text input | `TextField` (compound) or `Input` |
| Dropdown with predefined options | `Select` |
| Searchable dropdown | `Combobox` |
| Native HTML select (no JS) | `NativeSelect` |
| Boolean toggle (settings page) | `Switch` |
| Boolean agree/accept (forms, T&C) | `Checkbox` |
| Single choice from few options | `RadioGroup` |
| Toggle between 2–5 options | `ToggleGroup` |
| OTP/verification code | `InputOTP` |
| Multi-line text | `TextareaField` (compound) or `Textarea` |
| Numeric range | `Slider` |

---

## Option sets (2–7 choices) use ToggleGroup

Don't loop Button with manual active state.

### Incorrect

```ruby
%w[daily weekly monthly].each do |option|
  ui_button(variant: @selected == option ? :default : :outline) { option }
end
```

### Correct

```ruby
ui_toggle_group do
  ui_toggle_group_item(value: "daily") { "Daily" }
  ui_toggle_group_item(value: "weekly") { "Weekly" }
  ui_toggle_group_item(value: "monthly") { "Monthly" }
end
```

---

## Fieldset + FieldsetLegend for grouping related fields

Use `Fieldset` + `FieldsetLegend` for related checkboxes, radios, or switches — not a div with a heading.

### Incorrect

```ruby
div do
  h3(class: "text-sm font-medium") { "Preferences" }
  ui_checkbox(name: "prefs[dark]")
  ui_label { "Dark mode" }
end
```

### Correct

```ruby
ui_fieldset do
  ui_fieldset_legend { "Preferences" }
  ui_field do
    ui_checkbox(name: "prefs[dark]")
    ui_label { "Dark mode" }
  end
end
```

---

## Validation

Pass `error:` to compound fields, or use `aria_invalid:` on controls directly.

```ruby
# Compound (recommended)
ui_text_field(label: "Email", name: "email", error: @errors[:email]&.first)

# Manual
ui_field do
  ui_label { "Email" }
  ui_input(name: "email", aria_invalid: @errors[:email] ? "true" : nil)
  ui_field_error { @errors[:email].first } if @errors[:email]
end
```

## Checkbox / Switch values

- `checked: true` → hidden input `value="1"`
- `checked: false` → hidden input `value="0"`
- The Stimulus controller updates the value on toggle
