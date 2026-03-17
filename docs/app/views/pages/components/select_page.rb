# frozen_string_literal: true

module Pages
  module Components
    class SelectPage < BaseComponentPage
      def initialize
        super(title: "Select", description: "Displays a list of options for the user to pick from, triggered by a button.")
      end

      def view_template
        preview("Default") do
          ui_select do
            ui_select_trigger(class: "w-[200px]") do
              ui_select_value(placeholder: "Select a fruit")
            end
            ui_select_content do
              ui_select_item(value: "apple") { "Apple" }
              ui_select_item(value: "banana") { "Banana" }
              ui_select_item(value: "cherry") { "Cherry" }
              ui_select_item(value: "grape") { "Grape" }
              ui_select_item(value: "orange") { "Orange" }
            end
          end
        end

        preview("With groups") do
          ui_select(name: "timezone") do
            ui_select_trigger(class: "w-[240px]") do
              ui_select_value(placeholder: "Select a timezone")
            end
            ui_select_content do
              ui_select_group do
                ui_select_label { "North America" }
                ui_select_item(value: "est") { "Eastern Standard Time (EST)" }
                ui_select_item(value: "cst") { "Central Standard Time (CST)" }
                ui_select_item(value: "pst") { "Pacific Standard Time (PST)" }
              end
              ui_select_separator
              ui_select_group do
                ui_select_label { "Europe" }
                ui_select_item(value: "gmt") { "Greenwich Mean Time (GMT)" }
                ui_select_item(value: "cet") { "Central European Time (CET)" }
              end
            end
          end
        end

        code <<~RUBY
          ui_select(name: "fruit") do
            ui_select_trigger do
              ui_select_value(placeholder: "Pick one")
            end
            ui_select_content do
              ui_select_item(value: "apple") { "Apple" }
              ui_select_item(value: "banana") { "Banana" }
            end
          end
        RUBY
      end
    end
  end
end
