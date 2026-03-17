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
- **Rails generators** — install and per-component generators
- **AI skills** — agent skill for Claude Code, Cursor, and 40+ coding agents

## Quick Start

Add to your Gemfile:

```ruby
gem "shadcn-phlex"
```

Run the install generator:

```bash
rails g shadcn_phlex:install --base-color=zinc --accent-color=violet
```

Register Stimulus controllers in your JS entrypoint:

```javascript
import { registerShadcnControllers } from "shadcn/controllers"
registerShadcnControllers(application)
```

## Usage

### Option 1: Kit helpers (recommended)

Include `Shadcn::Kit` in your base Phlex view:

```ruby
class ApplicationView < Phlex::HTML
  include Shadcn::Kit
end
```

Then use the short `ui_*` helpers:

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
          value: @user.name,
          error: @user.errors[:name]&.first
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

### Option 2: Direct render

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

Or use the built-in themes:

```css
/* In your CSS entrypoint */
@import "./shadcn-theme.css"; /* swap with any theme */
```

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

Drop in the theme toggle:

```ruby
ui_theme_toggle # renders sun/moon button, persists to localStorage
```

Or control programmatically via the `shadcn--dark-mode` Stimulus controller:

```html
<div data-controller="shadcn--dark-mode">
  <button data-action="shadcn--dark-mode#toggle">Toggle</button>
</div>
```

## Generators

```bash
# Install everything (CSS, config, instructions)
rails g shadcn_phlex:install

# With theme options
rails g shadcn_phlex:install --base-color=zinc --accent-color=blue --radius=0.5rem

# Copy individual components into your app
rails g shadcn_phlex:component button
rails g shadcn_phlex:component dialog

# Copy all components
rails g shadcn_phlex:component all
```

## AI / LLM Support

The install generator automatically sets up everything LLMs need:

```bash
rails g shadcn_phlex:install
```

This installs:
- **CLAUDE.md** — project context loaded automatically by Claude Code
- **.cursorrules** — project context loaded automatically by Cursor
- **.claude/skills/shadcn-phlex/** — full agent skill with rules, component catalog, and composition patterns
- **.cursor/skills/shadcn-phlex/** — same skill for Cursor

After installation, any LLM entering the project immediately knows how to use every component, the correct composition patterns, form integration, theming, and what not to do. No extra setup needed.

### Manual skill installation

If you prefer to install the skill separately (e.g., globally):

```bash
npx skills add shadcn-phlex/shadcn-phlex
```

### What the skill teaches LLMs

The skill follows the same structure as [shadcn's own agent skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn):

- **Component selection** — which component to use for each UI need
- **Composition rules** — correct nesting (items in parents, titles required, etc.)
- **Form rules** — `name:` for submission, TextField for labeled inputs, ToggleGroup for option sets
- **Styling rules** — semantic colors, no space-y, size-* shorthand, no manual dark:
- **Stimulus rules** — never manually add data-controller (components are pre-wired)
- **Incorrect/Correct code pairs** — concrete Ruby/Phlex examples for every rule

## CSS Structure

The CSS follows the same architecture as standard shadcn:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./shadcn-tailwind.css";  /* variants, @theme inline, keyframes */
@import "./shadcn-theme.css";     /* :root / .dark variables (swappable) */
```

`shadcn-tailwind.css` matches `shadcn/tailwind.css` exactly — same custom variants (`data-open`, `data-closed`, etc.), same `@theme inline` mapping, same keyframes.

## Testing

```bash
bundle exec rspec
```

142 specs covering all components, variants, ARIA, Stimulus wiring, form integration, themes, and the Kit module.

## License

MIT
