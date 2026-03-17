# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Separator
    class Separator < Base
      def initialize(orientation: :horizontal, decorative: true, **attrs)
        @orientation = orientation
        @decorative = decorative
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn(
          "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          @attrs.delete(:class)
        )

        result = @attrs.merge(
          data_slot: "separator",
          data_orientation: @orientation,
          role: @decorative ? "none" : "separator",
          class: classes
        )
        result[:aria_orientation] = @orientation.to_s unless @decorative
        result
      end
    end
  end
end
