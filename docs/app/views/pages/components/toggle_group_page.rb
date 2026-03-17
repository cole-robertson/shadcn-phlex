# frozen_string_literal: true

module Pages
  module Components
    class ToggleGroupPage < BaseComponentPage
      def initialize
        super(title: "Toggle Group", description: "A set of two-state buttons that can be toggled on or off.")
      end

      def view_template
        preview("Single selection") do
          ui_toggle_group do
            ui_toggle_group_item(value: "bold") { "B" }
            ui_toggle_group_item(value: "italic") { "I" }
            ui_toggle_group_item(value: "underline") { "U" }
          end
        end

        preview("Outline variant") do
          ui_toggle_group(variant: :outline) do
            ui_toggle_group_item(value: "left", variant: :outline) { "Left" }
            ui_toggle_group_item(value: "center", variant: :outline) { "Center" }
            ui_toggle_group_item(value: "right", variant: :outline) { "Right" }
          end
        end

        preview("Small size") do
          ui_toggle_group(size: :sm) do
            ui_toggle_group_item(value: "s", size: :sm) { "S" }
            ui_toggle_group_item(value: "m", size: :sm) { "M" }
            ui_toggle_group_item(value: "l", size: :sm) { "L" }
            ui_toggle_group_item(value: "xl", size: :sm) { "XL" }
          end
        end

        preview("With default pressed") do
          ui_toggle_group do
            ui_toggle_group_item(value: "bold", pressed: true) { "B" }
            ui_toggle_group_item(value: "italic") { "I" }
            ui_toggle_group_item(value: "underline") { "U" }
          end
        end

        code <<~RUBY
          ui_toggle_group do
            ui_toggle_group_item(value: "bold") { "B" }
            ui_toggle_group_item(value: "italic") { "I" }
            ui_toggle_group_item(value: "underline") { "U" }
          end

          ui_toggle_group(variant: :outline) do
            ui_toggle_group_item(value: "left", variant: :outline) { "Left" }
            ui_toggle_group_item(value: "center", variant: :outline) { "Center" }
          end
        RUBY
      end
    end
  end
end
