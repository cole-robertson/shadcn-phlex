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

        preview("With label", description: "Click the label to toggle.") do
          ui_checkbox { "Accept terms and conditions" }
        end

        preview("Checked with label") do
          ui_checkbox(checked: true) { "I agree to the privacy policy" }
        end

        preview("With form name") do
          ui_checkbox(name: "newsletter", checked: true) { "Subscribe to newsletter" }
        end

        code <<~RUBY
          ui_checkbox
          ui_checkbox(checked: true)
          ui_checkbox(name: "terms") { "Accept terms and conditions" }
          ui_checkbox(name: "newsletter", checked: true) { "Subscribe" }
        RUBY
      end
    end
  end
end
