# frozen_string_literal: true

module Pages
  module Components
    class ProgressPage < BaseComponentPage
      def initialize
        super(title: "Progress", description: "Displays an indicator showing the completion progress of a task.")
      end

      def view_template
        preview("25%") do
          ui_progress(value: 25, class: "max-w-md")
        end

        preview("50%") do
          ui_progress(value: 50, class: "max-w-md")
        end

        preview("75%") do
          ui_progress(value: 75, class: "max-w-md")
        end

        preview("100%") do
          ui_progress(value: 100, class: "max-w-md")
        end

        preview("All values") do
          div(class: "flex flex-col gap-4 max-w-md") do
            [0, 25, 50, 75, 100].each do |v|
              div(class: "flex items-center gap-3") do
                span(class: "text-sm text-muted-foreground w-8") { "#{v}%" }
                ui_progress(value: v, class: "flex-1")
              end
            end
          end
        end

        code <<~RUBY
          ui_progress(value: 50)
          ui_progress(value: 75)
        RUBY
      end
    end
  end
end
