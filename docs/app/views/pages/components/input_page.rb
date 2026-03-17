# frozen_string_literal: true

module Pages
  module Components
    class InputPage < BaseComponentPage
      def initialize
        super(title: "Input", description: "Displays a form input field.")
      end

      def view_template
        preview("Default") do
          ui_input(placeholder: "Email address")
        end

        preview("With label") do
          div(class: "max-w-sm") do
            ui_text_field(label: "Email", name: "email", type: "email", placeholder: "you@example.com")
          end
        end

        preview("With description") do
          div(class: "max-w-sm") do
            ui_text_field(
              label: "Username",
              name: "username",
              description: "This is your public display name.",
              placeholder: "shadcn"
            )
          end
        end

        preview("With error") do
          div(class: "max-w-sm") do
            ui_text_field(
              label: "Email",
              name: "email",
              type: "email",
              error: "Please enter a valid email address.",
              placeholder: "you@example.com"
            )
          end
        end

        preview("Disabled") do
          ui_input(placeholder: "Disabled", disabled: true)
        end

        preview("File input") do
          ui_input(type: "file")
        end

        code <<~RUBY
          ui_input(type: "email", placeholder: "Email")
          ui_text_field(label: "Name", name: "name", error: "is required")
        RUBY
      end
    end
  end
end
