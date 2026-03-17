# frozen_string_literal: true

module Pages
  module Components
    class EmptyPage < BaseComponentPage
      def initialize
        super(title: "Empty", description: "An empty state placeholder with title, description, and action.")
      end

      def view_template
        preview("Default") do
          ui_empty do
            ui_empty_media do
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "1.5",
                class: "size-12"
              ) do |s|
                s.path(stroke_linecap: "round", stroke_linejoin: "round",
                  d: "M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z")
              end
            end
            ui_empty_title { "No projects yet" }
            ui_empty_description { "Get started by creating your first project." }
            ui_empty_actions do
              ui_button { "Create Project" }
            end
          end
        end

        preview("Minimal") do
          ui_empty do
            ui_empty_title { "No results found" }
            ui_empty_description { "Try adjusting your search or filter to find what you're looking for." }
          end
        end

        code <<~RUBY
          ui_empty do
            ui_empty_title { "No items" }
            ui_empty_description { "Get started by creating one." }
            ui_empty_actions do
              ui_button { "Create" }
            end
          end
        RUBY
      end
    end
  end
end
