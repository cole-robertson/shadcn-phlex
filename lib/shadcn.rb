# frozen_string_literal: true

require "phlex"
require "class_variants"
require "tailwind_merge"

require_relative "shadcn/version"
require_relative "shadcn/base"

# UI Components
require_relative "shadcn/ui/accordion"
require_relative "shadcn/ui/alert"
require_relative "shadcn/ui/alert_dialog"
require_relative "shadcn/ui/aspect_ratio"
require_relative "shadcn/ui/avatar"
require_relative "shadcn/ui/badge"
require_relative "shadcn/ui/breadcrumb"
require_relative "shadcn/ui/button"
require_relative "shadcn/ui/button_group"
require_relative "shadcn/ui/card"
require_relative "shadcn/ui/checkbox"
require_relative "shadcn/ui/collapsible"
require_relative "shadcn/ui/command"
require_relative "shadcn/ui/combobox"
require_relative "shadcn/ui/context_menu"
require_relative "shadcn/ui/dialog"
require_relative "shadcn/ui/direction"
require_relative "shadcn/ui/drawer"
require_relative "shadcn/ui/dropdown_menu"
require_relative "shadcn/ui/empty"
require_relative "shadcn/ui/field"
require_relative "shadcn/ui/hover_card"
require_relative "shadcn/ui/input"
require_relative "shadcn/ui/input_group"
require_relative "shadcn/ui/input_otp"
require_relative "shadcn/ui/item"
require_relative "shadcn/ui/kbd"
require_relative "shadcn/ui/label"
require_relative "shadcn/ui/menubar"
require_relative "shadcn/ui/native_select"
require_relative "shadcn/ui/navigation_menu"
require_relative "shadcn/ui/pagination"
require_relative "shadcn/ui/popover"
require_relative "shadcn/ui/progress"
require_relative "shadcn/ui/radio_group"
require_relative "shadcn/ui/resizable"
require_relative "shadcn/ui/scroll_area"
require_relative "shadcn/ui/select"
require_relative "shadcn/ui/separator"
require_relative "shadcn/ui/sheet"
require_relative "shadcn/ui/sidebar"
require_relative "shadcn/ui/skeleton"
require_relative "shadcn/ui/slider"
require_relative "shadcn/ui/sonner"
require_relative "shadcn/ui/spinner"
require_relative "shadcn/ui/switch"
require_relative "shadcn/ui/table"
require_relative "shadcn/ui/tabs"
require_relative "shadcn/ui/textarea"
require_relative "shadcn/ui/toggle"
require_relative "shadcn/ui/toggle_group"
require_relative "shadcn/ui/tooltip"
require_relative "shadcn/ui/typography"
require_relative "shadcn/ui/theme_toggle"
require_relative "shadcn/ui/text_field"

# Kit module (short helpers)
require_relative "shadcn/kit"

# Theme system
require_relative "shadcn/themes/base_colors"
require_relative "shadcn/themes/accent_colors"

# Rails engine (loaded conditionally)
require_relative "shadcn/engine" if defined?(Rails::Engine)

module Shadcn
  module UI
  end
end
