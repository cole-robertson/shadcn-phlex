# frozen_string_literal: true

module Pages
  module Components
    class ScrollAreaPage < BaseComponentPage
      TAGS = %w[
        Photography Travel Cooking Technology Fitness Music
        Art Science Reading Gaming Fashion Sports Nature
        History Design Writing Movies Gardening Crafts
      ].freeze

      def initialize
        super(title: "Scroll Area", description: "Augments native scroll functionality with custom, cross-browser styling.")
      end

      def view_template
        preview("Vertical") do
          ui_scroll_area(class: "h-72 w-48 rounded-md border") do
            div(class: "p-4") do
              h4(class: "mb-4 text-sm font-medium leading-none") { "Tags" }
              TAGS.each_with_index do |tag, i|
                div(class: "text-sm") { tag }
                ui_separator(class: "my-2") unless i == TAGS.length - 1
              end
            end
          end
        end

        preview("Horizontal") do
          ui_scroll_area(class: "w-96 whitespace-nowrap rounded-md border") do
            div(class: "flex w-max space-x-4 p-4") do
              4.times do |i|
                div(class: "flex h-24 w-36 shrink-0 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground") do
                  plain "Item #{i + 1}"
                end
              end
            end
          end
        end

        code <<~RUBY
          ui_scroll_area(class: "h-72 w-48 rounded-md border") do
            div(class: "p-4") do
              # overflowing content here
            end
          end
        RUBY
      end
    end
  end
end
