# frozen_string_literal: true

module Pages
  module Components
    class TypographyPage < BaseComponentPage
      def initialize
        super(title: "Typography", description: "Styles for headings, paragraphs, lists, and other inline text elements.")
      end

      def view_template
        preview("Headings") do
          div(class: "space-y-4") do
            ui_typography_h1 { "This is an H1" }
            ui_typography_h2 { "This is an H2" }
            ui_typography_h3 { "This is an H3" }
            ui_typography_h4 { "This is an H4" }
          end
        end

        preview("Paragraph") do
          ui_typography_p { "The king, seeing how much happier his subjects were, felt a warm glow of satisfaction. He googled 'how to be a better ruler' and mass-ordered self-help books." }
        end

        preview("Lead") do
          ui_typography_lead { "A lead paragraph stands out from regular text to introduce a section." }
        end

        preview("Blockquote") do
          ui_typography_blockquote { "After all, everyone enjoys a good quote now and then." }
        end

        preview("List") do
          ui_typography_list do
            li { "First item in the list" }
            li { "Second item in the list" }
            li { "Third item with more detail" }
          end
        end

        preview("Inline Code") do
          ui_typography_p do
            plain "Use the "
            ui_typography_inline_code { "ui_button" }
            plain " helper to render a styled button."
          end
        end

        preview("Muted") do
          ui_typography_muted { "This is muted helper text, useful for descriptions and captions." }
        end

        code <<~RUBY
          ui_typography_h1 { "Heading 1" }
          ui_typography_h2 { "Heading 2" }
          ui_typography_p { "Paragraph text." }
          ui_typography_lead { "Lead text." }
          ui_typography_blockquote { "A quote." }
          ui_typography_muted { "Muted text." }
          ui_typography_inline_code { "code" }
          ui_typography_list do
            li { "Item" }
          end
        RUBY
      end
    end
  end
end
