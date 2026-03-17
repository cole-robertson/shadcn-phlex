---
name: shadcn-phlex
description: Build UIs with shadcn-phlex — the complete shadcn/ui component library for Phlex Rails. Provides component APIs, composition patterns, form integration, theming, Stimulus controller wiring, and best practices for building Rails views with Phlex components that match shadcn/ui exactly. Applies when working with Phlex views, shadcn-phlex components, or any project with shadcn-phlex in the Gemfile.
user-invocable: false
license: MIT
compatibility: Claude Code 1.0+, Cursor, Windsurf, Cline, Copilot
allowed-tools: Bash(bundle *) Bash(ruby *) Read Write Edit Glob Grep
metadata:
  author: shadcn-phlex
  version: "0.1.0"
---

# shadcn-phlex

A complete port of shadcn/ui to Phlex for Ruby on Rails. Components are used directly from the gem or copied into the project via generators. All interactive components include Stimulus controllers that replicate Radix UI behavior.

> **IMPORTANT:** All components use `ui_*` Kit helper methods when `Shadcn::Kit` is included. Examples below use Kit helpers. Without Kit, use `render Shadcn::UI::ComponentName.new(**attrs) { block }`.

## Current Project Context

```bash
# Check installation and configuration
grep "shadcn-phlex" Gemfile
ls app/components/shadcn/ui/ 2>/dev/null || echo "Using gem directly"
cat app/assets/stylesheets/shadcn-theme.css 2>/dev/null
grep "Shadcn::Kit" app/views/application_view.rb app/components/application_component.rb 2>/dev/null
```

## Principles

1. **Use existing components first.** Check the component catalog below before writing custom markup. Use `Separator` not `<hr>`, `Skeleton` not manual pulse divs, `Badge` not styled spans.
2. **Compose, don't reinvent.** Settings page = Tabs + Card + TextField. Dashboard = Sidebar + Card + Table.
3. **Use built-in variants before custom classes.** `variant: :outline`, `size: :sm`, etc.
4. **Use semantic colors.** `bg-primary`, `text-muted-foreground` — never raw values like `bg-blue-500`.
5. **Kit helpers always.** `ui_button { "Click" }` not `render Shadcn::UI::Button.new { "Click" }`.

## Critical Rules

These rules are **always enforced**. Each links to a file with Incorrect/Correct code pairs.

### Styling & Tailwind → [styling.md](./rules/styling.md)

- **`class:` for layout, not styling.** Never override component colors or typography.
- **No `space-x-*` or `space-y-*`.** Use `flex` with `gap-*`. For vertical stacks, `div(class: "flex flex-col gap-4")`.
- **Use `size-*` when width and height are equal.** `size-10` not `w-10 h-10`.
- **Use `truncate` shorthand.** Not `overflow-hidden text-ellipsis whitespace-nowrap`.
- **No manual `dark:` color overrides.** Use semantic tokens (`bg-background`, `text-muted-foreground`).
- **Use `cn()` in custom components.** Inherit from `Shadcn::Base` to get the `cn()` helper for conditional classes.
- **No manual `z-index` on overlay components.** Dialog, Sheet, Popover, etc. handle their own stacking.

### Forms & Inputs → [forms.md](./rules/forms.md)

- **Use `TextField`/`TextareaField` for common fields.** One-liner instead of manual Field + Label + Input + FieldError.
- **Form controls need `name:` for submission.** Checkbox, Switch, Select, RadioGroup, Slider, Combobox are purely visual without it.
- **`Fieldset` + `FieldsetLegend` for grouping related checkboxes/radios.** Not a div with a heading.
- **Option sets (2–7 choices) use `ToggleGroup`.** Don't loop `Button` with manual active state.
- **Validation: pass `error:` to TextField** or set `aria_invalid: true` on the control + `data_disabled: true` on Field.

### Component Structure → [composition.md](./rules/composition.md)

- **Items always inside their parent.** `SelectItem` inside `SelectContent`. `DropdownMenuItem` inside `DropdownMenuContent`. `CommandItem` inside `CommandGroup`.
- **Dialog, Sheet, and Drawer always need a Title.** `DialogTitle`, `SheetTitle`, `DrawerTitle` required for accessibility. Use `class: "sr-only"` if visually hidden.
- **Use components instead of custom markup.** `Alert` for callouts, `Empty` for blank states, `Separator` instead of `hr`, `Skeleton` for loading, `Badge` not styled spans.
- **Button has no loading prop.** Compose with `Spinner` and `disabled:`.

### Stimulus → [stimulus.md](./rules/stimulus.md)

- **Never manually add `data-controller`, `data-action`, or `data-*-target`.** Components wire Stimulus automatically.
- **All 24 interactive components are pre-wired.** Just use the components.

