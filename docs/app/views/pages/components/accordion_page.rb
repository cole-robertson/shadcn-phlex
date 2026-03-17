# frozen_string_literal: true

module Pages
  module Components
    class AccordionPage < BaseComponentPage
      def initialize
        super(title: "Accordion", description: "A vertically stacked set of interactive headings that reveal content.")
      end

      def view_template
        preview("Single (collapsible)") do
          ui_accordion(type: "single", collapsible: true, class: "max-w-md") do
            ui_accordion_item do
              ui_accordion_trigger { "Is it accessible?" }
              ui_accordion_content { "Yes. It adheres to the WAI-ARIA design pattern." }
            end
            ui_accordion_item do
              ui_accordion_trigger { "Is it styled?" }
              ui_accordion_content { "Yes. It comes with default styles that match the other components." }
            end
            ui_accordion_item do
              ui_accordion_trigger { "Is it animated?" }
              ui_accordion_content { "Yes. It's animated by default, but you can disable it if you prefer." }
            end
          end
        end

        preview("Multiple") do
          ui_accordion(type: "multiple", class: "max-w-md") do
            ui_accordion_item do
              ui_accordion_trigger { "Section One" }
              ui_accordion_content { "Content for section one. Multiple sections can be open at the same time." }
            end
            ui_accordion_item do
              ui_accordion_trigger { "Section Two" }
              ui_accordion_content { "Content for section two." }
            end
          end
        end

        code <<~RUBY
          ui_accordion(type: "single", collapsible: true) do
            ui_accordion_item do
              ui_accordion_trigger { "Question?" }
              ui_accordion_content { "Answer." }
            end
          end
        RUBY
      end
    end
  end
end
