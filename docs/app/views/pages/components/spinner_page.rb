# frozen_string_literal: true

module Pages
  module Components
    class SpinnerPage < BaseComponentPage
      def initialize
        super(title: "Spinner", description: "A loading spinner indicator.")
      end

      def view_template
        preview("All sizes") do
          div(class: "flex items-center gap-6") do
            div(class: "flex flex-col items-center gap-2") do
              ui_spinner(size: :xs)
              span(class: "text-xs text-muted-foreground") { "xs" }
            end
            div(class: "flex flex-col items-center gap-2") do
              ui_spinner(size: :sm)
              span(class: "text-xs text-muted-foreground") { "sm" }
            end
            div(class: "flex flex-col items-center gap-2") do
              ui_spinner(size: :default)
              span(class: "text-xs text-muted-foreground") { "default" }
            end
            div(class: "flex flex-col items-center gap-2") do
              ui_spinner(size: :lg)
              span(class: "text-xs text-muted-foreground") { "lg" }
            end
          end
        end

        preview("In a button") do
          ui_button(disabled: true) do
            ui_spinner(size: :sm)
            plain " Loading..."
          end
        end

        code <<~RUBY
          ui_spinner
          ui_spinner(size: :xs)
          ui_spinner(size: :sm)
          ui_spinner(size: :lg)
        RUBY
      end
    end
  end
end
