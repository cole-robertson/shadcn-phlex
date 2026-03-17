# frozen_string_literal: true

module Pages
  module Components
    class SliderPage < BaseComponentPage
      def initialize
        super(title: "Slider", description: "An input where the user selects a value from within a given range.")
      end

      def view_template
        preview("Default (50)") do
          ui_slider(value: 50, class: "max-w-md")
        end

        preview("Low value (25)") do
          ui_slider(value: 25, class: "max-w-md")
        end

        preview("High value (75)") do
          ui_slider(value: 75, class: "max-w-md")
        end

        preview("Full (100)") do
          ui_slider(value: 100, class: "max-w-md")
        end

        preview("With form name") do
          ui_slider(value: 60, name: "volume", class: "max-w-md")
        end

        code <<~RUBY
          ui_slider(value: 50)
          ui_slider(value: 75, name: "volume", min: 0, max: 100)
        RUBY
      end
    end
  end
end
