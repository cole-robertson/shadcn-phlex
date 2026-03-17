# frozen_string_literal: true

module Pages
  module Components
    class BadgePage < BaseComponentPage
      def initialize
        super(title: "Badge", description: "Displays a badge or a component that looks like a badge.")
      end

      def view_template
        preview("Default") do
          ui_badge { "Badge" }
        end

        preview("Variants") do
          div(class: "flex flex-wrap gap-3") do
            ui_badge(variant: :default) { "Default" }
            ui_badge(variant: :secondary) { "Secondary" }
            ui_badge(variant: :destructive) { "Destructive" }
            ui_badge(variant: :outline) { "Outline" }
            ui_badge(variant: :ghost) { "Ghost" }
            ui_badge(variant: :link) { "Link" }
          end
        end

        preview("As links") do
          div(class: "flex flex-wrap gap-3") do
            ui_badge(tag: :a, href: "#", variant: :default) { "Clickable" }
            ui_badge(tag: :a, href: "#", variant: :secondary) { "Clickable" }
            ui_badge(tag: :a, href: "#", variant: :outline) { "Clickable" }
          end
        end

        code <<~RUBY
          ui_badge { "Badge" }
          ui_badge(variant: :secondary) { "Secondary" }
          ui_badge(variant: :destructive) { "Destructive" }
          ui_badge(variant: :outline) { "Outline" }
        RUBY
      end
    end
  end
end
