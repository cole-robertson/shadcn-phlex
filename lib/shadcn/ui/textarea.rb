# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Textarea
    class Textarea < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        textarea(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2",
          "text-base shadow-xs transition-[color,box-shadow] outline-none",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "textarea", class: classes)
      end
    end
  end
end
