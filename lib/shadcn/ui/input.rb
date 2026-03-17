# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Input
    class Input < Base
      def initialize(type: "text", **attrs)
        @type = type
        @attrs = attrs
      end

      def view_template
        input(**build_attrs)
      end

      private

      def build_attrs
        classes = cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs",
          "transition-[color,box-shadow] outline-none",
          "selection:bg-primary selection:text-primary-foreground",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          "dark:bg-input/30",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "input", type: @type, class: classes)
      end
    end
  end
end
