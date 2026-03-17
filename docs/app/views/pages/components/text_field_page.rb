# frozen_string_literal: true

module Pages
  module Components
    class TextFieldPage < BaseComponentPage
      def initialize
        super(title: "TextField", description: "A compound field with label, input, description, and error.")
      end

      def view_template
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

        preview("Required") do
          div(class: "max-w-sm") do
            ui_text_field(
              label: "Name",
              name: "name",
              required: true,
              placeholder: "John Doe"
            )
          end
        end

        preview("Disabled") do
          div(class: "max-w-sm") do
            ui_text_field(
              label: "Company",
              name: "company",
              disabled: true,
              placeholder: "Acme Inc."
            )
          end
        end

        preview("All options") do
          div(class: "max-w-sm") do
            ui_text_field(
              label: "Full Name",
              name: "full_name",
              description: "Enter your legal name as it appears on your ID.",
              required: true,
              placeholder: "Jane Smith"
            )
          end
        end

        code <<~RUBY
          ui_text_field(
            label: "Email",
            name: "email",
            type: "email",
            description: "We'll never share your email.",
            error: "is required",
            required: true,
            placeholder: "you@example.com"
          )
        RUBY
      end
    end
  end
end
