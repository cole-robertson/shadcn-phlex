# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Kbd
    class Kbd < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        kbd(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1",
          "rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none",
          "[&_svg:not([class*='size-'])]:size-3",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "kbd", class: classes)
      end
    end

    class KbdGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        kbd(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("inline-flex items-center gap-1", @attrs.delete(:class))
        @attrs.merge(data_slot: "kbd-group", class: classes)
      end
    end
  end
end
