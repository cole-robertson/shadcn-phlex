# frozen_string_literal: true

module Pages
  module Components
    class BreadcrumbPage < BaseComponentPage
      def initialize
        super(title: "Breadcrumb", description: "Displays the path to the current resource using a hierarchy of links.")
      end

      def view_template
        preview("Default") do
          ui_breadcrumb do
            ui_breadcrumb_list do
              ui_breadcrumb_item do
                ui_breadcrumb_link(href: "#") { "Home" }
              end
              ui_breadcrumb_separator
              ui_breadcrumb_item do
                ui_breadcrumb_link(href: "#") { "Components" }
              end
              ui_breadcrumb_separator
              ui_breadcrumb_item do
                ui_breadcrumb_page { "Breadcrumb" }
              end
            end
          end
        end

        preview("With ellipsis") do
          ui_breadcrumb do
            ui_breadcrumb_list do
              ui_breadcrumb_item do
                ui_breadcrumb_link(href: "#") { "Home" }
              end
              ui_breadcrumb_separator
              ui_breadcrumb_item do
                ui_breadcrumb_ellipsis
              end
              ui_breadcrumb_separator
              ui_breadcrumb_item do
                ui_breadcrumb_link(href: "#") { "Components" }
              end
              ui_breadcrumb_separator
              ui_breadcrumb_item do
                ui_breadcrumb_page { "Breadcrumb" }
              end
            end
          end
        end

        code <<~RUBY
          ui_breadcrumb do
            ui_breadcrumb_list do
              ui_breadcrumb_item do
                ui_breadcrumb_link(href: "/") { "Home" }
              end
              ui_breadcrumb_separator
              ui_breadcrumb_item do
                ui_breadcrumb_page { "Current" }
              end
            end
          end
        RUBY
      end
    end
  end
end
