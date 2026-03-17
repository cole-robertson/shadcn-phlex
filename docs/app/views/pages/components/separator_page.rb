# frozen_string_literal: true

module Pages
  module Components
    class SeparatorPage < BaseComponentPage
      def initialize
        super(title: "Separator", description: "Visually or semantically separates content.")
      end

      def view_template
        preview("Horizontal") do
          div(class: "max-w-sm") do
            div(class: "space-y-1") do
              h4(class: "text-sm font-medium leading-none") { "Shadcn Phlex" }
              p(class: "text-sm text-muted-foreground") { "An open-source UI component library." }
            end
            ui_separator(class: "my-4")
            div(class: "flex h-5 items-center space-x-4 text-sm") do
              span { "Blog" }
              ui_separator(orientation: :vertical)
              span { "Docs" }
              ui_separator(orientation: :vertical)
              span { "Source" }
            end
          end
        end

        preview("Vertical") do
          div(class: "flex h-5 items-center space-x-4 text-sm") do
            span { "Home" }
            ui_separator(orientation: :vertical)
            span { "About" }
            ui_separator(orientation: :vertical)
            span { "Contact" }
          end
        end

        code <<~RUBY
          ui_separator
          ui_separator(orientation: :vertical)
          ui_separator(decorative: false)
        RUBY
      end
    end
  end
end
