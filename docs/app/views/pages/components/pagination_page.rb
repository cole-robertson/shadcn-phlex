# frozen_string_literal: true

module Pages
  module Components
    class PaginationPage < BaseComponentPage
      def initialize
        super(title: "Pagination", description: "Pagination with page navigation, next and previous links.")
      end

      def view_template
        preview("Default") do
          ui_pagination do
            ui_pagination_content do
              ui_pagination_item do
                ui_pagination_previous(href: "#")
              end
              ui_pagination_item do
                ui_pagination_link(href: "#") { "1" }
              end
              ui_pagination_item do
                ui_pagination_link(href: "#", active: true) { "2" }
              end
              ui_pagination_item do
                ui_pagination_link(href: "#") { "3" }
              end
              ui_pagination_item do
                ui_pagination_ellipsis
              end
              ui_pagination_item do
                ui_pagination_next(href: "#")
              end
            end
          end
        end

        code <<~RUBY
          ui_pagination do
            ui_pagination_content do
              ui_pagination_item { ui_pagination_previous(href: "#") }
              ui_pagination_item { ui_pagination_link(href: "#") { "1" } }
              ui_pagination_item { ui_pagination_link(href: "#", active: true) { "2" } }
              ui_pagination_item { ui_pagination_link(href: "#") { "3" } }
              ui_pagination_item { ui_pagination_next(href: "#") }
            end
          end
        RUBY
      end
    end
  end
end
