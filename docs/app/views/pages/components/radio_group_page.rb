# frozen_string_literal: true

module Pages
  module Components
    class RadioGroupPage < BaseComponentPage
      def initialize
        super(title: "Radio Group", description: "A set of checkable buttons where only one can be checked at a time.")
      end

      def view_template
        preview("Default") do
          ui_radio_group(name: "plan", value: "free") do
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "free", checked: true)
              ui_label { "Free" }
            end
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "pro")
              ui_label { "Pro" }
            end
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "enterprise")
              ui_label { "Enterprise" }
            end
          end
        end

        preview("Horizontal") do
          ui_radio_group(name: "size", value: "md", class: "flex flex-row gap-4") do
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "sm")
              ui_label { "Small" }
            end
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "md", checked: true)
              ui_label { "Medium" }
            end
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "lg")
              ui_label { "Large" }
            end
          end
        end

        code <<~RUBY
          ui_radio_group(name: "plan") do
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "free", checked: true)
              ui_label { "Free" }
            end
            div(class: "flex items-center gap-2") do
              ui_radio_group_item(value: "pro")
              ui_label { "Pro" }
            end
          end
        RUBY
      end
    end
  end
end
