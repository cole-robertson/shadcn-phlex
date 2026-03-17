# frozen_string_literal: true

module Pages
  module Components
    class DropdownMenuPage < BaseComponentPage
      def initialize
        super(title: "Dropdown Menu", description: "Displays a menu to the user, triggered by a button.")
      end

      def view_template
        preview("Default") do
          ui_dropdown_menu do
            ui_dropdown_menu_trigger do
              ui_button(variant: :outline) { "Open Menu" }
            end
            ui_dropdown_menu_content do
              ui_dropdown_menu_label { "My Account" }
              ui_dropdown_menu_separator
              ui_dropdown_menu_item { "Profile" }
              ui_dropdown_menu_item { "Billing" }
              ui_dropdown_menu_item { "Settings" }
              ui_dropdown_menu_item { "Keyboard shortcuts" }
              ui_dropdown_menu_separator
              ui_dropdown_menu_item(variant: :destructive) { "Log out" }
            end
          end
        end

        preview("With shortcuts") do
          ui_dropdown_menu do
            ui_dropdown_menu_trigger do
              ui_button(variant: :outline) { "Actions" }
            end
            ui_dropdown_menu_content do
              ui_dropdown_menu_item do
                plain "New Tab"
                ui_dropdown_menu_shortcut { "Ctrl+T" }
              end
              ui_dropdown_menu_item do
                plain "New Window"
                ui_dropdown_menu_shortcut { "Ctrl+N" }
              end
              ui_dropdown_menu_separator
              ui_dropdown_menu_item do
                plain "Close Tab"
                ui_dropdown_menu_shortcut { "Ctrl+W" }
              end
            end
          end
        end

        code <<~RUBY
          ui_dropdown_menu do
            ui_dropdown_menu_trigger { ui_button { "Open" } }
            ui_dropdown_menu_content do
              ui_dropdown_menu_label { "Actions" }
              ui_dropdown_menu_separator
              ui_dropdown_menu_item { "Edit" }
              ui_dropdown_menu_item(variant: :destructive) { "Delete" }
            end
          end
        RUBY
      end
    end
  end
end
