# shadcn-phlex

A complete port of [shadcn/ui](https://ui.shadcn.com) to [Phlex](https://www.phlex.fun/) for Ruby on Rails. Every component, every Tailwind class, every variant — with Stimulus controllers that replicate Radix UI behavior and full compatibility with standard shadcn theming.

## Features

- **55 Phlex components** — every shadcn/ui v4 component with exact Tailwind classes
- **25 Stimulus controllers** — full Radix UI behavior (focus trap, keyboard nav, positioning, animations, drag/swipe)
- **7 base color themes + 17 accent colors** — compatible with [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
- **Kit module** — `ui_button(variant: :destructive) { "Delete" }` short syntax
- **Form integration** — hidden inputs for Checkbox, Switch, Select, RadioGroup, Slider, Combobox
- **Compound field helpers** — `TextField`, `TextareaField` for one-liner form fields
- **Dark mode** — drop-in toggle with localStorage persistence
- **Turbo compatible** — all controllers handle page transitions correctly
- **Rails generators** — fully automated setup
- **AI skills** — agent skill for Claude Code, Cursor, and 40+ coding agents

## Quick Start

Two commands to get started:

```ruby
# Gemfile
gem "shadcn-phlex"
```

```bash
rails g shadcn_phlex:install --base-color=zinc --accent-color=violet
```

The generator sets up everything automatically:

- `app/views/application_view.rb` — base view with `Shadcn::Kit` included
- `app/assets/stylesheets/shadcn.css` — Tailwind entrypoint with theme
- `app/assets/stylesheets/shadcn-tailwind.css` — custom variants and keyframes
- `app/assets/stylesheets/shadcn-theme.css` — theme variables (swappable)
- `app/javascript/controllers/shadcn/` — all 25 Stimulus controllers
- `config/application.rb` — autoload path for Phlex views
- `controllers/index.js` — Stimulus registration injected

Start building immediately:

```ruby
class SettingsView < ApplicationView
  def view_template
    ui_card do
      ui_card_header do
        ui_card_title { "Settings" }
        ui_card_description { "Manage your preferences." }
      end
      ui_card_content do
        ui_text_field(
          label: "Display Name",
          name: "user[name]",
          placeholder: "Enter your name"
        )
        ui_text_field(
          label: "Email",
          name: "user[email]",
          type: "email",
          description: "We'll never share your email."
        )
      end
      ui_card_footer do
        ui_button(variant: :outline) { "Cancel" }
        ui_button { "Save" }
      end
    end
  end
end
```

## Usage

All components are available as `ui_*` helpers when `Shadcn::Kit` is included (the generator does this for you):

```ruby
ui_button(variant: :destructive) { "Delete" }
ui_badge(variant: :outline) { "Beta" }
ui_separator
ui_skeleton(class: "h-4 w-[200px]")
```

Or use direct render calls:

```ruby
render Shadcn::UI::Button.new(variant: :destructive) { "Delete" }
```

## Components

### Layout & Structure
`Card` `CardHeader` `CardTitle` `CardDescription` `CardAction` `CardContent` `CardFooter` `Separator` `AspectRatio` `ResizablePanelGroup` `ResizablePanel` `ResizableHandle` `ScrollArea` `ScrollBar`

### Forms
`Input` `Textarea` `Label` `Checkbox` `Switch` `RadioGroup` `RadioGroupItem` `Select` `SelectTrigger` `SelectValue` `SelectContent` `SelectItem` `Slider` `Combobox` `NativeSelect` `InputOTP` `InputGroup` `Field` `FieldControl` `FieldDescription` `FieldError` `Fieldset` `TextField` `TextareaField`

### Buttons & Actions
`Button` `ButtonGroup` `Toggle` `ToggleGroup` `ToggleGroupItem`

### Navigation
`Tabs` `TabsList` `TabsTrigger` `TabsContent` `Breadcrumb` `BreadcrumbList` `BreadcrumbItem` `BreadcrumbLink` `BreadcrumbPage` `BreadcrumbSeparator` `Pagination` `NavigationMenu` `Menubar` `Sidebar`

### Feedback
`Alert` `AlertTitle` `AlertDescription` `Badge` `Progress` `Skeleton` `Spinner` `Toaster` `Toast`

### Overlays
`Dialog` `DialogTrigger` `DialogContent` `DialogHeader` `DialogFooter` `DialogTitle` `DialogDescription` `AlertDialog` `Sheet` `SheetContent` `Drawer` `DrawerContent` `Popover` `PopoverContent` `Tooltip` `TooltipContent` `HoverCard` `HoverCardContent` `DropdownMenu` `DropdownMenuContent` `DropdownMenuItem` `ContextMenu` `Command` `CommandDialog` `CommandInput` `CommandList` `CommandItem`

### Data Display
`Table` `TableHeader` `TableBody` `TableRow` `TableHead` `TableCell` `Avatar` `AvatarImage` `AvatarFallback` `AvatarGroup` `Kbd` `Empty`

### Utility
`Direction` `ThemeToggle` `Typography*`

## Form Integration

Custom controls accept a `name:` parameter for form submission:

```ruby
ui_checkbox(name: "user[terms]", checked: @user.terms)
ui_switch(name: "user[notifications]", checked: true)
ui_select(name: "user[role]") do
  ui_select_trigger { ui_select_value(placeholder: "Pick a role") }
  ui_select_content do
    ui_select_item(value: "admin") { "Admin" }
    ui_select_item(value: "user") { "User" }
  end
end
ui_slider(name: "user[volume]", value: 50, min: 0, max: 100)
```

## Theming

Themes use the **exact same CSS variable format** as shadcn/ui. To change themes:

1. Go to [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
2. Pick a theme and copy the CSS
3. Paste into `app/assets/stylesheets/shadcn-theme.css`

Or generate from Ruby:

```ruby
css = Shadcn::Themes.generate_css(
  base_color: :zinc,
  accent_color: :violet,
  radius: "0.5rem"
)
```

### Available themes

**Base colors:** `neutral` `stone` `zinc` `mauve` `olive` `mist` `taupe`

**Accent colors:** `blue` `red` `green` `orange` `violet` `amber` `cyan` `emerald` `fuchsia` `indigo` `lime` `pink` `purple` `rose` `sky` `teal` `yellow`

## Dark Mode

```ruby
ui_theme_toggle # renders sun/moon button, persists to localStorage
```

## Generators

```bash
# Full automated setup
rails g shadcn_phlex:install

# With theme options
rails g shadcn_phlex:install --base-color=zinc --accent-color=blue --radius=0.5rem
```

## AI / LLM Support

Install the agent skill so LLMs know how to use the library:

```bash
npx skills add shadcn-phlex/shadcn-phlex
```

This uses the standard [agent skills](https://agentskills.io) ecosystem — one command installs into `.claude/skills/`, `.cursor/skills/`, etc. for 40+ coding agents. After installation, any LLM entering the project knows every component, composition pattern, and best practice.

The skill follows the same structure as [shadcn's own agent skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) — component selection tables, composition rules, form rules, styling rules, and Incorrect/Correct Ruby/Phlex code pairs for every rule.

## Testing

```bash
bundle exec rspec
```

142 specs covering all components, variants, ARIA, Stimulus wiring, form integration, themes, and the Kit module.

## License

MIT
