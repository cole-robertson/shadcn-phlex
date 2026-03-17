# frozen_string_literal: true

module Pages
  module Components
    class HoverCardPage < BaseComponentPage
      def initialize
        super(title: "Hover Card", description: "For sighted users to preview content available behind a link.")
      end

      def view_template
        preview("Default") do
          ui_hover_card do
            ui_hover_card_trigger(href: "#", class: "text-sm font-medium underline underline-offset-4") do
              plain "@shadcn"
            end
            ui_hover_card_content do
              div(class: "flex gap-4") do
                ui_avatar do
                  ui_avatar_fallback { "SC" }
                end
                div(class: "space-y-1") do
                  h4(class: "text-sm font-semibold") { "@shadcn" }
                  p(class: "text-sm text-muted-foreground") { "The creator of shadcn/ui and taxonomy." }
                  div(class: "flex items-center pt-2") do
                    span(class: "text-xs text-muted-foreground") { "Joined December 2021" }
                  end
                end
              end
            end
          end
        end

        code <<~RUBY
          ui_hover_card do
            ui_hover_card_trigger(href: "#") { "@username" }
            ui_hover_card_content do
              # card content here
            end
          end
        RUBY
      end
    end
  end
end
