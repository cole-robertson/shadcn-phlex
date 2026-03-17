# frozen_string_literal: true

module Pages
  module Components
    class SkeletonPage < BaseComponentPage
      def initialize
        super(title: "Skeleton", description: "Used to show a placeholder while content is loading.")
      end

      def view_template
        preview("Text lines") do
          div(class: "space-y-2 max-w-sm") do
            ui_skeleton(class: "h-4 w-3/4")
            ui_skeleton(class: "h-4 w-full")
            ui_skeleton(class: "h-4 w-5/6")
          end
        end

        preview("Circle") do
          ui_skeleton(class: "size-12 rounded-full")
        end

        preview("Card skeleton") do
          div(class: "flex items-center space-x-4 max-w-sm") do
            ui_skeleton(class: "size-12 rounded-full")
            div(class: "space-y-2 flex-1") do
              ui_skeleton(class: "h-4 w-3/4")
              ui_skeleton(class: "h-4 w-1/2")
            end
          end
        end

        preview("Full card") do
          div(class: "max-w-sm rounded-lg border p-4 space-y-4") do
            ui_skeleton(class: "h-32 w-full rounded-md")
            div(class: "space-y-2") do
              ui_skeleton(class: "h-4 w-2/3")
              ui_skeleton(class: "h-4 w-full")
              ui_skeleton(class: "h-4 w-4/5")
            end
          end
        end

        code <<~RUBY
          ui_skeleton(class: "h-4 w-full")
          ui_skeleton(class: "size-12 rounded-full")
        RUBY
      end
    end
  end
end
