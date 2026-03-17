# frozen_string_literal: true

module Pages
  module Components
    class BaseComponentPage < Layouts::DocsLayout
      include Shadcn::Kit

      private

      def preview(title, description: nil, &block)
        render ::Components::ComponentPreview.new(title: title, description: description, &block)
      end

      def code(source)
        render ::Components::CodeBlock.new(code: source.strip)
      end
    end
  end
end
