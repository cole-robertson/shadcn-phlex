# frozen_string_literal: true

module Pages
  module Components
    class CommandPage < BaseComponentPage
      def initialize
        super(title: "Command", description: "A command palette with search and keyboard navigation.")
      end

      def view_template
        preview("Default") do
          ui_command(class: "max-w-md rounded-lg border shadow-md") do
            ui_command_input(placeholder: "Type a command or search...")
            ui_command_list do
              ui_command_empty { "No results found." }
              ui_command_group(heading: "Suggestions") do
                ui_command_item(value: "calendar") { "Calendar" }
                ui_command_item(value: "search") { "Search Emoji" }
                ui_command_item(value: "calculator") { "Calculator" }
              end
              ui_command_separator
              ui_command_group(heading: "Settings") do
                ui_command_item(value: "profile") do
                  plain "Profile"
                  ui_command_shortcut { "Ctrl+P" }
                end
                ui_command_item(value: "billing") { "Billing" }
                ui_command_item(value: "settings") do
                  plain "Settings"
                  ui_command_shortcut { "Ctrl+," }
                end
              end
            end
          end
        end

        code <<~RUBY
          ui_command do
            ui_command_input(placeholder: "Search...")
            ui_command_list do
              ui_command_empty { "No results." }
              ui_command_group(heading: "Actions") do
                ui_command_item(value: "copy") { "Copy" }
                ui_command_item(value: "paste") { "Paste" }
              end
            end
          end
        RUBY
      end
    end
  end
end
