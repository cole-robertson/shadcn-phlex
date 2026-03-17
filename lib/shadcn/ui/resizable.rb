# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Resizable
    # Panel groups with drag handles
    class ResizablePanelGroup < Base
      def initialize(direction: :horizontal, **attrs)
        @direction = direction
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex h-full w-full",
          @direction == :vertical ? "flex-col" : "flex-row",
          "data-[panel-group-direction=vertical]:flex-col",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "resizable-panel-group",
          data_panel_group: true,
          data_panel_group_direction: @direction,
          class: classes
        )
      end
    end

    class ResizablePanel < Base
      def initialize(default_size: nil, min_size: nil, max_size: nil, **attrs)
        @default_size = default_size
        @min_size = min_size
        @max_size = max_size
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        style_parts = []
        style_parts << "flex: #{@default_size} 1 0%" if @default_size
        style_parts << "min-width: #{@min_size}%" if @min_size
        style_parts << "max-width: #{@max_size}%" if @max_size

        classes = cn("flex-1 overflow-auto", @attrs.delete(:class))
        result = @attrs.merge(data_slot: "resizable-panel", data_panel: true, class: classes)
        result[:style] = style_parts.join("; ") unless style_parts.empty?
        result
      end
    end

    class ResizableHandle < Base
      def initialize(with_handle: false, **attrs)
        @with_handle = with_handle
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          if @with_handle
            div(class: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border") do
              svg(xmlns: "http://www.w3.org/2000/svg", width: "10", height: "10",
                  viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
                  stroke_width: "2", class: "size-2.5") do |s|
                s.path(d: "M9 5v14")
                s.path(d: "M15 5v14")
              end
            end
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn(
          "relative flex w-px items-center justify-center bg-border",
          "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
          "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1",
          "data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2",
          "data-[panel-group-direction=vertical]:after:translate-x-0",
          "[&[data-panel-group-direction=vertical]>div]:rotate-90",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "resizable-handle",
          data_panel_resize_handle: true,
          role: "separator",
          tabindex: "0",
          class: classes
        )
      end
    end
  end
end
