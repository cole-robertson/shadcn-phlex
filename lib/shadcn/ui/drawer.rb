# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Drawer
    class Drawer < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "drawer")
      end
    end

    class DrawerTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "drawer-trigger", type: "button")
      end
    end

    class DrawerClose < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "drawer-close", type: "button")
      end
    end

    class DrawerOverlay < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn(
          "fixed inset-0 z-50 bg-black/50",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "drawer-overlay", class: classes)
      end
    end

    class DrawerContent < Base
      def initialize(direction: :bottom, **attrs)
        @direction = direction.to_sym
        @attrs = attrs
      end

      def view_template(&block)
        render DrawerOverlay.new

        div(**build_attrs) do
          if @direction == :bottom
            div(class: "mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block")
          end
          yield if block_given?
        end
      end

      private

      def build_attrs
        classes = cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-background",
          direction_classes,
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "drawer-content",
          data_vaul_drawer_direction: @direction,
          class: classes
        )
      end

      def direction_classes
        case @direction
        when :top
          "inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b"
        when :bottom
          "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t"
        when :right
          "inset-y-0 right-0 w-3/4 border-l sm:max-w-sm"
        when :left
          "inset-y-0 left-0 w-3/4 border-r sm:max-w-sm"
        end
      end
    end

    class DrawerHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex flex-col gap-0.5 p-4",
          "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center",
          "group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
          "md:gap-1.5 md:text-left",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "drawer-header", class: classes)
      end
    end

    class DrawerFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("mt-auto flex flex-col gap-2 p-4", @attrs.delete(:class))
        @attrs.merge(data_slot: "drawer-footer", class: classes)
      end
    end

    class DrawerTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h2(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("font-semibold text-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "drawer-title", class: classes)
      end
    end

    class DrawerDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "drawer-description", class: classes)
      end
    end
  end
end
