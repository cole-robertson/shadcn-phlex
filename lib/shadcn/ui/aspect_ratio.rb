# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui AspectRatio
    # Uses the padding-bottom trick with absolute-positioned children
    class AspectRatio < Base
      def initialize(ratio: 1.0, **attrs)
        @ratio = ratio
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          div(style: "position: absolute; inset: 0;", &block)
        end
      end

      private

      def build_attrs
        classes = cn("relative w-full", @attrs.delete(:class))
        style = "position: relative; padding-bottom: #{(1.0 / @ratio * 100).round(4)}%"
        existing_style = @attrs.delete(:style)
        style = "#{existing_style}; #{style}" if existing_style

        @attrs.merge(
          data_slot: "aspect-ratio",
          class: classes,
          style: style
        )
      end
    end
  end
end
