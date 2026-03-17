# frozen_string_literal: true

module Pages
  module Components
    class AspectRatioPage < BaseComponentPage
      def initialize
        super(title: "Aspect Ratio", description: "Displays content within a desired ratio.")
      end

      def view_template
        preview("16:9 ratio") do
          div(class: "max-w-md") do
            ui_aspect_ratio(ratio: 16.0 / 9) do
              div(class: "flex h-full w-full items-center justify-center rounded-md bg-muted text-muted-foreground") do
                plain "16:9"
              end
            end
          end
        end

        preview("1:1 ratio") do
          div(class: "max-w-[200px]") do
            ui_aspect_ratio(ratio: 1.0) do
              div(class: "flex h-full w-full items-center justify-center rounded-md bg-muted text-muted-foreground") do
                plain "1:1"
              end
            end
          end
        end

        preview("4:3 ratio") do
          div(class: "max-w-md") do
            ui_aspect_ratio(ratio: 4.0 / 3) do
              div(class: "flex h-full w-full items-center justify-center rounded-md bg-muted text-muted-foreground") do
                plain "4:3"
              end
            end
          end
        end

        code <<~RUBY
          ui_aspect_ratio(ratio: 16.0 / 9) do
            img(src: "...", class: "h-full w-full rounded-md object-cover")
          end

          ui_aspect_ratio(ratio: 1.0) do
            # square content
          end
        RUBY
      end
    end
  end
end
