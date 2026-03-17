# frozen_string_literal: true

module Pages
  module Components
    class PopoverPage < BaseComponentPage
      def initialize
        super(title: "Popover", description: "Displays rich content in a portal, triggered by a button.")
      end

      def view_template
        preview("Default") do
          ui_popover do
            ui_popover_trigger do
              ui_button(variant: :outline) { "Open Popover" }
            end
            ui_popover_content(class: "w-80") do
              div(class: "grid gap-4") do
                div(class: "space-y-2") do
                  h4(class: "font-medium leading-none") { "Dimensions" }
                  p(class: "text-sm text-muted-foreground") { "Set the dimensions for the layer." }
                end
                div(class: "grid gap-2") do
                  ui_text_field(label: "Width", name: "width", placeholder: "100%")
                  ui_text_field(label: "Height", name: "height", placeholder: "25px")
                  ui_text_field(label: "Max Width", name: "max_width", placeholder: "300px")
                end
              end
            end
          end
        end

        code <<~RUBY
          ui_popover do
            ui_popover_trigger { ui_button { "Open" } }
            ui_popover_content(class: "w-80") do
              h4(class: "font-medium") { "Settings" }
              # form fields here
            end
          end
        RUBY
      end
    end
  end
end
