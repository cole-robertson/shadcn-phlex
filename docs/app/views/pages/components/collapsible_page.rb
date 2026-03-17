# frozen_string_literal: true

module Pages
  module Components
    class CollapsiblePage < BaseComponentPage
      def initialize
        super(title: "Collapsible", description: "An interactive component that expands and collapses content.")
      end

      def view_template
        preview("Default") do
          ui_collapsible(class: "max-w-sm space-y-2") do
            div(class: "flex items-center justify-between space-x-4 px-4") do
              h4(class: "text-sm font-semibold") { "@peduarte starred 3 repositories" }
              ui_collapsible_trigger do
                ui_button(variant: :ghost, size: :sm) { "Toggle" }
              end
            end
            div(class: "rounded-md border px-4 py-2 text-sm") do
              plain "@radix-ui/primitives"
            end
            ui_collapsible_content(class: "space-y-2") do
              div(class: "rounded-md border px-4 py-2 text-sm") do
                plain "@radix-ui/colors"
              end
              div(class: "rounded-md border px-4 py-2 text-sm") do
                plain "@stitches/react"
              end
            end
          end
        end

        code <<~RUBY
          ui_collapsible do
            ui_collapsible_trigger do
              ui_button(variant: :ghost) { "Toggle" }
            end
            ui_collapsible_content do
              # hidden content revealed on toggle
            end
          end
        RUBY
      end
    end
  end
end
