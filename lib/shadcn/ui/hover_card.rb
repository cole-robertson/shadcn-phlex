# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui HoverCard
    class HoverCard < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "hover-card")
      end
    end

    class HoverCardTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "hover-card-trigger")
      end
    end

    class HoverCardContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "hover-card-content", class: classes)
      end
    end
  end
end
