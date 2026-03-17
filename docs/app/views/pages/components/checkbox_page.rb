# frozen_string_literal: true

module Pages
  module Components
    class CheckboxPage < BaseComponentPage
      def initialize
        super(title: "Checkbox", description: "A control that allows the user to toggle between checked and not checked.")
      end

      def view_template
        preview("Unchecked") do
          ui_checkbox
        end

        preview("Checked") do
          ui_checkbox(checked: true)
        end

        preview("With label") do
          div(class: "flex items-center gap-2") do
            ui_checkbox(checked: false)
            ui_label { "Accept terms and conditions" }
          end
        end

        preview("Checked with label") do
          div(class: "flex items-center gap-2") do
            ui_checkbox(checked: true)
            ui_label { "I agree to the privacy policy" }
          end
        end

        preview("With form name") do
          div(class: "flex items-center gap-2") do
            ui_checkbox(name: "newsletter", checked: true)
            ui_label { "Subscribe to newsletter" }
          end
        end

        code <<~RUBY
          ui_checkbox
          ui_checkbox(checked: true)
          ui_checkbox(name: "terms", checked: false)
        RUBY
      end
    end
  end
end
