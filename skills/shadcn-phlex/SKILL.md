---
name: shadcn-phlex
description: Build UIs with shadcn-phlex — the complete shadcn/ui component library for Phlex Rails. Provides component APIs, composition patterns, form integration, theming, Stimulus controller wiring, and best practices for building Rails views with Phlex components that match shadcn/ui exactly.
license: MIT
compatibility: Claude Code 1.0+, Cursor, Windsurf, Cline, Copilot
allowed-tools: Bash(bundle *) Read Write Edit Glob Grep
metadata:
  author: shadcn-phlex
  version: "0.1.0"
---

# shadcn-phlex

A complete port of shadcn/ui to Phlex for Ruby on Rails with Stimulus controllers.

## Principles

1. **Use existing components first** — check the component catalog before building custom markup
2. **Compose, don't reinvent** — combine primitive components (Field + Label + Input + FieldError) rather than building monoliths
3. **Semantic colors** — use `bg-primary`, `text-muted-foreground`, etc. Never hardcode colors like `bg-blue-500`
4. **Kit helpers** — prefer `ui_button { "Click" }` over `render Shadcn::UI::Button.new { "Click" }`
5. **data-slot attributes** — every component sets `data-slot` for CSS targeting, never override these

## Getting Project Context

Before building UI, check the project state:

```bash
# Check if shadcn-phlex is installed
grep "shadcn-phlex" Gemfile

# Check which components exist in the project
ls app/components/shadcn/ui/ 2>/dev/null || echo "Using gem directly"

# Check the theme
cat app/assets/stylesheets/shadcn-theme.css 2>/dev/null
```

## Component Selection

| Need | Components |
|------|-----------|
| **Button/Action** | `Button`, `ButtonGroup`, `Toggle`, `ToggleGroup` |
| **Form field** | `TextField`, `TextareaField` (compound), or `Field` + `Label` + `Input`/`Textarea` + `FieldError` (manual) |
| **Selection** | `Checkbox`, `Switch`, `RadioGroup`, `Select`, `Combobox` |
| **Card/Container** | `Card` + `CardHeader`/`CardTitle`/`CardContent`/`CardFooter` |
| **Dialog/Modal** | `Dialog` + `DialogTrigger` + `DialogContent` + `DialogHeader`/`DialogTitle`/`DialogFooter` |
| **Slide panel** | `Sheet` + `SheetTrigger` + `SheetContent` |
| **Bottom drawer** | `Drawer` + `DrawerTrigger` + `DrawerContent` |
| **Dropdown** | `DropdownMenu` + `DropdownMenuTrigger` + `DropdownMenuContent` + `DropdownMenuItem` |
| **Right-click** | `ContextMenu` + `ContextMenuTrigger` + `ContextMenuContent` |
| **Tabs** | `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` |
| **Accordion** | `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent` |
| **Feedback** | `Alert`, `Badge`, `Progress`, `Skeleton`, `Spinner`, `Toast` |
| **Tooltip** | `Tooltip` + `TooltipTrigger` + `TooltipContent` |
| **Popover** | `Popover` + `PopoverTrigger` + `PopoverContent` |
| **Hover info** | `HoverCard` + `HoverCardTrigger` + `HoverCardContent` |
| **Table** | `Table` + `TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` |
| **Navigation** | `Breadcrumb`, `Pagination`, `NavigationMenu`, `Menubar`, `Sidebar` |
| **Data display** | `Avatar`, `Kbd`, `Empty`, `Item`, `Separator` |
| **Theme** | `ThemeToggle` for dark mode |
| **Command palette** | `Command` + `CommandDialog` + `CommandInput` + `CommandList` + `CommandGroup` + `CommandItem` |
| **Typography** | `TypographyH1`..`H4`, `TypographyP`, `TypographyLead`, `TypographyMuted`, `TypographyList`, `TypographyBlockquote`, `TypographyInlineCode` |

## Critical Rules

- **Always use Kit helpers** when `Shadcn::Kit` is included → see [rules/helpers.md](rules/helpers.md)
- **Form controls need `name:` for submission** → see [rules/forms.md](rules/forms.md)
- **Compose compound components correctly** → see [rules/composition.md](rules/composition.md)
- **Use semantic color tokens** → see [rules/styling.md](rules/styling.md)
- **Interactive components are pre-wired** — never manually add `data-controller` → see [rules/stimulus.md](rules/stimulus.md)

## Workflow

When asked to build UI with Phlex:

1. **Check context** — is shadcn-phlex installed? Is Kit included?
2. **Select components** — use the table above to pick the right components
3. **Compose** — build the UI using Kit helpers or direct render calls
4. **Wire forms** — add `name:` to form controls, use `TextField`/`TextareaField` for common patterns
5. **Test** — verify with `bundle exec rspec`

## Component API Quick Reference

See [references/component-catalog.md](references/component-catalog.md) for the full API of every component.

### Most-used signatures:

```ruby
# Button — all variants and sizes
ui_button(variant: :default, size: :default, tag: :button, **attrs) { content }
# Variants: :default, :destructive, :outline, :secondary, :ghost, :link
# Sizes: :default, :xs, :sm, :lg, :icon, :icon_xs, :icon_sm, :icon_lg

# TextField — compound form field
ui_text_field(label:, name:, type: "text", description: nil, error: nil, required: false, **input_attrs)

# Dialog
ui_dialog do
  ui_dialog_trigger { "Open" }
  ui_dialog_content do
    ui_dialog_header { ui_dialog_title { "Title" } }
    # ... body ...
    ui_dialog_footer do
      ui_button(variant: :outline) { "Cancel" }
      ui_button { "Confirm" }
    end
  end
end

# Select with form integration
ui_select(name: "user[role]") do
  ui_select_trigger { ui_select_value(placeholder: "Pick a role") }
  ui_select_content do
    ui_select_item(value: "admin") { "Admin" }
    ui_select_item(value: "user") { "User" }
  end
end

# Tabs
ui_tabs(value: "account") do
  ui_tabs_list do
    ui_tabs_trigger(value: "account") { "Account" }
    ui_tabs_trigger(value: "password") { "Password" }
  end
  ui_tabs_content(value: "account") { "Account settings..." }
  ui_tabs_content(value: "password") { "Password settings..." }
end
```
