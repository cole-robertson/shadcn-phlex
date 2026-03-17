# frozen_string_literal: true

module Pages
  module Components
    class ContextMenuPage < BaseComponentPage
      def initialize
        super(title: "Context Menu", description: "Displays a menu at the pointer position, activated on right-click.")
      end

      def view_template
        preview("Default") do
          ui_context_menu do
            ui_context_menu_trigger(class: "flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground") do
              plain "Right click here"
            end
            ui_context_menu_content do
              ui_context_menu_item { "Back" }
              ui_context_menu_item { "Forward" }
              ui_context_menu_item { "Reload" }
              ui_context_menu_separator
              ui_context_menu_item do
                plain "Save As..."
                ui_context_menu_shortcut { "Ctrl+S" }
              end
              ui_context_menu_item { "Print" }
              ui_context_menu_separator
              ui_context_menu_item { "View Page Source" }
              ui_context_menu_item { "Inspect" }
            end
          end
        end

        code <<~RUBY
          ui_context_menu do
            ui_context_menu_trigger { "Right click here" }
            ui_context_menu_content do
              ui_context_menu_item { "Back" }
              ui_context_menu_item { "Forward" }
              ui_context_menu_separator
              ui_context_menu_item { "Inspect" }
            end
          end
        RUBY
      end
    end
  end
end
