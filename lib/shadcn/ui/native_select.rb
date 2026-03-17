# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui NativeSelect
    class NativeSelect < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        select(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "border-input flex h-9 w-full items-center rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
          "transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "dark:bg-input/30",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "native-select", class: classes)
      end
    end
  end
end
