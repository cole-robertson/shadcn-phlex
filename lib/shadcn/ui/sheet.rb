# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Sheet (slide-out panel)
    # Side: top, right, bottom, left
    class Sheet < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "sheet",
          data_controller: "shadcn--sheet",
          data_shadcn__sheet_open_value: false
        )
      end
    end

    class SheetTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "sheet-trigger",
          data_shadcn__sheet_target: "trigger",
          data_action: "click->shadcn--sheet#show",
          role: "button"
        )
      end
    end

    class SheetOverlay < Base
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
        @attrs.merge(
          data_slot: "sheet-overlay",
          data_shadcn__sheet_target: "overlay",
          data_action: "click->shadcn--sheet#clickOverlay",
          hidden: true,
          class: classes
        )
      end
    end

    class SheetContent < Base
      SIDE_CLASSES = {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm"
      }.freeze

      def initialize(side: :right, show_close_button: true, **attrs)
        @side = side.to_sym
        @show_close_button = show_close_button
        @attrs = attrs
      end

      def view_template(&block)
        render SheetOverlay.new

        div(**build_attrs) do
          yield if block_given?

          if @show_close_button
            button(
              data_slot: "sheet-close",
              data_action: "click->shadcn--sheet#hide",
              type: "button",
              class: "absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            ) do
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "16", height: "16",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "size-4"
              ) do |s|
                s.path(d: "M18 6 6 18")
                s.path(d: "m6 6 12 12")
              end
              span(class: "sr-only") { "Close" }
            end
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
          "data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500",
          SIDE_CLASSES[@side],
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "sheet-content",
          data_shadcn__sheet_target: "content",
          data_side: @side,
          hidden: true,
          class: classes
        )
      end
    end

    class SheetHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-col gap-1.5 p-4", @attrs.delete(:class))
        @attrs.merge(data_slot: "sheet-header", class: classes)
      end
    end

    class SheetFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("mt-auto flex flex-col gap-2 p-4", @attrs.delete(:class))
        @attrs.merge(data_slot: "sheet-footer", class: classes)
      end
    end

    class SheetTitle < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h2(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-lg font-semibold text-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "sheet-title", class: classes)
      end
    end

    class SheetDescription < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "sheet-description", class: classes)
      end
    end

    class SheetClose < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(
          data_slot: "sheet-close",
          data_action: "click->shadcn--sheet#hide",
          type: "button"
        )
      end
    end
  end
end
