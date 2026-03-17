# frozen_string_literal: true

module Pages
  module Components
    class TooltipPage < BaseComponentPage
      def initialize
        super(title: "Tooltip", description: "A popup that displays information related to an element on hover.")
      end

      def view_template
        preview("Default") do
          ui_tooltip do
            ui_tooltip_trigger(class: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground") do
              plain "Hover me"
            end
            ui_tooltip_content do
              plain "This is a tooltip"
            end
          end
        end

        preview("With button") do
          ui_tooltip do
            ui_tooltip_trigger do
              ui_button(variant: :outline) { "Save" }
            end
            ui_tooltip_content do
              plain "Save your changes (Ctrl+S)"
            end
          end
        end

        code <<~RUBY
          ui_tooltip do
            ui_tooltip_trigger { "Hover me" }
            ui_tooltip_content { "Tooltip text" }
          end
        RUBY
      end
    end
  end
end
