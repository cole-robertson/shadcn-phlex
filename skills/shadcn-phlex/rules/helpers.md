# Kit Helper Rules

When `Shadcn::Kit` is included in a Phlex view, always use the `ui_*` helper methods. They are shorter, compose naturally, and are the idiomatic way to use shadcn-phlex.

## Incorrect

```ruby
class MyView < ApplicationView
  include Shadcn::Kit

  def view_template
    # Don't use render with Kit included
    render Shadcn::UI::Card.new do
      render Shadcn::UI::CardHeader.new do
        render Shadcn::UI::CardTitle.new { "Title" }
      end
      render Shadcn::UI::CardContent.new do
        render Shadcn::UI::Button.new(variant: :default) { "Click" }
      end
    end
  end
end
```

## Correct

```ruby
class MyView < ApplicationView
  include Shadcn::Kit

  def view_template
    ui_card do
      ui_card_header do
        ui_card_title { "Title" }
      end
      ui_card_content do
        ui_button { "Click" }
      end
    end
  end
end
```

## Helper Naming Convention

Every component has a `ui_` prefixed snake_case helper:

- `Shadcn::UI::Button` → `ui_button`
- `Shadcn::UI::CardHeader` → `ui_card_header`
- `Shadcn::UI::DialogContent` → `ui_dialog_content`
- `Shadcn::UI::DropdownMenuItem` → `ui_dropdown_menu_item`
- `Shadcn::UI::TextField` → `ui_text_field`

The `ui_` prefix exists to avoid collisions with Phlex's built-in HTML methods (`label`, `input`, `button`, `select`, `table`, `p`).
