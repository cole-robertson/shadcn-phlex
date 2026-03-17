# frozen_string_literal: true

module Pages
  module Components
    class LabelPage < BaseComponentPage
      def initialize
        super(title: "Label", description: "Renders an accessible label associated with controls.")
      end

      def view_template
        preview("Default") do
          ui_label { "Email address" }
        end

        preview("With input") do
          div(class: "max-w-sm flex flex-col gap-2") do
            ui_label(for: "email") { "Email" }
            ui_input(id: "email", type: "email", placeholder: "you@example.com")
          end
        end

        preview("Disabled state") do
          div(class: "max-w-sm flex flex-col gap-2", data_disabled: "true") do
            ui_label(for: "disabled-input") { "Disabled field" }
            ui_input(id: "disabled-input", placeholder: "Disabled", disabled: true)
          end
        end

        code <<~RUBY
          ui_label { "Label text" }
          ui_label(for: "email") { "Email" }
        RUBY
      end
    end
  end
end
