# Styling Rules

## Use semantic color tokens, never hardcoded colors

### Incorrect

```ruby
div(class: "bg-white text-black border-gray-200") { "Card" }
div(class: "bg-blue-500 text-white") { "Primary action" }
div(class: "text-gray-500") { "Muted text" }
```

### Correct

```ruby
div(class: "bg-card text-card-foreground border") { "Card" }
div(class: "bg-primary text-primary-foreground") { "Primary action" }
div(class: "text-muted-foreground") { "Muted text" }
```

## Available semantic tokens

| Token | Usage |
|-------|-------|
| `background` / `foreground` | Page background and text |
| `card` / `card-foreground` | Card surfaces |
| `primary` / `primary-foreground` | Primary actions, buttons |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Muted backgrounds and text |
| `accent` / `accent-foreground` | Hover/focus states |
| `destructive` | Destructive actions, errors |
| `border` | Default border color |
| `input` | Input borders |
| `ring` | Focus rings |

## Use components instead of custom classes

### Incorrect

```ruby
div(class: "animate-pulse rounded-md bg-gray-200 h-4 w-full") {}
```

### Correct

```ruby
ui_skeleton(class: "h-4 w-full")
```

## Class merging

All components support a `class:` attribute that merges with defaults using `tailwind_merge`:

```ruby
ui_button(class: "w-full mt-4") { "Full width" }
ui_card(class: "max-w-sm") { "Narrow card" }
```

Conflicting classes are resolved correctly — user classes win:

```ruby
ui_button(class: "rounded-none") { "Square button" }
# rounded-none overrides the default rounded-md
```

## Dark mode classes

Never add manual dark mode overrides. The semantic tokens handle light/dark automatically through CSS variables. If you need dark-specific styling, use the `dark:` variant:

```ruby
div(class: "dark:opacity-80") { "Slightly transparent in dark mode" }
```
