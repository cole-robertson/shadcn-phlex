# frozen_string_literal: true

module Pages
  module Components
    class TogglePage < BaseComponentPage
      def initialize
        super(title: "Toggle", description: "A two-state button that can be either on or off.")
      end

      def view_template
        preview("Default") do
          ui_toggle do
            plain "B"
          end
        end

        preview("Outline") do
          ui_toggle(variant: :outline) do
            plain "B"
          end
        end

        preview("Pressed") do
          div(class: "flex gap-3") do
            ui_toggle(pressed: true) do
              plain "B"
            end
            ui_toggle(variant: :outline, pressed: true) do
              plain "I"
            end
          end
        end

        preview("Sizes") do
          div(class: "flex items-center gap-3") do
            ui_toggle(size: :sm) { "Sm" }
            ui_toggle(size: :default) { "Md" }
            ui_toggle(size: :lg) { "Lg" }
          end
        end

        code <<~RUBY
          ui_toggle { "B" }
          ui_toggle(variant: :outline) { "I" }
          ui_toggle(pressed: true) { "U" }
        RUBY
      end
    end
  end
end
