# frozen_string_literal: true

module Pages
  module Components
    class ButtonPage < BaseComponentPage
      def initialize
        super(title: "Button", description: "Displays a button or a component that looks like a button.")
      end

      def view_template
        preview("Default") do
          ui_button { "Button" }
        end

        preview("Variants") do
          div(class: "flex flex-wrap gap-3") do
            ui_button(variant: :default) { "Default" }
            ui_button(variant: :secondary) { "Secondary" }
            ui_button(variant: :destructive) { "Destructive" }
            ui_button(variant: :outline) { "Outline" }
            ui_button(variant: :ghost) { "Ghost" }
            ui_button(variant: :link) { "Link" }
          end
        end

        preview("Sizes") do
          div(class: "flex flex-wrap items-center gap-3") do
            ui_button(size: :xs) { "XS" }
            ui_button(size: :sm) { "Small" }
            ui_button(size: :default) { "Default" }
            ui_button(size: :lg) { "Large" }
          end
        end

        preview("Icon buttons") do
          div(class: "flex flex-wrap items-center gap-3") do
            ui_button(size: :icon_xs) do
              svg(xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", fill: "none",
                  stroke: "currentColor", stroke_width: "2", class: "size-4") do |s|
                s.path(d: "M5 12h14")
              end
            end
            ui_button(size: :icon) do
              svg(xmlns: "http://www.w3.org/2000/svg", viewbox: "0 0 24 24", fill: "none",
                  stroke: "currentColor", stroke_width: "2", class: "size-4") do |s|
                s.path(d: "M5 12h14")
                s.path(d: "M12 5v14")
              end
            end
          end
        end

        preview("As link") do
          ui_button(tag: :a, href: "#", variant: :outline) { "Link Button" }
        end

        preview("Disabled") do
          ui_button(disabled: true) { "Disabled" }
        end

        preview("With Spinner (loading state)") do
          ui_button(disabled: true) do
            ui_spinner(size: :sm)
            plain " Loading..."
          end
        end

        code <<~RUBY
          ui_button(variant: :default, size: :default) { "Click me" }
          ui_button(variant: :destructive) { "Delete" }
          ui_button(variant: :outline, size: :sm) { "Small Outline" }
          ui_button(tag: :a, href: "/path") { "Link" }
        RUBY
      end
    end
  end
end
