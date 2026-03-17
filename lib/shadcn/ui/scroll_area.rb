# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui ScrollArea
    class ScrollArea < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          div(
            data_slot: "scroll-area-viewport",
            data_shadcn__scroll_area_target: "viewport",
            class: "size-full overflow-y-auto overflow-x-hidden rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 [&>div]:!block",
            style: "overflow: auto;",
            &block
          )
          render ScrollBar.new
        end
      end

      private

      def build_attrs
        classes = cn("relative overflow-hidden", @attrs.delete(:class))
        @attrs.merge(
          data_slot: "scroll-area",
          data_controller: "shadcn--scroll-area",
          class: classes
        )
      end
    end

    class ScrollBar < Base
      def initialize(orientation: :vertical, **attrs)
        @orientation = orientation
        @attrs = attrs
      end

      def view_template
        div(**build_attrs) do
          div(
            data_slot: "scroll-area-thumb",
            data_shadcn__scroll_area_target: "thumb",
            data_action: "pointerdown->shadcn--scroll-area#startDrag",
            class: "relative flex-1 rounded-full bg-border"
          )
        end
      end

      private

      def build_attrs
        orientation_classes = if @orientation == :vertical
          "h-full w-2.5 border-l border-l-transparent"
        else
          "h-2.5 flex-col border-t border-t-transparent"
        end

        classes = cn(
          "flex touch-none p-px transition-colors select-none",
          orientation_classes,
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "scroll-area-scrollbar",
          data_shadcn__scroll_area_target: "scrollbar",
          data_orientation: @orientation,
          class: classes
        )
      end
    end
  end
end
