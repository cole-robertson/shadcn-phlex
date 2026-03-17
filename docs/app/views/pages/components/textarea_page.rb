# frozen_string_literal: true

module Pages
  module Components
    class TextareaPage < BaseComponentPage
      def initialize
        super(title: "Textarea", description: "Displays a form textarea or a component that looks like a textarea.")
      end

      def view_template
        preview("Default") do
          div(class: "max-w-sm") do
            ui_textarea(placeholder: "Type your message here.")
          end
        end

        preview("With TextareaField") do
          div(class: "max-w-sm") do
            ui_textarea_field(
              label: "Your message",
              name: "message",
              description: "Max 500 characters.",
              placeholder: "Tell us what you think..."
            )
          end
        end

        preview("With error") do
          div(class: "max-w-sm") do
            ui_textarea_field(
              label: "Bio",
              name: "bio",
              error: "Bio must be at least 10 characters.",
              placeholder: "Tell us about yourself..."
            )
          end
        end

        preview("Disabled") do
          div(class: "max-w-sm") do
            ui_textarea(placeholder: "Disabled textarea", disabled: true)
          end
        end

        code <<~RUBY
          ui_textarea(placeholder: "Type here...")
          ui_textarea_field(
            label: "Message",
            name: "message",
            description: "Max 500 characters."
          )
        RUBY
      end
    end
  end
end
