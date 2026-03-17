# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui InputGroup
    class InputGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-xs",
          "transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
          "[&>input]:border-0 [&>input]:bg-transparent [&>input]:shadow-none [&>input]:ring-0 [&>input]:focus-visible:ring-0 [&>input]:focus-visible:border-0",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "input-group", class: classes)
      end
    end
  end
end
