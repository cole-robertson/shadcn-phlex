# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Label
    class Label < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        label(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none",
          "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "label", class: classes)
      end
    end
  end
end
