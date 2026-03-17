# frozen_string_literal: true

module Pages
  module Components
    class CardPage < BaseComponentPage
      def initialize
        super(title: "Card", description: "Displays a card with header, content, and footer.")
      end

      def view_template
        preview("Default") do
          ui_card(class: "max-w-sm") do
            ui_card_header do
              ui_card_title { "Card Title" }
              ui_card_description { "Card description goes here." }
            end
            ui_card_content do
              p { "Card content with whatever you want inside." }
            end
            ui_card_footer do
              ui_button(variant: :outline) { "Cancel" }
              ui_button { "Save" }
            end
          end
        end

        preview("With form") do
          ui_card(class: "max-w-md") do
            ui_card_header do
              ui_card_title { "Create Account" }
              ui_card_description { "Enter your details below." }
            end
            ui_card_content do
              div(class: "flex flex-col gap-4") do
                ui_text_field(label: "Name", name: "name", placeholder: "John Doe")
                ui_text_field(label: "Email", name: "email", type: "email", placeholder: "john@example.com")
              end
            end
            ui_card_footer do
              ui_button(class: "w-full") { "Create Account" }
            end
          end
        end

        code <<~RUBY
          ui_card do
            ui_card_header do
              ui_card_title { "Title" }
              ui_card_description { "Description" }
            end
            ui_card_content { "Body" }
            ui_card_footer { ui_button { "Action" } }
          end
        RUBY
      end
    end
  end
end
