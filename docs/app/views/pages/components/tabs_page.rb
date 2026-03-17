# frozen_string_literal: true

module Pages
  module Components
    class TabsPage < BaseComponentPage
      def initialize
        super(title: "Tabs", description: "A set of layered sections of content, known as tab panels.")
      end

      def view_template
        preview("Default") do
          ui_tabs(value: "account", class: "max-w-md") do
            ui_tabs_list do
              ui_tabs_trigger(value: "account") { "Account" }
              ui_tabs_trigger(value: "password") { "Password" }
            end
            ui_tabs_content(value: "account") do
              ui_card do
                ui_card_header do
                  ui_card_title { "Account" }
                  ui_card_description { "Make changes to your account here." }
                end
                ui_card_content do
                  ui_text_field(label: "Name", name: "name", placeholder: "John Doe")
                end
              end
            end
            ui_tabs_content(value: "password") do
              ui_card do
                ui_card_header do
                  ui_card_title { "Password" }
                  ui_card_description { "Change your password here." }
                end
                ui_card_content do
                  ui_text_field(label: "Current password", name: "current", type: "password")
                end
              end
            end
          end
        end

        preview("Line variant") do
          ui_tabs(value: "account", class: "max-w-md") do
            ui_tabs_list(variant: :line) do
              ui_tabs_trigger(value: "account") { "Account" }
              ui_tabs_trigger(value: "password") { "Password" }
              ui_tabs_trigger(value: "settings") { "Settings" }
            end
            ui_tabs_content(value: "account") do
              p(class: "text-sm text-muted-foreground p-4") { "Account settings content." }
            end
            ui_tabs_content(value: "password") do
              p(class: "text-sm text-muted-foreground p-4") { "Password settings content." }
            end
            ui_tabs_content(value: "settings") do
              p(class: "text-sm text-muted-foreground p-4") { "General settings content." }
            end
          end
        end

        code <<~RUBY
          ui_tabs(value: "account") do
            ui_tabs_list do
              ui_tabs_trigger(value: "account") { "Account" }
              ui_tabs_trigger(value: "password") { "Password" }
            end
            ui_tabs_content(value: "account") { "Account content" }
            ui_tabs_content(value: "password") { "Password content" }
          end
        RUBY
      end
    end
  end
end
