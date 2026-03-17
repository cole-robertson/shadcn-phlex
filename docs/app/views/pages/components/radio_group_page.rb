# frozen_string_literal: true

module Pages
  module Components
    class RadioGroupPage < BaseComponentPage
      def initialize
        super(title: "Radio Group", description: "A set of checkable buttons where only one can be checked at a time.")
      end

      def view_template
        preview("Default", description: "Click labels to select.") do
          ui_radio_group(name: "plan", value: "free") do
            radio_option("free", "Free")
            radio_option("pro", "Pro")
            radio_option("enterprise", "Enterprise")
          end
        end

        preview("Horizontal") do
          ui_radio_group(name: "size", value: "md", class: "flex flex-row gap-4") do
            radio_option("sm", "Small")
            radio_option("md", "Medium")
            radio_option("lg", "Large")
          end
        end

        code <<~RUBY
          ui_radio_group(name: "plan", value: "free") do
            # Each item + label in a clickable label wrapper
            label(class: "flex items-center gap-2 cursor-pointer") do
              ui_radio_group_item(value: "free", checked: true)
              span { "Free" }
            end
            label(class: "flex items-center gap-2 cursor-pointer") do
              ui_radio_group_item(value: "pro")
              span { "Pro" }
            end
          end
        RUBY
      end

      private

      def radio_option(value, text)
        label(class: "flex items-center gap-2 cursor-pointer") do
          ui_radio_group_item(value: value)
          span(class: "text-sm font-medium leading-none") { text }
        end
      end
    end
  end
end
