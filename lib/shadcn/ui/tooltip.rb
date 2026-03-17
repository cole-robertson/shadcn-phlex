# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Tooltip
    class Tooltip < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "tooltip",
          data_controller: "shadcn--tooltip"
        )
      end
    end

    class TooltipTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "tooltip-trigger",
          data_shadcn__tooltip_target: "trigger",
          data_action: "mouseenter->shadcn--tooltip#mouseEnter mouseleave->shadcn--tooltip#mouseLeave focusin->shadcn--tooltip#focusIn focusout->shadcn--tooltip#focusOut",
          type: "button"
        )
      end
    end

    class TooltipContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background",
          "animate-in fade-in-0 zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "tooltip-content",
          data_shadcn__tooltip_target: "content",
          data_action: "mouseenter->shadcn--tooltip#contentMouseEnter mouseleave->shadcn--tooltip#contentMouseLeave",
          role: "tooltip",
          hidden: true,
          class: classes
        )
      end
    end
  end
end