## Component Selection

| Need | Components |
|------|-----------|
| **Button/Action** | `Button`, `ButtonGroup`, `Toggle`, `ToggleGroup` |
| **Form field** | `TextField` / `TextareaField` (compound), or `Field` + `Label` + `Input`/`Textarea` + `FieldError` (manual) |
| **Selection** | `Checkbox`, `Switch`, `RadioGroup`, `Select`, `Combobox` |
| **Toggle between few options** | `ToggleGroup` + `ToggleGroupItem` |
| **Card/Container** | `Card` + `CardHeader`/`CardTitle`/`CardContent`/`CardFooter` |
| **Dialog/Modal** | `Dialog` (closes on overlay click) or `AlertDialog` (does not) |
| **Slide panel** | `Sheet` + `SheetContent(side: :right)` |
| **Bottom drawer** | `Drawer` + `DrawerContent` |
| **Dropdown** | `DropdownMenu` + trigger + content + items |
| **Right-click** | `ContextMenu` + trigger + content + items |
| **Tabs** | `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` |
| **Accordion** | `Accordion` + `AccordionItem` + trigger + content |
| **Feedback** | `Alert`, `Badge`, `Progress`, `Skeleton`, `Spinner`, `Toaster`/`Toast` |
| **Tooltip** | `Tooltip` + `TooltipTrigger` + `TooltipContent` |
| **Popover** | `Popover` + `PopoverTrigger` + `PopoverContent` |
| **Hover info** | `HoverCard` + `HoverCardTrigger` + `HoverCardContent` |
| **Table** | `Table` + `TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` |
| **Navigation** | `Breadcrumb`, `Pagination`, `NavigationMenu`, `Menubar`, `Sidebar` |
| **Data display** | `Avatar`, `Kbd`, `Empty`, `Item`, `Separator` |
| **Theme** | `ThemeToggle` for dark mode |
| **Command palette** | `Command` + `CommandDialog` + `CommandInput` + `CommandList` + `CommandGroup` + `CommandItem` |
| **Loading state** | Use `Skeleton` for content placeholders, `Spinner` for inline loading |
| **Callout/Banner** | `Alert` + `AlertTitle` + `AlertDescription` (not a custom div) |
| **Empty state** | `Empty` + `EmptyMedia` + `EmptyTitle` + `EmptyDescription` + `EmptyActions` |
| **Typography** | `TypographyH1`..`H4`, `TypographyP`, `TypographyLead`, `TypographyMuted` |

### Choosing overlays

| Situation | Component |
|-----------|-----------|
| Needs user decision, blocks interaction | `AlertDialog` |
| Form or content, closeable | `Dialog` |
| Side panel (settings, details) | `Sheet` |
| Mobile-friendly bottom panel | `Drawer` |
| Small interactive content on click | `Popover` |
| Rich preview on hover | `HoverCard` |
| Short text hint on hover | `Tooltip` |

### Choosing form controls

| Situation | Component |
|-----------|-----------|
| Simple text input | `Input` (or `TextField` compound) |
| Dropdown with options | `Select` |
| Searchable dropdown | `Combobox` |
| Native HTML select | `NativeSelect` |
| Boolean toggle (settings) | `Switch` |
| Boolean toggle (forms/T&C) | `Checkbox` |
| Single choice from few options | `RadioGroup` |
| Toggle between 2-5 options | `ToggleGroup` |
| OTP/verification code | `InputOTP` |
| Multi-line text | `Textarea` (or `TextareaField` compound) |
| Numeric range | `Slider` |

## Workflow

When asked to build UI with Phlex:

1. **Check context** — is shadcn-phlex in Gemfile? Is `Shadcn::Kit` included in the base view?
2. **Select components** — use the tables above to pick the right components for each need
3. **Compose** — build the UI using Kit helpers, nesting compound components correctly
4. **Wire forms** — add `name:` to all form controls, use `TextField`/`TextareaField` for common patterns
5. **Review** — check composition rules (titles required, items in parents, semantic colors)

## Component API Quick Reference

See [references/component-catalog.md](references/component-catalog.md) for the full API of every component.

### Most-used patterns:

```ruby
# Simple form
ui_card do
  ui_card_header { ui_card_title { "Profile" } }
  ui_card_content do
    ui_text_field(label: "Name", name: "user[name]", error: @user.errors[:name]&.first)
    ui_text_field(label: "Email", name: "user[email]", type: "email")
  end
  ui_card_footer do
    ui_button { "Save" }
  end
end

# Confirmation dialog
ui_alert_dialog do
  ui_alert_dialog_trigger { ui_button(variant: :destructive) { "Delete" } }
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

# Data table
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
