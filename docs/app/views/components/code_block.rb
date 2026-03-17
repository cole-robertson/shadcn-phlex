# frozen_string_literal: true

module Components
  class CodeBlock < Phlex::HTML
    def initialize(code:, language: "ruby")
      @code = code
      @language = language
    end

    def view_template
      div(class: "mt-3 rounded-md bg-muted/50 border") do
        pre(class: "overflow-x-auto p-4 text-sm") do
          code(class: "text-foreground font-mono") { @code }
        end
      end
    end
  end
end
